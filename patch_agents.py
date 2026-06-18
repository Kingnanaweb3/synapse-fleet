import re, os, shutil

AGENTS = {
    "agents/lawfeed.py": "lawfeed",
    "agents/exposure_analyzer.py": "exposure_analyzer",
    "agents/risk_assessor.py": "risk_assessor",
    "agents/remediation_architect.py": "remediation_architect",
    "agents/board_notifier.py": "board_notifier",
}

CLIENT_BLOCK = '''client = AsyncOpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("OPENROUTER_API_KEY"),
)'''

CLIENT_REPLACEMENT = '''sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from agents.llm import chat'''

CALL_RE = re.compile(
    r'response = await client\.chat\.completions\.create\(\s*'
    r'model="anthropic/claude-sonnet-4-5",\s*'
    r'messages=messages,\s*'
    r'max_tokens=(\d+),\s*'
    r'temperature=([\d.]+),\s*'
    r'\)\s*'
    r'raw_reply = response\.choices\[0\]\.message\.content\.strip\(\)'
)

for path, agent in AGENTS.items():
    with open(path) as f:
        src = f.read()
    shutil.copy(path, path + ".openrouter.bak")

    src, n_imp = re.subn(r'^from openai import AsyncOpenAI\n', '', src, flags=re.M)

    assert CLIENT_BLOCK in src, f"{path}: OpenRouter client block not found"
    src = src.replace(CLIENT_BLOCK, CLIENT_REPLACEMENT)

    def _repl(m):
        return f'raw_reply = (await chat("{agent}", messages, max_tokens={m.group(1)}, temperature={m.group(2)})).strip()'
    src, n_call = CALL_RE.subn(_repl, src)
    assert n_call == 1, f"{path}: expected 1 model call, patched {n_call}"

    src = src.replace("Calling OpenRouter...", "Calling Groq...")

    with open(path, "w") as f:
        f.write(src)
    print(f"  patched {path:<38} import-removed={n_imp} call-patched={n_call}")

print("\n✅ all five agents migrated to Groq (backups: *.openrouter.bak)")
