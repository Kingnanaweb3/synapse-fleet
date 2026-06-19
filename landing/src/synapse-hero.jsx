import React, { useState } from "react";
import { Sparkles, Menu, X, Play, ShieldCheck, Network, Brain, Target, ShieldAlert, FileText } from "lucide-react";

const BG_IMAGE = "/hero-bg.png";
const DASHBOARD = "/dashboard.webp";
const DASHBOARD_URL = "https://web-production-85997.up.railway.app/";
const FONT = "'DM Sans', ui-sans-serif, system-ui, sans-serif";

const c = {
  bg: "#09090A",
  surface: "#141416",
  border: "rgba(255,255,255,0.07)",
  text: "#F5F5F4",
  muted: "#9A9DA4",
  dim: "#6B6E76",
  orange: "#F5521C",
};

const navLinks = [
  { label: "How it works", href: "#how-it-works" },
  { label: "The Fleet", href: "#fleet" },
  { label: "SDK", href: "#sdk" },
];

const stack = [
  { label: "Powered by", name: "Band", icon: <ShieldCheck size={16} color={c.orange} /> },
  { label: "Inference on", name: "Groq", icon: <Network size={16} color={c.muted} /> },
  { label: "Models", name: "Llama 3.3 + GPT-OSS", icon: <Brain size={16} color={c.muted} /> },
];

const features = [
  { icon: <Target size={15} color={c.orange} />, label: "Detect exposure instantly" },
  { icon: <ShieldAlert size={15} color={c.orange} />, label: "Quantify regulatory risk" },
  { icon: <FileText size={15} color={c.orange} />, label: "Generate remediation plans" },
];

function LogoMark({ size = 28 }) {
  return (
    <img src="/logo.png" alt="Synapse Fleet" style={{ height: size, width: "auto" }} />
  );
}

