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

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from config.sdk import get_company_context

load_dotenv()

with open(os.path.join(os.path.dirname(os.path.dirname(__file__)), "agent_config.yaml")) as f:
    CONFIG = yaml.safe_load(f)

AGENT_ID = CONFIG["exposure_analyzer"]["agent_id"]
API_KEY  = CONFIG["exposure_analyzer"]["api_key"]
ROOM_ID  = os.getenv("BAND_ROOM_ID")

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from agents.llm import chat

SYSTEM_PROMPT = """You are Exposure Analyzer, a compliance gap analysis agent for Synapse Fleet.

Your job:
1. Receive a structured regulation JSON from LawFeed
2. Review the company policy documents and profile provided
3. For each obligation in the regulation, determine if the company is COMPLIANT, PARTIALLY_COMPLIANT, or NON_COMPLIANT
4. Map out the full exposure surface

Respond with ONLY this JSON, no other text:
{
  "event": "exposure_mapped",
  "company": "<company name>",
  "regulation_key": "<key>",
  "regulation_name": "<name>",
  "total_obligations": <number>,
  "compliant": <number>,
  "partially_compliant": <number>,
  "non_compliant": <number>,
  "exposure_items": [
    {
      "obligation": "<obligation text>",
      "status": "<COMPLIANT|PARTIALLY_COMPLIANT|NON_COMPLIANT>",
      "evidence": "<what we found in their policies>",
      "gap": "<what is missing or unclear>"
    }
  ],
  "affected_business_units": ["<unit 1>", "<unit 2>"],
  "overall_risk_level": "<CRITICAL|HIGH|MEDIUM|LOW>",
  "summary": "<3-4 sentence summary of the exposure>"
}"""


class ExposureAnalyzerAdapter(SimpleAdapter[list]):

    def __init__(self):
        super().__init__()
        self._processed_messages = set()

    async def on_started(self, agent_name: str, agent_description: str) -> None:
        await super().on_started(agent_name, agent_description)
        print(f"[Exposure Analyzer] Agent started: {agent_name}")

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

        if AGENT_ID not in content and "exposure" not in content.lower():
            return

        print(f"[Exposure Analyzer] Received message {msg.id}...")

        if not re.search(r'"event"\s*:\s*"regulation_ingested"', content):
            print("[Exposure Analyzer] No regulation_ingested handoff in message - skipping (no model call).")
            return

        json_match = re.search(r'\{[^{}]*"event"\s*:\s*"regulation_ingested".*?\}', content, re.DOTALL)
        regulation_data = None
        if json_match:
            try:
                regulation_data = json.loads(json_match.group())
                print(f"[Exposure Analyzer] Parsed regulation: {regulation_data.get('regulation_key')}")
            except json.JSONDecodeError:
                pass

        print(f"[Exposure Analyzer] Loading company context from SDK...")
        ctx = get_company_context()
        print(f"[Exposure Analyzer] Company: {ctx['company_name']} (source: {ctx['source']})")

        company_context = f"COMPANY: {ctx['company_name']}\n\n"
        company_context += f"PROFILE:\n{json.dumps(ctx['profile'], indent=2)}\n\n"
        if ctx["policy_text"]:
            company_context += f"POLICY DOCUMENTS:\n{ctx['policy_text'][:5000]}\n\n"
        if ctx["edgar_text"]:
            company_context += f"SEC FILING DISCLOSURES:\n{ctx['edgar_text'][:3000]}\n"

        messages = [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "system", "content": f"REGULATION:\n{json.dumps(regulation_data, indent=2) if regulation_data else content}"},
            {"role": "system", "content": f"COMPANY DATA:\n{company_context}"},
            {"role": "user", "content": "Analyze the compliance exposure of this company against this regulation."}
        ]

        print(f"[Exposure Analyzer] Calling Groq...")
        raw_reply = (await chat("exposure_analyzer", messages, max_tokens=2500, temperature=0.1)).strip()
        raw_reply = raw_reply.replace("```json", "").replace("```", "").strip()

        reply = (
            f"**Exposure Analyzer — Compliance Gap Report**\n\n"
            f"```json\n{raw_reply}\n```\n\n"
            f"@risk-assessor please quantify the financial risk based on this exposure report."
        )

        print(f"[Exposure Analyzer] Sending to Band...")
        await tools.send_message(reply, mentions=["@kingnana/risk-assessor"])
        import sys, os; sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__)))); from agents.ui_reporter import report_event
        report_event("exposure_analyzer", "exposure_mapped", "Compliance gaps identified", reply)
        print(f"[Exposure Analyzer] Done.")


async def main():
    print(f"[Exposure Analyzer] Starting — agent {AGENT_ID}")
    print(f"[Exposure Analyzer] Room: {ROOM_ID}")

    adapter = ExposureAnalyzerAdapter()
    agent = Agent.create(
        adapter=adapter,
        agent_id=AGENT_ID,
        api_key=API_KEY,
    )

    print("[Exposure Analyzer] Connected to Band. Listening...")
    await run_with_graceful_shutdown(agent, timeout=30.0)


if __name__ == "__main__":
    asyncio.run(main())
