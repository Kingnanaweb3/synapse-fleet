import httpx
import re
from typing import Optional

COMPANIES = {
    "MICROSOFT": {
        "name": "Microsoft Corporation",
        "cik": "0000789019",
        "privacy_policy_url": "https://privacy.microsoft.com/en-us/privacystatement",
        "ai_policy_url": "https://www.microsoft.com/en-us/ai/responsible-ai",
        "data_governance_url": "https://www.microsoft.com/en-us/trust-center/privacy"
    },
    "META": {
        "name": "Meta Platforms Inc",
        "cik": "0001326801",
        "privacy_policy_url": "https://www.facebook.com/privacy/policy/",
        "ai_policy_url": "https://ai.meta.com/responsible-ai/",
        "data_governance_url": "https://www.facebook.com/privacy/center/"
    },
    "GOOGLE": {
        "name": "Alphabet Inc (Google)",
        "cik": "0001652044",
        "privacy_policy_url": "https://policies.google.com/privacy",
        "ai_policy_url": "https://ai.google/responsibility/responsible-ai-practices/",
        "data_governance_url": "https://safety.google/privacy/"
    },
    "APPLE": {
        "name": "Apple Inc",
        "cik": "0000320193",
        "privacy_policy_url": "https://www.apple.com/legal/privacy/en-ww/",
        "ai_policy_url": "https://www.apple.com/privacy/",
        "data_governance_url": "https://www.apple.com/privacy/approach-to-privacy/"
    }
}

HEADERS = {
    "User-Agent": "Mozilla/5.0 (compatible; SynapseFleet/1.0; compliance-research@synapsefleet.ai)",
    "Accept": "text/html,application/xhtml+xml",
    "Accept-Language": "en-US,en;q=0.9"
}


def fetch_policy(url: str, max_chars: int = 6000) -> Optional[str]:
    """
    Fetches and cleans a public policy page from a company website.
    """
    try:
        response = httpx.get(url, headers=HEADERS, timeout=30, follow_redirects=True)
        response.raise_for_status()

        text = re.sub(r"<script[^>]*>.*?</script>", " ", response.text, flags=re.DOTALL)
        text = re.sub(r"<style[^>]*>.*?</style>", " ", text, flags=re.DOTALL)
        text = re.sub(r"<[^>]+>", " ", text)
        text = re.sub(r"\s+", " ", text).strip()
        text = re.sub(r"&#\w+;", " ", text)

        return text[:max_chars]

    except Exception as e:
        print(f"[Policy] Error fetching {url}: {e}")
        return None


def fetch_company_profile(company_key: str) -> Optional[dict]:
    """
    Fetches all available public policy documents for a company.
    Returns a structured profile Exposure Analyzer can scan.
    """
    if company_key not in COMPANIES:
        raise ValueError(f"Unknown company: {company_key}. Choose from {list(COMPANIES.keys())}")

    company = COMPANIES[company_key]
    print(f"\n[Policy] Building compliance profile for {company['name']}...")

    privacy_text = None
    ai_policy_text = None

    print(f"[Policy] Fetching privacy policy...")
    privacy_text = fetch_policy(company["privacy_policy_url"])
    if privacy_text:
        print(f"[Policy] Got {len(privacy_text)} chars of privacy policy")
    else:
        print(f"[Policy] Privacy policy fetch failed")

    print(f"[Policy] Fetching AI policy...")
    ai_policy_text = fetch_policy(company["ai_policy_url"])
    if ai_policy_text:
        print(f"[Policy] Got {len(ai_policy_text)} chars of AI policy")
    else:
        print(f"[Policy] AI policy fetch failed")

    combined = ""
    if privacy_text:
        combined += f"=== PRIVACY POLICY ===\n{privacy_text}\n\n"
    if ai_policy_text:
        combined += f"=== AI & RESPONSIBLE USE POLICY ===\n{ai_policy_text}\n\n"

    if not combined:
        print(f"[Policy] Could not fetch any policy documents for {company['name']}")
        return None

    print(f"[Policy] Successfully built profile: {len(combined)} total characters")

    return {
        "company_key": company_key,
        "company_name": company["name"],
        "cik": company["cik"],
        "privacy_policy_url": company["privacy_policy_url"],
        "ai_policy_url": company["ai_policy_url"],
        "combined_policy_text": combined,
        "sources": [
            company["privacy_policy_url"],
            company["ai_policy_url"]
        ]
    }


def list_available_companies() -> list:
    return [{"key": k, "name": v["name"]} for k, v in COMPANIES.items()]


if __name__ == "__main__":
    print("Available companies:")
    for c in list_available_companies():
        print(f"  {c['key']} — {c['name']}")

    print("\nTesting with Microsoft...")
    result = fetch_company_profile("MICROSOFT")
    if result:
        print(f"\nCompany: {result['company_name']}")
        print(f"Sources: {result['sources']}")
        print(f"Combined policy preview:\n{result['combined_policy_text'][:400]}...")
    else:
        print("Failed to fetch company profile.")
