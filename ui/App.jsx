import { useState, useEffect, useRef } from "react";

const AGENTS = {
  lawfeed: { label: "LawFeed", color: "#FF4500", bg: "#FF450022", icon: "⚖" },
  exposure_analyzer: { label: "Exposure Analyzer", color: "#3B82F6", bg: "#3B82F622", icon: "🔍" },
  risk_assessor: { label: "Risk Assessor", color: "#A855F7", bg: "#A855F722", icon: "📊" },
  remediation_architect: { label: "Remediation Architect", color: "#22C55E", bg: "#22C55E22", icon: "🛠" },
  board_notifier: { label: "Board Notifier", color: "#F59E0B", bg: "#F59E0B22", icon: "📋" },
};

const EVENT_COLORS = {
  regulation_ingested: "#FF4500",
  exposure_mapped: "#3B82F6",
  risk_quantified: "#A855F7",
  remediation_plan_ready: "#22C55E",
  board_memo_pending_approval: "#F59E0B",
};

function formatEur(n) {
  if (!n) return "—";
  if (n >= 1_000_000_000) return `€${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `€${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `€${(n / 1_000).toFixed(0)}K`;
  return `€${n.toLocaleString()}`;
}

function extractPretty(content) {
  if (!content) return "";
  const start = content.indexOf("{");
  const end = content.lastIndexOf("}");
  if (start !== -1 && end > start) {
    try { return JSON.stringify(JSON.parse(content.slice(start, end + 1)), null, 2); } catch (e) {}
  }
  return content.trim();
}

function useCountUp(target, duration = 1500) {
  const [value, setValue] = useState(0);
  const prev = useRef(0);
  useEffect(() => {
    if (!target) return;
    const start = prev.current;
    const startTime = performance.now();
    const tick = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(start + (target - start) * eased));
      if (progress < 1) requestAnimationFrame(tick);
      else prev.current = target;
    };
    requestAnimationFrame(tick);
  }, [target]);
  return value;
}

function AgentAvatar({ agentKey }) {
  const a = AGENTS[agentKey] || { color: "#666", bg: "#66622", icon: "?" };
  return (
    <div style={{
      width: 40, height: 40, borderRadius: "50%",
      background: a.bg, border: `2px solid ${a.color}`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 16, flexShrink: 0,
    }}>{a.icon}</div>
  );
}

