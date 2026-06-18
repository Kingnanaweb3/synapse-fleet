# Single place for the Groq key + per-agent model routing.
import asyncio, os, re

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

from openai import AsyncOpenAI, RateLimitError

GROQ_BASE_URL = "https://api.groq.com/openai/v1"

# logical name -> Groq model id
MODELS = {
    "llama-8b":     "llama-3.1-8b-instant",
    "llama-70b":    "llama-3.3-70b-versatile",
    "gpt-oss-20b":  "openai/gpt-oss-20b",
    "gpt-oss-120b": "openai/gpt-oss-120b",
}

# per-agent assignment (matched to task difficulty) — change one value to re-route
AGENT_MODELS = {
    "lawfeed":               "llama-8b",       # light ingest / parse
    "exposure_analyzer":     "llama-70b",      # mapping
    "board_notifier":        "llama-70b",      # writing the memo (shares 70B)
    "remediation_architect": "gpt-oss-20b",    # planning / fast reasoning
    "risk_assessor":         "gpt-oss-120b",   # hardest reasoning
}
DEFAULT_MODEL = "llama-70b"

_client = None
def _get_client():
    global _client
    if _client is None:
        key = os.environ.get("GROQ_API_KEY")
        if not key:
            raise RuntimeError("Missing GROQ_API_KEY (put it in .env)")
        _client = AsyncOpenAI(base_url=GROQ_BASE_URL, api_key=key)
    return _client

_NORM = {"\u202f": " ", "\u00a0": " ", "\u2009": " ", "\u2011": "-"}

def _normalize(text):
    for k, v in _NORM.items():
        text = (text or "").replace(k, v)
    return text

def _strip_think(text):
    text = re.sub(r"<think>.*?</think>", "", text or "", flags=re.DOTALL)
    return _normalize(text).strip()

def _retry_after(err, fallback):
    # Groq tells us how long to wait — honor it when present.
    try:
        ra = err.response.headers.get("retry-after")
        if ra:
            return float(ra) + 0.5
    except Exception:
        pass
    m = re.search(r"try again in ([\d.]+)s", str(err))
    return (float(m.group(1)) + 0.5) if m else fallback

async def chat(agent, messages, temperature=0.3, max_tokens=1024, _max_retries=5, **kwargs):
    model_id = MODELS[AGENT_MODELS.get(agent, DEFAULT_MODEL)]
    # gpt-oss "thinks" before answering; give the JSON answer room.
    if model_id.startswith("openai/gpt-oss"):
        max_tokens = max(max_tokens, 4096)
    delay = 2.0
    for attempt in range(_max_retries + 1):
        try:
            resp = await _get_client().chat.completions.create(
                model=model_id, messages=messages,
                temperature=temperature, max_tokens=max_tokens, **kwargs,
            )
            return _strip_think(resp.choices[0].message.content)
        except RateLimitError as e:
            if attempt == _max_retries:
                raise
            wait = min(_retry_after(e, delay), 30.0)
            print(f"[llm] {agent} ({model_id}) hit Groq TPM limit — waiting {wait:.0f}s, retry {attempt+1}/{_max_retries}")
            await asyncio.sleep(wait)
            delay = min(delay * 2, 30.0)
