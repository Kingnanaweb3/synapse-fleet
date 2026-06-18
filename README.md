# 🛰️ Synapse Fleet

**Autonomous compliance intelligence — from regulation drop to board decision in minutes.**

Synapse Fleet is a team of five AI agents that read a new regulation, scan your company against it, put a number on the risk, draft a fix-it plan, and hand your board a ready-to-sign memo — coordinating with each other the whole way, with a human approving before anything ships.

Built for the **Band of Agents Hackathon**.

---

## The problem

When a regulation lands — GDPR, the EU AI Act, DORA — enterprises have days or weeks to understand their exposure before penalties bite. Reading the law, checking it against internal policy, pricing the risk, planning remediation, and briefing the board normally takes a team of specialists weeks. Synapse Fleet does it in minutes, and shows its work at every step.

---

## How it works

Five specialist agents pass the job down a chain. Each emits a structured result that triggers the next:

```
  @lawfeed analyze GDPR
          │
          ▼
  LawFeed → Exposure Analyzer → Risk Assessor → Remediation Architect → Board Notifier → 🧑 You
  reads law   finds the gaps     prices the risk   writes the plan        drafts the memo   approve / reject
```

| # | Agent | What it does | Emits |
|---|-------|--------------|-------|
| 1 | **LawFeed** | Ingests the regulation; extracts obligations, penalties, deadlines | `regulation_ingested` |
| 2 | **Exposure Analyzer** | Scans your policies against each obligation, flags gaps | `exposure_mapped` |
| 3 | **Risk Assessor** | Turns gaps into € exposure using your financials + audit odds | `risk_quantified` |
| 4 | **Remediation Architect** | Builds a prioritized plan with owners, timelines, costs | `remediation_plan_ready` |
| 5 | **Board Notifier** | Synthesizes everything into a board memo, flags for sign-off | `board_memo_pending_approval` |

Agents talk through **Band** (a shared room with @mentions). Reasoning runs on **Groq**, with each agent on the model that fits its job:

| Agent | Groq model | Why |
|-------|------------|-----|
| LawFeed | `llama-3.1-8b-instant` | fast, lightweight ingestion |
| Exposure Analyzer | `llama-3.3-70b-versatile` | mapping policies to obligations |
| Risk Assessor | `openai/gpt-oss-120b` | the hardest reasoning |
| Remediation Architect | `openai/gpt-oss-20b` | fast planning |
| Board Notifier | `llama-3.3-70b-versatile` | clean executive writing |

---

## Tech stack

- **Agents:** Band SDK (Python) for multi-agent coordination
- **Reasoning:** Groq (OpenAI-compatible) — Llama 3.1/3.3 + GPT-OSS
- **Backend:** Flask (dashboard API, port 8888)
- **Frontend:** React + Vite — a live dashboard (`ui/`) and a landing page (`landing/`)
- **Data:** real EU regulation text + your own company profile & policies (via the SDK)
- **Tooling:** `uv` (Python), `npm` (frontend), Python 3.12+

---

## Quickstart

