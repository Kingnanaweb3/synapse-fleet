import asyncio
import os
import yaml
from dotenv import load_dotenv
from band.platform.link import BandLink
from thenvoi_rest import ParticipantRequest

load_dotenv()

with open(os.path.join(os.path.dirname(os.path.dirname(__file__)), "agent_config.yaml")) as f:
    CONFIG = yaml.safe_load(f)

ROOM_ID  = os.getenv("BAND_ROOM_ID")
AGENT_ID = CONFIG["lawfeed"]["agent_id"]
API_KEY  = CONFIG["lawfeed"]["api_key"]

AGENTS_TO_ADD = [
    ("LawFeed",               CONFIG["lawfeed"]["agent_id"]),
    ("Exposure Analyzer",     CONFIG["exposure_analyzer"]["agent_id"]),
    ("Risk Assessor",         CONFIG["risk_assessor"]["agent_id"]),
    ("Remediation Architect", CONFIG["remediation_architect"]["agent_id"]),
    ("Board Notifier",        CONFIG["board_notifier"]["agent_id"]),
]


async def main():
    print(f"Adding agents to room {ROOM_ID}...")

    link = BandLink(agent_id=AGENT_ID, api_key=API_KEY)
    await link.connect()

    for name, agent_id in AGENTS_TO_ADD:
        try:
            await link.rest.agent_api_participants.add_agent_chat_participant(
                chat_id=ROOM_ID,
                participant=ParticipantRequest(participant_id=agent_id)
            )
            print(f"  ✅ Added {name}")
        except Exception as e:
            print(f"  ⚠️  {name}: {e}")

    await link.disconnect()
    print("Done.")


if __name__ == "__main__":
    asyncio.run(main())
