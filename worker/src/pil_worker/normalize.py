import hashlib
import ipaddress
import re
import unicodedata
from datetime import datetime, timedelta, timezone
from html import unescape
from html.parser import HTMLParser
from urllib.parse import parse_qsl, urlencode, urlsplit, urlunsplit

from .models import CleanItem, DataQualityError, Item, Source

TRACKING = {'fbclid', 'gclid', 'mc_cid', 'mc_eid'}
STOP = {'the', 'a', 'an', 'and', 'or', 'of', 'to', 'for', 'in', 'on', 'with', 'new', 'news', 'update', 'updates'}


class TextOnly(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.parts: list[str] = []
        self.blocked = 0

    def handle_starttag(self, tag, attrs):
        if tag in {'script', 'style'}:
            self.blocked += 1

    def handle_endtag(self, tag):
        if tag in {'script', 'style'} and self.blocked:
            self.blocked -= 1

    def handle_data(self, data):
        if not self.blocked:
            self.parts.append(data)


def plain_text(value: str) -> str:
    parser = TextOnly()
    parser.feed(value)
    result = unicodedata.normalize('NFKC', unescape(' '.join(parser.parts)))
    result = ''.join(c for c in result if not unicodedata.category(c).startswith('C'))
    return re.sub(r'\s+', ' ', result).strip()


def canonicalize(url: str, allowed_hosts: tuple[str, ...] | None = None) -> str:
    if len(url) > 4096 or re.search(r'[\x00-\x20\\]', url):
        raise DataQualityError('invalid_url')
    try:
        p = urlsplit(url)
        host = (p.hostname or '').encode('idna').decode('ascii').lower().rstrip('.')
        port = p.port
    except (ValueError, UnicodeError) as e:
        raise DataQualityError('invalid_url') from e
    if p.scheme.lower() not in {'http', 'https'} or not host or p.username or p.password:
        raise DataQualityError('invalid_url')
    if port and port != (443 if p.scheme.lower() == 'https' else 80):
        raise DataQualityError('nonstandard_port')
    if host == 'localhost' or host.endswith(('.local', '.localhost')):
        raise DataQualityError('private_host')
    try:
        address = ipaddress.ip_address(host)
    except ValueError:
        address = None
    if address and not address.is_global:
        raise DataQualityError('private_host')
    if allowed_hosts is not None and host not in allowed_hosts:
        raise DataQualityError('host_not_allowed')
    query = [(k, v) for k, v in parse_qsl(p.query, keep_blank_values=True)
             if not k.lower().startswith('utm_') and k.lower() not in TRACKING]
    # Preserve path case, trailing slash, scheme and functional query parameters.
    return urlunsplit((p.scheme.lower(), host, p.path or '/', urlencode(sorted(query)), ''))


def title_features(title: str) -> tuple[tuple[str, ...], tuple[str, ...]]:
    words = re.findall(r'[\w]+', unicodedata.normalize('NFKC', title).casefold())
    tokens = tuple(sorted({w for w in words if w not in STOP and len(w) > 1}))
    numbers = tuple(sorted(set(re.findall(r'\d+(?:[.,]\d+)*', title))))
    return tokens, numbers


def clean(item: Item, source: Source, now: datetime | None = None) -> CleanItem:
    now = now or datetime.now(timezone.utc)
    source.license.check(now)
    if not source.enabled:
        raise DataQualityError('source_disabled')
    if (not isinstance(item.title, str) or not isinstance(item.url, str)
            or not isinstance(item.external_id, str) or not isinstance(item.published_at, datetime)):
        raise DataQualityError('field_type')
    title = plain_text(item.title)
    if not 8 <= len(title) <= 500:
        raise DataQualityError('title_length')
    if not item.external_id or len(item.external_id) > 1000:
        raise DataQualityError('external_id')
    if item.published_at.tzinfo is None:
        raise DataQualityError('timezone_missing')
    published = item.published_at.astimezone(timezone.utc)
    if published > now + timedelta(hours=24) or published < now - timedelta(days=90):
        raise DataQualityError('publication_window')
    url = canonicalize(item.url, source.allowed_hosts)
    excerpt = plain_text(item.excerpt)[:source.license.max_excerpt_chars]
    tokens, numbers = title_features(title)
    if len(tokens) < 2:
        raise DataQualityError('low_information_title')
    content = '\x1f'.join([title, url, published.isoformat(), excerpt])
    return CleanItem(item.external_id, title, item.url, url, hashlib.sha256(url.encode()).hexdigest(),
                     published, excerpt, tokens, numbers, hashlib.sha256(content.encode()).hexdigest())
