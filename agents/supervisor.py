"""Resilient Band runner.

The Band SDK has no auto-reconnect and no keep-alive, so a dropped WebSocket
leaves an agent silently deaf until the process restarts. run_resilient
supervises an agent: it reconnects when the connection ends, and proactively
refreshes the socket on an interval so it never sits idle long enough to be
dropped. The adapter is reused across reconnects so its message-dedup and
cooldown state survive (prevents reprocessing of redelivered messages).
"""

import asyncio

RECYCLE_SECONDS = 120   # refresh the socket this often to beat idle disconnects
BACKOFF_START = 2
BACKOFF_MAX = 15
STOP_TIMEOUT = 10


async def _safe_stop(agent):
    try:
        await asyncio.wait_for(agent.stop(), timeout=STOP_TIMEOUT)
    except Exception:
        pass


async def run_resilient(make_agent, label, recycle_seconds=RECYCLE_SECONDS):
    backoff = BACKOFF_START
    while True:
        agent = make_agent()
        try:
            await agent.start()
            print(f"[{label}] Connected to Band. Listening...", flush=True)
            backoff = BACKOFF_START
            try:
                await asyncio.wait_for(agent.run_forever(), timeout=recycle_seconds)
                print(f"[{label}] Connection ended — reconnecting...", flush=True)
            except asyncio.TimeoutError:
                print(f"[{label}] Keep-alive refresh — recycling socket...", flush=True)
            await _safe_stop(agent)
            await asyncio.sleep(1)
        except asyncio.CancelledError:
            print(f"[{label}] Shutdown requested.", flush=True)
            await _safe_stop(agent)
            raise
        except Exception as e:
            print(f"[{label}] Connection error: {e!r} — reconnecting in {backoff}s", flush=True)
            await _safe_stop(agent)
            await asyncio.sleep(backoff)
            backoff = min(backoff * 2, BACKOFF_MAX)