### 1. Prerequisites
- Python 3.12+ and [`uv`](https://docs.astral.sh/uv/)
- Node.js 18+ and npm
- A free [Groq API key](https://console.groq.com)
- A [Band](https://band.ai) account: create five agents (one per role above) and one shared room

### 2. Install
```bash
git clone https://github.com/Kingnanaweb3/synapse-fleet.git
cd synapse-fleet
uv sync
cd ui && npm install && cd ..
cd landing && npm install && cd ..
```

### 3. Configure secrets
Create `.env` in the project root:
```
GROQ_API_KEY=gsk_your_key_here
BAND_ROOM_ID=your-band-room-id
```

Create `agent_config.yaml` with your five Band agents:
```yaml
lawfeed:
  agent_id: "your-lawfeed-agent-id"
  api_key: "your-lawfeed-key"
exposure_analyzer:
  agent_id: "..."
  api_key: "..."
risk_assessor:
  agent_id: "..."
  api_key: "..."
remediation_architect:
  agent_id: "..."
  api_key: "..."
board_notifier:
  agent_id: "..."
  api_key: "..."
```
> Both files are git-ignored. Never commit them.

### 4. Run it (four terminals)
```bash
uv run python main.py                          # 1 — the agents
uv run python ui/server.py                     # 2 — dashboard backend (:8888)
cd ui && npm run dev                           # 3 — dashboard (:5173)
cd landing && npm run dev -- --port 5174       # 4 — landing page (:5174)
```

### 5. Start an analysis
In your Band room, post:
```
@lawfeed analyze GDPR
```
(Also `EU_AI_ACT` or `DORA`.) Watch the agents fire in sequence on the dashboard at `http://localhost:5173`, then approve the board memo.

---

## Using the SDK — analyze *your* company

Out of the box the demo analyzes a sample firm (**Acme Financial Services Ltd**). To point Synapse Fleet at a real company, you only touch two things — no code changes.

### 1. Describe the company → `config/company_profile.json`
```json
{
  "company_name": "Acme Financial Services Ltd",
  "industry": "Financial Services",
  "annual_revenue_eur": 1065000000,
  "employees": 3200,
  "eu_revenue_pct": 0.65,
  "jurisdictions": ["Ireland", "Germany", "France", "Netherlands"],
  "publicly_listed": false,
  "has_dpo": true,
  "notes": "Mid-size EU financial firm with cross-border operations"
}
```
> `annual_revenue_eur` drives the risk math: GDPR fines are capped at the greater of €20M or **4% of turnover**.

### 2. Drop in the policies → `config/policies/`
Put the company's real policy documents (`.txt` or `.md`) here. The Exposure Analyzer reads them to decide what's compliant vs. a gap:
```
config/policies/
├── data_retention_policy.txt
├── privacy_policy.md
└── incident_response.txt
```

Run `@lawfeed analyze GDPR` and the report is now about your company.

### Importing the SDK in your own code
The SDK lives in `config/sdk.py` and exposes three functions:

```python
from config.sdk import get_company_context, load_company_profile, load_policy_documents

# Everything an agent needs, in one call:
ctx = get_company_context()
print(ctx["company_name"])   # "Acme Financial Services Ltd"
print(ctx["source"])         # "sdk" (your data) or "demo" (fallback)
print(ctx["profile"])        # the full profile dict
print(ctx["policy_text"])    # your policy docs, concatenated

# Or load the pieces individually:
profile  = load_company_profile()                          # dict, or None if no profile file
policies = load_policy_documents(max_chars_per_doc=4000)   # combined policy text
```

`get_company_context()` returns:

| key | meaning |
|-----|---------|
| `source` | `"sdk"` if it found your profile + policies, else `"demo"` |
| `company_name` | the company being analyzed |
| `profile` | the full profile dict from `company_profile.json` |
| `policy_text` | your policy documents, concatenated |
| `edgar_text` | SEC filing text (demo fallback only) |

**Fallback:** if no `company_profile.json` (or no policy docs) exist, the SDK automatically falls back to public demo data so it still runs. Add your own profile and policies and it switches to your company automatically.

---

## Project structure
```
synapse-fleet/
├── agents/              # the five agents + shared LLM router (llm.py)
├── config/              # the SDK: company_profile.json, policies/, sdk.py
├── data_sources/        # regulation text (GDPR, EU AI Act, DORA)
├── ui/                  # dashboard (React) + Flask server
├── landing/             # marketing landing page (React)
├── main.py              # launches all five agents
└── agent_config.yaml    # Band agent IDs + keys (git-ignored)
```

### Re-routing a model
Every agent's model is set in one place — the `AGENT_MODELS` map in `agents/llm.py`. Change a value to move an agent to a different Groq model.

---

*Synapse Fleet — autonomous compliance intelligence for a world of evolving regulations. Built for the Band of Agents Hackathon.*