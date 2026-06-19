import os
import sys
import yaml
import json
import subprocess
from flask import Flask, jsonify, request, send_from_directory
from dotenv import load_dotenv
import requests

load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env"))
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

with open(os.path.join(os.path.dirname(os.path.dirname(__file__)), "agent_config.yaml")) as f:
    CONFIG = yaml.safe_load(f)

ROOM_ID     = os.getenv("BAND_ROOM_ID")
LAWFEED_ID  = CONFIG["lawfeed"]["agent_id"]
BOARD_ID    = CONFIG["board_notifier"]["agent_id"]
BOARD_KEY   = CONFIG["board_notifier"]["api_key"]
LAWFEED_KEY = CONFIG["lawfeed"]["api_key"]

EVENTS_FILE = os.path.join(os.path.dirname(os.path.dirname(__file__)), "ui_events.json")

app = Flask(__name__, static_folder=os.path.join(os.path.dirname(__file__), "dist"))

def band_post(api_key, body):
    r = requests.post(
        f"https://app.band.ai/api/v1/agent/chats/{ROOM_ID}/messages",
        headers={"X-API-Key": api_key, "Content-Type": "application/json"},
        json=body, timeout=15,
    )
    return r.text

@app.route("/api/messages")
def get_messages():
    try:
        if os.path.exists(EVENTS_FILE):
            with open(EVENTS_FILE) as f:
                events = json.load(f)
            return jsonify({"messages": events})
        return jsonify({"messages": []})
    except Exception as e:
        return jsonify({"error": str(e), "messages": []})

@app.route("/api/start", methods=["POST"])
def start_analysis():
    body = request.get_json()
    regulation = body.get("regulation", "GDPR")
    # Clear events file
    with open(EVENTS_FILE, "w") as f:
        json.dump([], f)
    # Use Board Notifier key to mention LawFeed
    result = band_post(BOARD_KEY, {
        "message": {
            "content": f"@[[{LAWFEED_ID}]] analyze {regulation}",
            "mentions": [{"id": LAWFEED_ID}]
        }
    })
    return jsonify({"ok": True, "band_response": result})

@app.route("/api/approve", methods=["POST"])
def approve():
    # Use LawFeed key to mention Board Notifier
    result = band_post(LAWFEED_KEY, {
        "message": {
            "content": f"@[[{BOARD_ID}]] APPROVED — dispatch the compliance package.",
            "mentions": [{"id": BOARD_ID}]
        }
    })
    return jsonify({"ok": True, "band_response": result})

@app.route("/api/event", methods=["POST"])
def receive_event():
    event = request.get_json()
    events = []
    if os.path.exists(EVENTS_FILE):
        with open(EVENTS_FILE) as f:
            try:
                events = json.load(f)
            except Exception:
                events = []
    events.append(event)
    with open(EVENTS_FILE, "w") as f:
        json.dump(events, f)
    return jsonify({"ok": True})

@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve(path):
    dist = os.path.join(os.path.dirname(__file__), "dist")
    if path and os.path.exists(os.path.join(dist, path)):
        return send_from_directory(dist, path)
    return send_from_directory(dist, "index.html")

if __name__ == "__main__":
    print(f"Synapse Fleet UI — http://localhost:8888")
    print(f"Room: {ROOM_ID}")
    app.run(debug=False, host="0.0.0.0", port=int(os.environ.get("PORT", 8888)))
