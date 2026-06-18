import React from "react";
import Reveal from "./Reveal.jsx";
import {
  Scale, Landmark, BookOpen, ShieldAlert, FileText, Database, Workflow, History,
  ScrollText, Network, TrendingUp, AlertTriangle, Share2, Gauge,
  Sparkles, RefreshCw, ClipboardList, Bell, LineChart,
} from "lucide-react";

const c = {
  bg: "#EFEEEC",
  card: "#FBFBFA",
  subcard: "rgba(17,17,17,0.04)",
  border: "rgba(17,17,17,0.10)",
  text: "#17181B",
  muted: "#55565B",
  dim: "#85868B",
  orange: "#F5521C",
};

function Row({ icon: Icon, color = c.muted, children }) {
  return (
    <li className="flex items-center gap-2.5 text-sm">
      <Icon size={15} color={color} className="shrink-0" />
      <span>{children}</span>
    </li>
  );
}

function OutRow({ icon: Icon, t, d }) {
  return (
    <li className="flex items-start gap-2.5">
      <Icon size={15} color={c.orange} className="mt-0.5 shrink-0" />
      <div>
        <div className="text-sm font-semibold leading-tight">{t}</div>
        <div className="mt-0.5 text-xs" style={{ color: c.muted }}>{d}</div>
      </div>
    </li>
  );
}

const steps = [
  {
    n: "01",
    title: "Ingest",
    desc: "We continuously ingest new regulations and your organization\u2019s data.",
    body: (
      <>
        <div className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: c.dim }}>External Inputs</div>
        <ul className="mt-2.5 flex flex-col gap-2">
          <Row icon={Scale}>Regulations & Laws</Row>
          <Row icon={Landmark}>Government Updates</Row>
          <Row icon={BookOpen}>Industry Guidelines</Row>
          <Row icon={ShieldAlert}>Enforcement Actions</Row>
        </ul>
        <div className="my-4 h-px w-full" style={{ background: c.border }} />
        <div className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: c.dim }}>Internal Inputs</div>
        <ul className="mt-2.5 flex flex-col gap-2">
          <Row icon={FileText}>Policies & Documents</Row>
          <Row icon={Database}>Systems & Data</Row>
          <Row icon={Workflow}>Workflows & Tools</Row>
          <Row icon={History}>Historical Decisions</Row>
        </ul>
      </>
    ),
  },
  {
    n: "02",
    title: "Understand",
    desc: "Our AI agents interpret, analyze, and map impact across your organization.",
    body: (
      <>
        <ul className="flex flex-col gap-2.5">
          <Row icon={ScrollText}>Obligation Interpretation</Row>
          <Row icon={Network}>Impact Mapping</Row>
          <Row icon={TrendingUp}>Risk Quantification</Row>
          <Row icon={AlertTriangle}>Conflict Detection</Row>
          <Row icon={Share2}>Dependency Analysis</Row>
          <Row icon={Gauge}>Exposure Scoring</Row>
        </ul>
        <div className="mt-5 rounded-lg px-3 py-2 text-center text-xs" style={{ background: c.subcard, color: c.muted }}>
          Powered by multi-agent intelligence
        </div>
      </>
    ),
  },
  {
    n: "03",
    title: "Act",
    desc: "We turn insights into decisions, trigger actions, and deliver board-ready outputs.",
    body: (
      <ul className="flex flex-col gap-3.5">
        <OutRow icon={Sparkles} t="Actionable Recommendations" d="Prioritized actions and next steps" />
        <OutRow icon={RefreshCw} t="Workflow Automation" d="Tasks assigned and tracked" />
        <OutRow icon={ClipboardList} t="Board-Ready Memos" d="Executive summaries in minutes" />
        <OutRow icon={Bell} t="Alerts & Notifications" d="Real-time updates that matter" />
        <OutRow icon={LineChart} t="Audit Trail" d="Every decision, fully documented" />
      </ul>
    ),
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" style={{ background: c.bg, color: c.text }}>
      <div className="mx-auto w-full px-5 py-14 md:px-8 md:py-16 xl:px-10" style={{ maxWidth: 1440 }}>
        <Reveal>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider" style={{ color: c.orange }}>
            <span style={{ width: 18, height: 2, borderRadius: 2, background: c.orange, display: "inline-block" }} />
            How it works
          </div>
          <h2 className="mt-4 font-semibold tracking-tight"
              style={{ fontSize: "clamp(1.6rem, 2.8vw + 0.3rem, 2.6rem)", lineHeight: 1.08, letterSpacing: "-0.02em" }}>
            A system, <span style={{ color: c.orange }}>not a tool.</span>
          </h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed" style={{ color: c.muted }}>
            Multi-agent intelligence that ingests regulation, maps it to your systems, and executes decisions—automatically.
          </p>
        </Reveal>

        <Reveal delay={80} className="mt-10">
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            {steps.map((s) => (
              <div key={s.n} className="rounded-2xl p-6" style={{ background: c.card, border: `1px solid ${c.border}` }}>
                <div className="text-sm font-bold" style={{ color: c.orange }}>{s.n}</div>
                <h3 className="mt-3 text-xl font-bold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: c.muted }}>{s.desc}</p>
                <div className="my-5 h-px w-full" style={{ background: c.border }} />
                {s.body}
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
