from dataclasses import dataclass
from datetime import datetime, timezone


class PolicyDenied(ValueError):
    pass


class DataQualityError(ValueError):
    pass


@dataclass(frozen=True)
class License:
    id: str
    status: str
    allow_metadata: bool
    max_excerpt_chars: int
    review_due_at: datetime

    def check(self, now: datetime | None = None) -> None:
        if (self.status != 'approved' or not self.allow_metadata
                or self.review_due_at <= (now or datetime.now(timezone.utc))):
            raise PolicyDenied('license_denied')


@dataclass(frozen=True)
class Source:
    id: str
    kind: str
    endpoint: str
    allowed_hosts: tuple[str, ...]
    license: License
    enabled: bool = True


@dataclass(frozen=True)
class Item:
    external_id: str
    title: str
    url: str
    published_at: datetime
    excerpt: str = ''


@dataclass(frozen=True)
class CleanItem:
    external_id: str
    title: str
    original_url: str
    canonical_url: str
    url_hash: str
    published_at: datetime
    excerpt: str
    tokens: tuple[str, ...]
    numbers: tuple[str, ...]
    content_hash: str
