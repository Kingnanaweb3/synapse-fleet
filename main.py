import asyncio
import os
import sys
from dotenv import load_dotenv

load_dotenv()

async def run_agent(name: str, module: str):
    """Run a single agent as a subprocess."""
    print(f"[Main] Starting {name}...")
    proc = await asyncio.create_subprocess_exec(
        sys.executable, f"agents/{module}.py",
        stdout=asyncio.subprocess.PIPE,
        stderr=asyncio.subprocess.STDOUT,
    )

    async def stream_output():
        while True:
            line = await proc.stdout.readline()
            if not line:
                break
            print(f"[{name}] {line.decode().rstrip()}")

    return proc, stream_output


async def main():
    print("=" * 60)
    print("  SYNAPSE FLEET — Regulatory Compliance Intelligence")
    print("  Starting all 5 agents...")
    print("=" * 60)

    agents = [
        ("LawFeed",               "lawfeed"),
        ("Exposure Analyzer",     "exposure_analyzer"),
        ("Risk Assessor",         "risk_assessor"),
        ("Remediation Architect", "remediation_architect"),
        ("Board Notifier",        "board_notifier"),
    ]

    procs = []
    tasks = []

    for name, module in agents:
        proc, stream = await run_agent(name, module)
        procs.append(proc)
        tasks.append(asyncio.create_task(stream()))
        await asyncio.sleep(1)  # stagger startup

    print("\n" + "=" * 60)
    print("  All agents running. Open Band room to start a workflow.")
    print(f"  Room: {os.getenv('BAND_ROOM_ID')}")
    print("  Send: @lawfeed analyze GDPR")
    print("  Send: @lawfeed analyze EU_AI_ACT")
    print("  Send: @lawfeed analyze DORA")
    print("  Press Ctrl+C to stop all agents.")
    print("=" * 60 + "\n")

    try:
        await asyncio.gather(*tasks)
    except asyncio.CancelledError:
        pass
    finally:
        print("\n[Main] Shutting down all agents...")
        for proc in procs:
            try:
                proc.terminate()
                await asyncio.wait_for(proc.wait(), timeout=5)
            except Exception:
                proc.kill()
        print("[Main] All agents stopped.")


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n[Main] Interrupted by user.")
