import os
import json
from pathlib import Path
from typing import Optional

CONFIG_DIR = Path(__file__).parent
POLICIES_DIR = CONFIG_DIR / "policies"
PROFILE_PATH = CONFIG_DIR / "company_profile.json"


def load_company_profile() -> Optional[dict]:
    if not PROFILE_PATH.exists():
        print("[SDK] No company_profile.json found. Using demo data.")
        return None
    with open(PROFILE_PATH) as f:
        profile = json.load(f)
    print(f"[SDK] Loaded company profile: {profile.get('company_name')}")
    return profile


def load_policy_documents(max_chars_per_doc: int = 4000) -> str:
    if not POLICIES_DIR.exists():
        print("[SDK] No policies/ directory found. Using demo data.")
        return ""
    supported = [".txt", ".md"]
    docs = []
    for path in sorted(POLICIES_DIR.iterdir()):
        if path.suffix.lower() in supported:
            try:
                text = path.read_text(encoding="utf-8")[:max_chars_per_doc]
                docs.append(f"=== {path.name} ===\n{text}")
                print(f"[SDK] Loaded policy: {path.name} ({len(text)} chars)")
            except Exception as e:
                print(f"[SDK] Could not read {path.name}: {e}")
    if not docs:
        print("[SDK] No policy documents found in config/policies/")
        return ""
    combined = "\n\n".join(docs)
    print(f"[SDK] Total policy text: {len(combined)} chars across {len(docs)} documents")
    return combined


def get_company_context() -> dict:
    profile = load_company_profile()
    policies = load_policy_documents()
    if profile and policies:
        return {
            "source": "sdk",
            "company_name": profile["company_name"],
            "profile": profile,
            "policy_text": policies,
            "edgar_text": ""
        }
    print("[SDK] Falling back to Microsoft demo data...")
    import sys
    sys.path.insert(0, str(CONFIG_DIR.parent))
    from data_sources.company_policies import fetch_company_profile
    from data_sources.edgar import fetch_company_risk_disclosures
    demo = fetch_company_profile("MICROSOFT")
    edgar = fetch_company_risk_disclosures("0000789019")
    return {
        "source": "demo",
        "company_name": "Microsoft Corporation (Demo)",
        "profile": {
            "company_name": "Microsoft Corporation",
            "industry": "Technology",
            "annual_revenue_eur": 226_000_000_000,
            "employees": 228_000,
            "eu_revenue_pct": 0.28,
            "jurisdictions": ["EU", "US", "UK", "Global"],
            "publicly_listed": True
        },
        "policy_text": demo["combined_policy_text"] if demo else "",
        "edgar_text": edgar["risk_text"] if edgar else ""
    }
