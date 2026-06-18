import React from "react";
import Reveal from "./Reveal.jsx";
import {
  Clock, Shield, Zap, Crosshair, FileText, TrendingUp, Users,
  MapPin, Scale, CheckCircle2, Globe,
} from "lucide-react";

const c = {
  bg: "#09090A",
  surface: "#141416",
  border: "rgba(255,255,255,0.08)",
  text: "#F5F5F4",
  muted: "#9A9DA4",
  orange: "#F5521C",
  indigo: "#7C83F3",
};

const stats = [
  { icon: Clock, num: "90%", label: "faster", desc: "regulation analysis and impact mapping" },
  { icon: Shield, num: "€42.6M+", label: "risk", desc: "identified early across business units" },
  { icon: Zap, num: "5 min", label: "to", desc: "board-ready decisions and action plans" },
  { icon: Crosshair, num: "0", label: "blind spots", desc: "continuous visibility across your organization" },
];

function EuRing({ color = c.indigo, size = 22 }) {
  const cx = size / 2, cy = size / 2, r = size / 2 - 2;
  const dots = [];
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
    dots.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
  }
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {dots.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="1.3" fill={color} />)}
    </svg>
  );
}

const regs = [
  {
    accent: c.indigo,
    tintBg: "rgba(124,131,243,0.12)",
    tintBorder: "rgba(124,131,243,0.30)",
    headerIcon: <EuRing color={c.indigo} size={22} />,
    tag: "EU AI Act Update",
    title: ["Instantly mapped.", "Risk quantified."],
    steps: [
      { icon: FileText, t: "New obligations ingested and parsed", d: "AI Act – Article 13 obligations" },
      { icon: Shield, t: "Exposure mapped across 17 business units", d: "12 processes • 4 data categories" },
      { icon: TrendingUp, t: "€42.6M exposure identified", d: "High severity risk detected early" },
      { icon: Users, t: "Board memo generated in minutes", d: "Ready for approval and action" },
    ],
  },
  {
    accent: c.orange,
    tintBg: "rgba(245,82,28,0.12)",
    tintBorder: "rgba(245,82,28,0.30)",
    headerIcon: <Globe size={22} color={c.orange} />,
    tag: "Multi-Jurisdiction Privacy Change",
    title: ["Conflicts detected.", "Unified response."],
    steps: [
      { icon: MapPin, t: "Regulatory changes detected across regions", d: "GDPR, LGPD, CCPA, PDPA" },
      { icon: Scale, t: "Conflicting obligations automatically flagged", d: "Policy conflicts identified" },
      { icon: FileText, t: "Unified remediation plan created", d: "Aligned across legal and compliance" },
      { icon: CheckCircle2, t: "Continuous monitoring ensures adherence", d: "Always up to date, always compliant" },
    ],
  },
];

function StatCard({ s }) {
  const Icon = s.icon;
  return (
    <div className="rounded-2xl p-5 md:p-6" style={{ background: c.surface, border: `1px solid ${c.border}` }}>
      <div className="grid h-10 w-10 place-items-center rounded-lg" style={{ background: "rgba(245,82,28,0.10)", border: "1px solid rgba(245,82,28,0.25)" }}>
        <Icon size={18} color={c.orange} />
      </div>
      <div className="mt-5 text-2xl font-bold sm:text-3xl lg:text-4xl" style={{ color: c.orange }}>{s.num}</div>
      <div className="mt-1 text-lg font-bold">{s.label}</div>
      <div className="mt-2 text-sm leading-relaxed" style={{ color: c.muted }}>{s.desc}</div>
    </div>
  );
}

function RegCard({ data }) {
  return (
    <div className="rounded-3xl p-6 md:p-7" style={{ background: c.surface, border: `1px solid ${c.border}` }}>
      <div className="flex items-start gap-3">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl" style={{ background: data.tintBg, border: `1px solid ${data.tintBorder}` }}>
          {data.headerIcon}
        </div>
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: data.accent }}>{data.tag}</div>
          <h4 className="mt-1 text-xl font-bold leading-tight">
            <span className="block">{data.title[0]}</span>
            <span className="block">{data.title[1]}</span>
          </h4>
        </div>
      </div>

      <div className="relative mt-6 flex flex-col gap-5">
        <div className="absolute bottom-3 left-[15px] top-3 w-px" style={{ background: c.border }} />
        {data.steps.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.t} className="relative flex gap-3">
              <div className="z-10 grid h-8 w-8 shrink-0 place-items-center rounded-lg" style={{ background: data.tintBg, border: `1px solid ${data.tintBorder}`, color: data.accent }}>
                <Icon size={15} />
              </div>
              <div>
                <div className="text-sm font-semibold">{s.t}</div>
                <div className="mt-0.5 text-xs" style={{ color: c.muted }}>{s.d}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Outcomes() {
  return (
    <section id="outcomes" style={{ background: c.bg, color: c.text }}>
      <div className="mx-auto w-full px-5 py-14 md:px-8 md:py-16 xl:px-10" style={{ maxWidth: 1440 }}>

        {/* PROVEN OUTCOMES */}
        <Reveal>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider" style={{ color: c.orange }}>
            <span style={{ width: 18, height: 2, borderRadius: 2, background: c.orange, display: "inline-block" }} />
            Proven Outcomes
          </div>
          <h2 className="mt-4 font-semibold tracking-tight" style={{ fontSize: "clamp(1.6rem, 2.8vw + 0.3rem, 2.6rem)", lineHeight: 1.05, letterSpacing: "-0.02em" }}>
            <span className="block">Real outcomes.</span>
            <span className="block">Not just <span style={{ color: c.orange }}>automation.</span></span>
          </h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed" style={{ color: c.muted }}>
            Synapse Fleet helps organizations reduce risk, save time, and make better decisions—faster.
          </p>
        </Reveal>

        {/* STAT CARDS */}
        <Reveal delay={60} className="mt-10">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {stats.map((s) => <StatCard key={s.label} s={s} />)}
          </div>
        </Reveal>

        {/* REAL-WORLD IMPACT */}
        <Reveal className="mt-16">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider" style={{ color: c.orange }}>
            <span style={{ width: 18, height: 2, borderRadius: 2, background: c.orange, display: "inline-block" }} />
            Real-World Impact
          </div>
          <h2 className="mt-4 font-semibold tracking-tight" style={{ fontSize: "clamp(1.7rem, 2.8vw + 0.4rem, 2.6rem)", lineHeight: 1.06, letterSpacing: "-0.02em", maxWidth: "13em" }}>
            Built for the regulations that matter most.
          </h2>
        </Reveal>

        <Reveal delay={80} className="mt-8">
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {regs.map((data) => <RegCard key={data.tag} data={data} />)}
          </div>
        </Reveal>

      </div>
    </section>
  );
}
