import json, shutil

FENCE = 'raw_reply = raw_reply.replace("```json", "").replace("```", "").strip()'

# ---- lawfeed.py: pin regulation facts from the fixture ----
LF = "agents/lawfeed.py"
LF_PIN = '''
        # Pin facts we already hold in the fixture so the small model can't fumble them.
        if regulation_data:
            try:
                _parsed = json.loads(raw_reply)
                _parsed["regulation_key"] = regulation_key
                _parsed["regulation_name"] = regulation_data["name"]
                _parsed["celex"] = regulation_data["celex"]
                _parsed["max_penalty_eur"] = regulation_data["max_penalty_eur"]
                _parsed["max_penalty_pct_turnover"] = regulation_data["max_penalty_pct"]
                raw_reply = json.dumps(_parsed, indent=2)
            except (json.JSONDecodeError, KeyError) as e:
                print(f"[LawFeed] Could not pin fixture fields ({e}); using model output")'''

with open(LF) as f: s = f.read()
shutil.copy(LF, LF + ".prefacts.bak")
assert "Pin facts we already hold" not in s, f"{LF}: already patched"
assert FENCE in s, f"{LF}: fence-strip anchor not found"
s = s.replace(FENCE, FENCE + "\n" + LF_PIN, 1)
with open(LF, "w") as f: f.write(s)
print(f"  patched {LF}")

# ---- risk_assessor.py: load financials from SDK profile + pin company ----
RA = "agents/risk_assessor.py"
MS_BLOCK = '''# Microsoft financials (public, from latest annual report)
COMPANY_FINANCIALS = {
    "company": "Microsoft Corporation",
    "annual_revenue_usd": 245_000_000_000,
    "annual_revenue_eur": 226_000_000_000,
    "employees": 228_000,
    "eu_revenue_pct": 0.28,
    "industry": "Technology",
    "publicly_listed": True
}'''
LOAD_BLOCK = '''        profile = load_company_profile() or {}
        company_financials = {
            "company": profile.get("company_name", "the company"),
            "industry": profile.get("industry", "Unknown"),
            "annual_revenue_eur": profile.get("annual_revenue_eur", 0),
            "employees": profile.get("employees", 0),
            "eu_revenue_pct": profile.get("eu_revenue_pct", 0),
            "publicly_listed": profile.get("publicly_listed", False),
        }

        messages = ['''
RA_PIN = '''
        # Pin the company so the model can't drift back to demo data.
        try:
            _parsed = json.loads(raw_reply)
            _parsed["company"] = company_financials["company"]
            raw_reply = json.dumps(_parsed, indent=2)
        except json.JSONDecodeError:
            pass'''

with open(RA) as f: s = f.read()
shutil.copy(RA, RA + ".prefacts.bak")
assert "Pin the company" not in s, f"{RA}: already patched"
assert MS_BLOCK in s, f"{RA}: Microsoft financials block not found"
s = s.replace(MS_BLOCK, "# Company financials are loaded from the SDK profile in on_message.", 1)
assert "from agents.llm import chat" in s, f"{RA}: chat import not found"
s = s.replace("from agents.llm import chat",
              "from agents.llm import chat\nfrom config.sdk import load_company_profile", 1)
assert "        messages = [" in s, f"{RA}: messages anchor not found"
s = s.replace("        messages = [", LOAD_BLOCK, 1)
assert "json.dumps(COMPANY_FINANCIALS, indent=2)" in s, f"{RA}: financials usage not found"
s = s.replace("json.dumps(COMPANY_FINANCIALS, indent=2)",
              "json.dumps(company_financials, indent=2)", 1)
assert FENCE in s, f"{RA}: fence-strip anchor not found"
s = s.replace(FENCE, FENCE + "\n" + RA_PIN, 1)
with open(RA, "w") as f: f.write(s)
print(f"  patched {RA}")

print("\n✅ fact-pinning applied (backups: *.prefacts.bak)")
