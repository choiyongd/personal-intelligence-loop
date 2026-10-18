from datetime import datetime

WINDOW_SECONDS = 72 * 3600
THRESHOLD = 0.72


def score(tokens: tuple[str, ...], numbers: tuple[str, ...], published: datetime,
          anchor_tokens: list[str], anchor_numbers: list[str], anchor_date: datetime) -> float:
    """Conservative title similarity. Anchor never grows: avoids transitive cluster drift.

    A lexical candidate, not a verified same-event/contradiction judgment. Different
    numeric claims stay separate pending a future claim extraction/review workflow.
    """
    if abs((published - anchor_date).total_seconds()) > WINDOW_SECONDS or list(numbers) != anchor_numbers:
        return 0.0
    left, right = set(tokens), set(anchor_tokens)
    if len(left & right) < 3:
        return 0.0
    return len(left & right) / len(left | right)


def choose_event(item, candidates):
    matches = [(score(item.tokens, item.numbers, item.published_at, c['anchor_tokens'],
                      c['anchor_numbers'], c['anchor_published_at']), str(c['id'])) for c in candidates]
    # Deterministic tie break on id; fixed anchor gives reproducible membership.
    matches.sort(key=lambda m: (-m[0], m[1]))
    return matches[0] if matches and matches[0][0] >= THRESHOLD else None
