import asyncio
import json
import os
import re
import sys

import yaml
from dotenv import load_dotenv

from band import Agent, run_with_graceful_shutdown
from band.core.simple_adapter import SimpleAdapter
from band.core.protocols import AgentToolsProtocol
from band.core.types import PlatformMessage

load_dotenv()

with open(os.path.join(os.path.dirname(os.path.dirname(__file__)), "agent_config.yaml")) as f:
    CONFIG = yaml.safe_load(f)

AGENT_ID = CONFIG["risk_assessor"]["agent_id"]
API_KEY  = CONFIG["risk_assessor"]["api_key"]
ROOM_ID  = os.getenv("BAND_ROOM_ID")

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from agents.llm import chat
from config.sdk import load_company_profile

# Company financials are loaded from the SDK profile in on_message.

SYSTEM_PROMPT = """You are Risk Assessor, a financial risk quantification agent for Synapse Fleet.

Your job:
1. Receive a compliance exposure report from Exposure Analyzer
2. Use the company financials provided to calculate precise financial risk
3. Assign audit probability based on severity and non-compliant items
4. Calculate maximum, expected, and minimum penalty scenarios

Respond with ONLY this JSON, no other text:
{
  "event": "risk_quantified",
  "company": "<company name>",
  "regulation_key": "<key>",
  "severity_tier": "<CRITICAL|HIGH|MEDIUM|LOW>",
  "audit_probability_pct": <number 0-100>,
  "penalty_scenarios": {
    "maximum": {
      "amount_eur": <number>,
      "basis": "<explanation>"
    },
    "expected": {
      "amount_eur": <number>,
      "basis": "<explanation>"
    },
    "minimum": {
      "amount_eur": <number>,
      "basis": "<explanation>"
    }
  },
  "non_compliant_count": <number>,
  "partially_compliant_count": <number>,
  "key_risk_drivers": ["<risk 1>", "<risk 2>", "<risk 3>"],
  "immediate_actions_required": ["<action 1>", "<action 2>", "<action 3>"],
  "estimated_remediation_cost_eur": <number>,
  "risk_vs_remediation_ratio": "<X:1 — remediation saves X euros per euro spent>",
  "summary": "<3-4 sentence executive summary of financial risk>"
}"""


class RiskAssessorAdapter(SimpleAdapter[list]):

    def __init__(self):
        super().__init__()
        self._processed_messages = set()

    async def on_started(self, agent_name: str, agent_description: str) -> None:
        await super().on_started(agent_name, agent_description)
        print(f"[Risk Assessor] Agent started: {agent_name}")

    async def on_message(
        self,
        msg: PlatformMessage,
        tools: AgentToolsProtocol,
        history: list,
        participants_msg: str | None,
        contacts_msg: str | None,
        *,
        is_session_bootstrap: bool,
        room_id: str,
    ) -> None:
        content = msg.content.strip()

        if msg.id in self._processed_messages:
            return
        self._processed_messages.add(msg.id)

        if AGENT_ID not in content and "risk-assessor" not in content.lower() and "risk assessor" not in content.lower():
            return

        print(f"[Risk Assessor] Received message...")

        if not re.search(r'"event"\s*:\s*"exposure_mapped"', content):
            print("[Risk Assessor] No exposure_mapped handoff in message - skipping (no model call).")
            return

        # Extract exposure JSON from message
        json_match = re.search(r'\{[^{}]*"event"\s*:\s*"exposure_mapped".*?\}', content, re.DOTALL)
        exposure_data = None
        if json_match:
            try:
                exposure_data = json.loads(json_match.group())
                print(f"[Risk Assessor] Parsed exposure report for: {exposure_data.get('company')}")
            except json.JSONDecodeError:
                print(f"[Risk Assessor] Could not parse exposure JSON, using full message")

        profile = load_company_profile() or {}
        company_financials = {
            "company": profile.get("company_name", "the company"),
            "industry": profile.get("industry", "Unknown"),
            "annual_revenue_eur": profile.get("annual_revenue_eur", 0),
            "employees": profile.get("employees", 0),
            "eu_revenue_pct": profile.get("eu_revenue_pct", 0),
            "publicly_listed": profile.get("publicly_listed", False),
        }

        messages = [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "system", "content": f"COMPANY FINANCIALS:\n{json.dumps(company_financials, indent=2)}"},
            {"role": "system", "content": f"EXPOSURE REPORT:\n{json.dumps(exposure_data, indent=2) if exposure_data else content}"},
            {"role": "user", "content": "Calculate the precise financial risk and penalty scenarios for this compliance exposure."}
        ]

        print(f"[Risk Assessor] Calling Groq...")
        raw_reply = (await chat("risk_assessor", messages, max_tokens=2000, temperature=0.1)).strip()
        raw_reply = raw_reply.replace("```json", "").replace("```", "").strip()

        # Pin the company so the model can't drift back to demo data.
        try:
            _parsed = json.loads(raw_reply)
            _parsed["company"] = company_financials["company"]
            raw_reply = json.dumps(_parsed, indent=2, ensure_ascii=False)
        except json.JSONDecodeError:
            pass

        reply = (
            f"**Risk Assessor — Financial Risk Quantification**\n\n"
            f"```json\n{raw_reply}\n```\n\n"
            f"@remediation-architect please generate a remediation playbook based on this risk assessment."
        )

        print(f"[Risk Assessor] Sending to Band, mentioning remediation-architect...")
        await tools.send_message(reply, mentions=["@kingnana/remediation-architect"])
        import sys, os; sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__)))); from agents.ui_reporter import report_event
        report_event("risk_assessor", "risk_quantified", "Financial risk quantified", reply)
        print(f"[Risk Assessor] Done.")


async def main():
    print(f"[Risk Assessor] Starting — agent {AGENT_ID}")
    print(f"[Risk Assessor] Room: {ROOM_ID}")

    adapter = RiskAssessorAdapter()
    agent = Agent.create(
        adapter=adapter,
        agent_id=AGENT_ID,
        api_key=API_KEY,
    )

    print("[Risk Assessor] Connected to Band. Listening...")
    await run_with_graceful_shutdown(agent, timeout=30.0)


if __name__ == "__main__":
    asyncio.run(main())
