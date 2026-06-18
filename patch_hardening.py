import shutil

def patch(path, edits, sentinel):
    with open(path) as f: s = f.read()
    if sentinel in s:
        print(f"  SKIP {path} (already hardened)"); return
    shutil.copy(path, path + ".hardening.bak")
    for old, new in edits:
        assert old in s, f"{path}: anchor not found -> {old[:55]!r}"
        s = s.replace(old, new, 1)
    with open(path, "w") as f: f.write(s)
    print(f"  patched {path}")

def guard(event, label):
    return (
        '\n\n        if not re.search(r\'"event"\\s*:\\s*"' + event + '"\', content):'
        '\n            print("[' + label + '] No ' + event + ' handoff in message - skipping (no model call).")'
        '\n            return'
    )

patch("agents/llm.py", [
    ('def _strip_think(text):\n    return re.sub(r"<think>.*?</think>", "", text or "", flags=re.DOTALL).strip()',
     '_NORM = {"\\u202f": " ", "\\u00a0": " ", "\\u2009": " ", "\\u2011": "-"}\n\n'
     'def _normalize(text):\n    for k, v in _NORM.items():\n        text = (text or "").replace(k, v)\n    return text\n\n'
     'def _strip_think(text):\n    text = re.sub(r"<think>.*?</think>", "", text or "", flags=re.DOTALL)\n    return _normalize(text).strip()'),
], sentinel="_normalize(")

patch("agents/lawfeed.py", [
    ("import os\nimport sys\n", "import os\nimport sys\nimport time\n"),
    ("        self._room_initialized = False",
     "        self._room_initialized = False\n        self._processed_messages = set()\n        self._last_kickoff = {}"),
    ('        print(f"[LawFeed] Received: {content[:120]}...")',
     '        if msg.id in self._processed_messages:\n            return\n        self._processed_messages.add(msg.id)\n\n        print(f"[LawFeed] Received: {content[:120]}...")'),
    ("        regulation_data = None",
     '        if regulation_key:\n            now = time.time()\n            if now - self._last_kickoff.get(regulation_key, 0) < 45:\n                print(f"[LawFeed] Repeat {regulation_key} within 45s cooldown - skipping to save tokens.")\n                return\n            self._last_kickoff[regulation_key] = now\n\n        regulation_data = None'),
    ("                raw_reply = json.dumps(_parsed, indent=2)",
     "                raw_reply = json.dumps(_parsed, indent=2, ensure_ascii=False)"),
], sentinel="_last_kickoff")

patch("agents/risk_assessor.py", [
    ("        super().__init__()\n\n    async def on_started",
     "        super().__init__()\n        self._processed_messages = set()\n\n    async def on_started"),
    ('        content = msg.content.strip()\n\n        if AGENT_ID not in content and "risk-assessor"',
     '        content = msg.content.strip()\n\n        if msg.id in self._processed_messages:\n            return\n        self._processed_messages.add(msg.id)\n\n        if AGENT_ID not in content and "risk-assessor"'),
    ('        print(f"[Risk Assessor] Received message...")',
     '        print(f"[Risk Assessor] Received message...")' + guard("exposure_mapped", "Risk Assessor")),
    ("            raw_reply = json.dumps(_parsed, indent=2)",
     "            raw_reply = json.dumps(_parsed, indent=2, ensure_ascii=False)"),
], sentinel="No exposure_mapped handoff")

patch("agents/exposure_analyzer.py", [
    ('        print(f"[Exposure Analyzer] Received message {msg.id}...")',
     '        print(f"[Exposure Analyzer] Received message {msg.id}...")' + guard("regulation_ingested", "Exposure Analyzer")),
], sentinel="No regulation_ingested handoff")

patch("agents/remediation_architect.py", [
    ('        print(f"[Remediation Architect] Received message {msg.id}...")',
     '        print(f"[Remediation Architect] Received message {msg.id}...")' + guard("risk_quantified", "Remediation Architect")),
], sentinel="No risk_quantified handoff")

patch("agents/board_notifier.py", [
    ('        print(f"[Board Notifier] Received message {msg.id}...")',
     '        print(f"[Board Notifier] Received message {msg.id}...")' + guard("remediation_plan_ready", "Board Notifier")),
], sentinel="No remediation_plan_ready handoff")

print("\n✅ hardening applied (backups: *.hardening.bak)")
