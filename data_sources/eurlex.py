import httpx
import re
from typing import Optional

REGULATIONS = {
    "GDPR": {
        "celex": "32016R0679",
        "name": "General Data Protection Regulation",
        "max_penalty_eur": 20_000_000,
        "max_penalty_pct": 4.0,
        "url": "https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:32016R0679"
    },
    "EU_AI_ACT": {
        "celex": "32024R1689",
        "name": "EU Artificial Intelligence Act",
        "max_penalty_eur": 35_000_000,
        "max_penalty_pct": 7.0,
        "url": "https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:32024R1689"
    },
    "DORA": {
        "celex": "32022R2554",
        "name": "Digital Operational Resilience Act",
        "max_penalty_eur": 10_000_000,
        "max_penalty_pct": 2.0,
        "url": "https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:32022R2554"
    }
}


def fetch_regulation(regulation_key: str, max_chars: int = 8000) -> Optional[dict]:
    """
    Fetches live regulation text from EUR-Lex.
    Returns a structured dict ready for LawFeed to process.
    """
    if regulation_key not in REGULATIONS:
        raise ValueError(f"Unknown regulation: {regulation_key}. Choose from {list(REGULATIONS.keys())}")

    reg = REGULATIONS[regulation_key]

    print(f"[EUR-Lex] Fetching {reg['name']} from EUR-Lex...")

    try:
        response = httpx.get(reg["url"], timeout=30, follow_redirects=True)
        response.raise_for_status()

        raw_html = response.text

        clean_text = re.sub(r"<[^>]+>", " ", raw_html)
        clean_text = re.sub(r"\s+", " ", clean_text).strip()
        clean_text = clean_text[:max_chars]

        print(f"[EUR-Lex] Successfully fetched {len(clean_text)} characters of {reg['name']}")

        return {
            "regulation_key": regulation_key,
            "celex": reg["celex"],
            "name": reg["name"],
            "max_penalty_eur": reg["max_penalty_eur"],
            "max_penalty_pct": reg["max_penalty_pct"],
            "source_url": reg["url"],
            "raw_text": clean_text
        }

    except httpx.HTTPError as e:
        print(f"[EUR-Lex] HTTP error fetching regulation: {e}")
        return None
    except Exception as e:
        print(f"[EUR-Lex] Unexpected error: {e}")
        return None


def list_available_regulations() -> list:
    return [
        {"key": k, "name": v["name"], "celex": v["celex"]}
        for k, v in REGULATIONS.items()
    ]


if __name__ == "__main__":
    print("Available regulations:")
    for r in list_available_regulations():
        print(f"  {r['key']} — {r['name']} ({r['celex']})")

    print("\nTesting EUR-Lex fetch with GDPR...")
    result = fetch_regulation("GDPR")
    if result:
        print(f"\nRegulation: {result['name']}")
        print(f"CELEX: {result['celex']}")
        print(f"Max penalty: €{result['max_penalty_eur']:,} or {result['max_penalty_pct']}% of global turnover")
        print(f"Text preview: {result['raw_text'][:300]}...")
    else:
        print("Failed to fetch regulation.")
