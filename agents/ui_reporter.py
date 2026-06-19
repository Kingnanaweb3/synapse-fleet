import os
import requests as req_lib

UI_SERVER = os.environ.get("UI_EVENT_URL", "http://localhost:8888/api/event")

def report_event(agent: str, event_type: str, summary: str, content: str = ""):
    try:
        req_lib.post(UI_SERVER, json={
            "agent": agent,
            "event_type": event_type,
            "summary": summary,
            "content": content,
            "created_at": __import__("datetime").datetime.utcnow().isoformat() + "Z"
        }, timeout=3)
    except Exception as e:
        print(f"[UI Reporter] Could not report event: {e}")