export default function Hero() {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen w-full" style={{ background: c.bg, color: c.text, fontFamily: FONT }}>
      <style>{`
        html { scroll-behavior: smooth; }
        .nav-link { color: #9A9DA4; transition: color .15s ease; }
        .nav-link:hover { color: #F5F5F4; }
        .nav-cta { transition: transform .15s ease, filter .15s ease; }
        .nav-cta:hover { transform: translateY(-1px); filter: brightness(1.05); }
        .menu-link:hover { background: rgba(255,255,255,0.04); }
        .btn-prim { transition: transform .15s ease, filter .15s ease; }
        .btn-prim:hover { transform: translateY(-1px); filter: brightness(1.05); }
        .btn-ghost { transition: background .15s ease, border-color .15s ease; }
        .btn-ghost:hover { background: rgba(255,255,255,0.04); }
      `}</style>

      <section className="relative overflow-hidden" style={{ minHeight: "100vh" }}>
        <div className="pointer-events-none absolute inset-0" style={{
          backgroundImage: `url('${BG_IMAGE}')`, backgroundSize: "cover", backgroundPosition: "center",
        }} />
        <div className="pointer-events-none absolute inset-0" style={{
          background: "linear-gradient(90deg, rgba(9,9,10,0.95) 0%, rgba(9,9,10,0.84) 36%, rgba(9,9,10,0.5) 70%, rgba(9,9,10,0.62) 100%)",
        }} />
        <div className="pointer-events-none absolute inset-0" style={{
          background:
            "radial-gradient(1100px 500px at 88% 8%, rgba(60,110,230,0.14), transparent 60%)," +
            "radial-gradient(900px 600px at 100% 55%, rgba(245,82,28,0.16), transparent 55%)",
        }} />

        <div className="relative mx-auto w-full px-5 md:px-8 xl:px-10" style={{ maxWidth: 1440 }}>
          {/* NAV */}
          <header className="flex items-center justify-between py-5 md:py-6">
            <a href="#" className="flex items-center gap-2.5">
              <LogoMark />
              <span className="text-lg font-semibold tracking-tight">
                Synapse <span style={{ color: c.orange }}>Fleet</span>
              </span>
            </a>
            <nav className="hidden items-center gap-8 text-sm md:flex">
              {navLinks.map((l) => (
                <a key={l.href} href={l.href} className="nav-link font-medium">{l.label}</a>
              ))}
            </nav>
            <a href="#sdk" className="nav-cta hidden items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold md:flex"
               style={{ background: c.orange, color: "#fff" }}>
              <Sparkles size={15} /> Run a Regulation
            </a>
            <button onClick={() => setOpen(!open)} aria-label="Toggle menu"
                    className="grid h-10 w-10 place-items-center rounded-lg md:hidden"
                    style={{ background: c.surface, border: `1px solid ${c.border}`, color: c.text }}>
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </header>

          {open && (
            <div className="mb-4 flex flex-col gap-1 rounded-2xl p-3 md:hidden"
                 style={{ background: c.surface, border: `1px solid ${c.border}` }}>
              {navLinks.map((l) => (
                <a key={l.href} href={l.href} onClick={() => setOpen(false)}
                   className="menu-link rounded-lg px-3 py-2.5 text-sm font-medium" style={{ color: c.text }}>
                  {l.label}
                </a>
              ))}
              <a href="#sdk" onClick={() => setOpen(false)}
                 className="mt-1 flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold"
                 style={{ background: c.orange, color: "#fff" }}>
                <Sparkles size={15} /> Run a Regulation
              </a>
            </div>
          )}

          {/* HERO CONTENT — mobile order: text, image, then buttons/cards/bullets */}
          <div className="grid grid-cols-1 gap-8 pb-16 pt-10 md:pt-14 lg:grid-cols-2 lg:items-center lg:gap-x-10 lg:gap-y-8 lg:pb-24 lg:pt-16 xl:pt-20">

            {/* TOP TEXT */}
            <div className="text-center lg:col-start-1 lg:row-start-1 lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm"
                   style={{ background: c.surface, border: `1px solid ${c.border}`, color: c.muted }}>
                <Sparkles size={14} color={c.orange} />
                Autonomous Compliance Workflows
              </div>
              <h1 className="mx-auto mt-6 font-semibold tracking-tight lg:mx-0"
                  style={{ fontSize: "clamp(1.7rem, 3.1vw + 0.3rem, 2.85rem)", lineHeight: 1.04, letterSpacing: "-0.02em", maxWidth: "10.5em" }}>
                From Regulation Drop to Board Decision — <span style={{ color: c.orange }}>In Minutes.</span>
              </h1>
              <p className="mx-auto mt-5 max-w-md text-base leading-relaxed lg:mx-0 lg:mt-6" style={{ color: c.muted }}>
                Five coordinated AI agents ingest new regulations, map organizational exposure,
                quantify financial risk, and generate board-ready remediation plans in real time.
              </p>
            </div>

            {/* IMAGE */}
            <div className="lg:col-start-2 lg:row-span-2 lg:row-start-1">
              <img src={DASHBOARD} alt="Synapse Fleet live compliance dashboard"
                   className="mx-auto w-full max-w-xl rounded-2xl lg:max-w-none"
                   style={{ border: `1px solid ${c.border}`, boxShadow: "0 30px 80px -40px rgba(0,0,0,0.9)" }} />
            </div>

            {/* BOTTOM TEXT — buttons, cards, bullets */}
            <div className="text-center lg:col-start-1 lg:row-start-2 lg:text-left">
              {/* buttons */}
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
                <a href="#sdk" className="btn-prim flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold"
                   style={{ background: c.orange, color: "#fff" }}>
                  <Sparkles size={16} /> Run a Regulation
                </a>
                <a href={DASHBOARD_URL} target="_blank" rel="noreferrer" className="btn-ghost flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold"
                   style={{ background: "transparent", color: c.text, border: `1px solid ${c.border}` }}>
                  <Play size={15} /> See Agent Workflow
                </a>
              </div>

              {/* powered-by cards */}
              <div className="mx-auto mt-8 grid max-w-lg grid-cols-1 gap-3 sm:grid-cols-3 lg:mx-0 lg:mt-9">
                {stack.map((p) => (
                  <div key={p.name} className="rounded-2xl px-4 py-3 text-left"
                       style={{ background: c.surface, border: `1px solid ${c.border}` }}>
                    <div className="mb-1.5">{p.icon}</div>
                    <div className="text-[11px]" style={{ color: c.dim }}>{p.label}</div>
                    <div className="text-sm font-semibold">{p.name}</div>
                  </div>
                ))}
              </div>

              {/* feature bullets */}
              <div className="mx-auto mt-7 flex max-w-lg flex-col items-center gap-3 text-sm sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-7 sm:gap-y-3 lg:mx-0 lg:mt-8 lg:justify-start"
                   style={{ color: c.muted }}>
                {features.map((f) => (
                  <span key={f.label} className="flex items-center gap-2">{f.icon} {f.label}</span>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