function EventCard({ event, isLast }) {
  const [open, setOpen] = useState(false);
  const agent = AGENTS[event.agent] || {};
  const eventColor = EVENT_COLORS[event.event_type] || "#666";
  const pretty = open ? extractPretty(event.raw) : "";
  return (
    <div style={{ display: "flex", gap: 12, position: "relative" }}>
      {!isLast && (
        <div style={{
          position: "absolute", left: 19, top: 44, bottom: -16,
          width: 2, background: "linear-gradient(to bottom, #333, transparent)",
        }} />
      )}
      <AgentAvatar agentKey={event.agent} />
      <div
        onClick={() => setOpen(o => !o)}
        style={{
          flex: 1, background: "#111118", border: `1px solid ${open ? "#333" : "#222"}`,
          borderRadius: 10, padding: "12px 14px", marginBottom: 16,
          cursor: "pointer", transition: "border-color 0.15s",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
          <span style={{ color: agent.color || "#fff", fontWeight: 600, fontSize: 14 }}>{agent.label}</span>
          <span style={{ color: "#555", fontSize: 11, fontFamily: "monospace" }}>{event.time}</span>
        </div>
        <div style={{
          display: "inline-block", fontSize: 11, fontFamily: "monospace",
          color: eventColor, background: eventColor + "18",
          borderRadius: 4, padding: "2px 8px", marginBottom: 6,
        }}>{event.event_type}</div>
        <div style={{ color: "#888", fontSize: 13, lineHeight: 1.4, display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 8 }}>
          <span>{event.summary}</span>
          <span style={{ color: "#555", fontSize: 11, flexShrink: 0, whiteSpace: "nowrap" }}>{open ? "▾ hide" : "▸ details"}</span>
        </div>
        {open && (
          <pre style={{
            marginTop: 10, background: "#0b0b11", border: "1px solid #1c1c2a",
            borderRadius: 8, padding: "10px 12px", fontSize: 11, lineHeight: 1.5,
            color: "#99aab5", fontFamily: "monospace", maxHeight: 260, overflow: "auto",
            whiteSpace: "pre-wrap", wordBreak: "break-word",
          }}>{pretty || "No additional detail."}</pre>
        )}
      </div>
    </div>
  );
}

function StatRow({ label, value, color }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
      <span style={{ color: "#666", fontSize: 13 }}>{label}</span>
      <span style={{ color: color || "#fff", fontSize: 16, fontWeight: 700 }}>{value}</span>
    </div>
  );
}

export default function App() {
  const [events, setEvents] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [approved, setApproved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("idle");
  const [regulation, setRegulation] = useState("GDPR");
  const [cooldown, setCooldown] = useState(false);

  const animatedPenalty = useCountUp(dashboard?.max_penalty, 1800);

  const parseMessage = (msg) => {
    const content = msg.content || "";
    const time = new Date(msg.created_at || Date.now()).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

    if (content.includes("regulation_ingested")) {
      const name = content.match(/"regulation_name"\s*:\s*"([^"]+)"/)?.[1];
      const penalty = content.match(/"max_penalty_eur"\s*:\s*(\d+)/)?.[1];
      return { agent: "lawfeed", event_type: "regulation_ingested", time, raw: content, summary: `${name || "Regulation"} ingested — ${penalty ? formatEur(+penalty) : ""} max penalty` };
    }
    if (content.includes("exposure_mapped")) {
      const compliant = content.match(/"compliant"\s*:\s*(\d+)/)?.[1];
      const total = content.match(/"total_obligations"\s*:\s*(\d+)/)?.[1];
      return { agent: "exposure_analyzer", event_type: "exposure_mapped", time, raw: content, summary: `${compliant || "?"} / ${total || "?"} obligations met` };
    }
    if (content.includes("risk_quantified")) {
      const maxM = content.match(/"maximum"[\s\S]*?"amount_eur"\s*:\s*(\d+)/)?.[1];
      const expM = content.match(/"expected"[\s\S]*?"amount_eur"\s*:\s*(\d+)/)?.[1];
      const remM = content.match(/"estimated_remediation_cost_eur"\s*:\s*(\d+)/)?.[1];
      const ratio = content.match(/"risk_vs_remediation_ratio"\s*:\s*"([^"]+)"/)?.[1];
      const riskMatch = content.match(/"key_risk_drivers"\s*:\s*\[([^\]]+)\]/)?.[1];
      const risks = riskMatch?.match(/"([^"]+)"/g)?.map(s => s.replace(/"/g, "")) || [];
      if (maxM) setDashboard(prev => ({ ...prev, max_penalty: +maxM, exp_penalty: expM ? +expM : null, remediation: remM ? +remM : null, ratio, risks }));
      return { agent: "risk_assessor", event_type: "risk_quantified", time, raw: content, summary: `${maxM ? formatEur(+maxM) : "—"} max exposure` };
    }
    if (content.includes("remediation_plan_ready")) {
      const actions = content.match(/"total_actions"\s*:\s*(\d+)/)?.[1];
      const days = content.match(/"estimated_completion_days"\s*:\s*(\d+)/)?.[1];
      if (actions) setDashboard(prev => ({ ...prev, total_actions: +actions, completion_days: days ? +days : null }));
      return { agent: "remediation_architect", event_type: "remediation_plan_ready", time, raw: content, summary: `${actions || "?"} actions · ${days || "?"}-day roadmap` };
    }
    if (content.includes("board_memo_pending_approval")) {
      const subject = content.match(/"subject"\s*:\s*"([^"]+)"/)?.[1];
      setStatus("awaiting_approval");
      setDashboard(prev => ({ ...prev, memo_subject: subject }));
      return { agent: "board_notifier", event_type: "board_memo_pending_approval", time, raw: content, summary: "Board memo ready · requires_human_signoff: true" };
    }
    return null;
  };

  useEffect(() => {
    let active = true;
    const fetchMessages = async () => {
      try {
        const res = await fetch("/api/messages");
        const data = await res.json();
        if (!active || !data.messages) return;
        const parsed = data.messages.map(parseMessage).filter(Boolean);
        if (parsed.length > 0) {
          setEvents(parsed);
          setStatus(prev => prev === "idle" ? "running" : prev);
        }
      } catch (e) {}
    };
    fetchMessages();
    const poll = setInterval(fetchMessages, 4000);
    return () => { active = false; clearInterval(poll); };
  }, []);

  const handleStart = async () => {
    if (cooldown) return;
    setCooldown(true);
    setTimeout(() => setCooldown(false), 8000);
    setApproved(false); setStatus("running");
    await fetch("/api/start", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ regulation }) });
  };

  const handleApprove = async () => {
    setLoading(true);
    await fetch("/api/approve", { method: "POST" });
    setApproved(true); setStatus("approved"); setLoading(false);
  };

  const s = {
    root: { fontFamily: "'DM Sans', sans-serif", background: "#0A0A0F", color: "#fff", minHeight: "100vh", display: "flex", flexDirection: "column" },
    header: { padding: "16px 32px", borderBottom: "1px solid #1a1a2e", display: "flex", alignItems: "center", justifyContent: "space-between" },
    body: { display: "flex", flex: 1 },
    left: { width: 420, borderRight: "1px solid #1a1a2e", padding: "24px 20px", overflowY: "auto", background: "#0D0D14" },
    right: { flex: 1, padding: "24px 28px", overflowY: "auto" },
    label: { fontSize: 11, color: "#555", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 16 },
    card: { background: "#111118", border: "1px solid #1e1e2e", borderRadius: 12, padding: "18px 20px", marginBottom: 16 },
    penalty: { fontSize: 52, fontWeight: 800, color: "#FF4500", letterSpacing: "-2px", lineHeight: 1, marginBottom: 4 },
    approveBtn: { width: "100%", padding: "16px 0", borderRadius: 10, background: approved ? "#22C55E" : "#FF4500", color: "#fff", border: "none", fontSize: 16, fontWeight: 700, cursor: "pointer", marginTop: 8 },
    rejectBtn: { width: "100%", padding: "12px 0", borderRadius: 10, background: "transparent", color: "#666", border: "1px solid #222", fontSize: 14, cursor: "pointer", marginTop: 8 },
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #222; border-radius: 2px; }
        @keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        .ev { animation: fadeIn 0.3s ease; }
      `}</style>
      <div style={s.root}>
        <div style={s.header}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <img src="/logo.png" style={{ width: 40, height: 40, objectFit: "contain" }} alt="Synapse Fleet" />
            <div>
              <div style={{ fontSize: 18, fontWeight: 700 }}>Synapse Fleet</div>
              <div style={{ fontSize: 12, color: "#555" }}>Regulatory Compliance Intelligence</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: status === "running" ? "#22C55E" : "#555", boxShadow: status === "running" ? "0 0 8px #22C55E" : "none" }} />
            <span style={{ fontSize: 12, color: "#555" }}>
              {status === "idle" && "Ready"}
              {status === "running" && "Agents Running"}
              {status === "awaiting_approval" && "Awaiting Sign-off"}
              {status === "approved" && "Approved & Dispatched"}
            </span>
          </div>
        </div>

        <div style={s.body}>
          <div style={s.left}>
            <div style={s.label}>⬤ Band Room — Live Agent Stream</div>
            <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
              <select style={{ flex: 1, background: "#111118", border: "1px solid #222", color: "#fff", borderRadius: 8, padding: "10px 14px", fontSize: 14, fontFamily: "'DM Sans', sans-serif" }} value={regulation} onChange={e => setRegulation(e.target.value)}>
                <option value="GDPR">GDPR</option>
                <option value="EU_AI_ACT">EU AI Act</option>
                <option value="DORA">DORA</option>
                <option value="MICA">MiCA</option>
                <option value="NIS2">NIS2</option>
                <option value="AML">AML</option>
              </select>
              <button onClick={handleStart} disabled={cooldown} style={{ padding: "10px 20px", background: cooldown ? "#7a2a10" : "#FF4500", color: "#fff", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: cooldown ? "default" : "pointer", opacity: cooldown ? 0.7 : 1 }}>
                {cooldown ? "Running…" : "Run Analysis"}
              </button>
            </div>
            <div style={{ fontSize: 12, color: "#666", marginBottom: 18 }}>
              Target: <span style={{ color: "#aaa" }}>Acme Financial Services Ltd</span> · <span style={{ color: "#aaa" }}>{regulation}</span>
            </div>
            {events.length === 0 && <div style={{ color: "#333", fontSize: 13, textAlign: "center", paddingTop: 40 }}>Select a regulation and click Run Analysis.</div>}
            {events.map((ev, i) => <div key={i} className="ev"><EventCard event={ev} isLast={i === events.length - 1} /></div>)}
          </div>

          <div style={s.right}>
            <div style={s.label}>Executive Command Dashboard</div>
            <div style={{ fontSize: 12, color: "#666", marginTop: -8, marginBottom: 18 }}>Acme Financial Services Ltd · {regulation}</div>
            {!dashboard && <div style={{ color: "#333", fontSize: 13, textAlign: "center", paddingTop: 80 }}>Run a regulation analysis to see the executive summary here.</div>}
            {dashboard && <>
              <div style={s.card}>
                <div style={{ fontSize: 12, color: "#555", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.08em" }}>Estimated Financial Exposure</div>
                <div style={s.penalty}>
                  {dashboard.max_penalty >= 1e9 ? `€${(animatedPenalty / 1e9).toFixed(1)}B` : `€${(animatedPenalty / 1e6).toFixed(1)}M`}
                </div>
                <div style={{ marginTop: 20, borderTop: "1px solid #1e1e2e", paddingTop: 16 }}>
                  <StatRow label="Expected Penalty" value={formatEur(dashboard.exp_penalty)} color="#F59E0B" />
                  <StatRow label="Remediation Cost" value={formatEur(dashboard.remediation)} color="#22C55E" />
                  <StatRow label="Risk / Remediation Ratio" value={dashboard.ratio?.split("—")[0]?.trim() || "—"} color="#3B82F6" />
                </div>
              </div>

              {dashboard.total_actions && (
                <div style={s.card}>
                  <div style={{ fontSize: 12, color: "#555", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.08em" }}>Remediation Plan</div>
                  <div style={{ display: "flex", gap: 32 }}>
                    <div><div style={{ fontSize: 36, fontWeight: 800 }}>{dashboard.total_actions}</div><div style={{ fontSize: 12, color: "#555" }}>Total Actions</div></div>
                    <div><div style={{ fontSize: 36, fontWeight: 800 }}>{dashboard.completion_days}</div><div style={{ fontSize: 12, color: "#555" }}>Days to Complete</div></div>
                  </div>
                </div>
              )}

              {dashboard.risks?.length > 0 && (
                <div style={s.card}>
                  <div style={{ fontSize: 12, color: "#555", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.08em" }}>Key Risk Drivers</div>
                  {dashboard.risks.map((r, i) => (
                    <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10, alignItems: "flex-start" }}>
                      <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#FF450022", border: "1px solid #FF450044", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#FF4500", flexShrink: 0, marginTop: 1 }}>{i + 1}</div>
                      <div style={{ fontSize: 13, color: "#aaa", lineHeight: 1.5 }}>{r}</div>
                    </div>
                  ))}
                </div>
              )}

              {(status === "awaiting_approval" || status === "approved") && (
                <div style={{ ...s.card, border: approved ? "1px solid #22C55E44" : "1px solid #FF450044" }}>
                  <div style={{ fontSize: 12, color: "#555", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.08em" }}>Board Memo Status</div>
                  {dashboard.memo_subject && <div style={{ fontSize: 14, color: "#ccc", marginBottom: 16, lineHeight: 1.4 }}>{dashboard.memo_subject}</div>}
                  {!approved ? <>
                    <div style={{ fontSize: 13, color: "#F59E0B", marginBottom: 16 }}>⏱ Pending Human Approval</div>
                    <button style={s.approveBtn} onClick={handleApprove} disabled={loading}>{loading ? "Dispatching..." : "Approve & Dispatch →"}</button>
                    <button style={s.rejectBtn}>Reject</button>
                  </> : <div style={{ fontSize: 15, color: "#22C55E", fontWeight: 600 }}>✓ Approved and Dispatched</div>}
                </div>
              )}
            </>}
          </div>
        </div>
      </div>
    </>
  );
}
