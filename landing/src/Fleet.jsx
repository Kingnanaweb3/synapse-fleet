import React from "react";
import Reveal from "./Reveal.jsx";
import { FileText, Network, ShieldCheck, ListChecks, Bell, User, Share2 } from "lucide-react";

const c = {
  bg: "#EFEEEC", card: "#FBFBFA", border: "rgba(17,17,17,0.10)",
  text: "#17181B", muted: "#55565B", orange: "#F5521C", blue: "#4F8DF7",
};

const oT = "rgba(245,82,28,0.10)", oF = "rgba(245,82,28,0.06)", oB = "rgba(245,82,28,0.20)";
const bT = "rgba(79,141,247,0.12)", bF = "rgba(79,141,247,0.07)", bB = "rgba(79,141,247,0.25)";

const cards = [
  { badge: "01", name: "LawFeed", role: "Ingests new regulations the moment they drop.", tagLabel: "→ emits", tag: "regulation_ingested", icon: FileText, accent: c.orange, tint: oT, tagBg: oF, tagBorder: oB },
  { badge: "02", name: "Exposure Analyzer", role: "Maps which business units, processes, and data are affected.", tagLabel: "→ emits", tag: "exposure_mapped", icon: Network, accent: c.orange, tint: oT, tagBg: oF, tagBorder: oB },
  { badge: "03", name: "Risk Assessor", role: "Quantifies the financial exposure and severity.", tagLabel: "→ emits", tag: "risk_quantified", icon: ShieldCheck, accent: c.orange, tint: oT, tagBg: oF, tagBorder: oB },
  { badge: "04", name: "Remediation Architect", role: "Builds the action plan and remediation roadmap.", tagLabel: "→ emits", tag: "remediation_plan_ready", icon: ListChecks, accent: c.orange, tint: oT, tagBg: oF, tagBorder: oB },
  { badge: "05", name: "Board Notifier", role: "Drafts the board-ready memo and requests sign-off.", tagLabel: "→ emits", tag: "board_memo_pending_approval", icon: Bell, accent: c.orange, tint: oT, tagBg: oF, tagBorder: oB },
  { badge: "✓", name: "Human sign-off", role: "Nothing is dispatched until you review and approve the final memo.", tagLabel: "→ requires", tag: "human_approval", icon: User, accent: c.blue, tint: bT, tagBg: bF, tagBorder: bB },
];

export default function Fleet() {
  return (
    <section id="fleet" style={{ background: c.bg, color: c.text }}>
      <style>{`
        .fleet-scroll { -ms-overflow-style: none; scrollbar-width: none; }
        .fleet-scroll::-webkit-scrollbar { display: none; }
        @keyframes swipeNudge { 0%,100%{ transform: translateX(0) } 50%{ transform: translateX(-7px) } }
        .swipe-nudge { animation: swipeNudge 1.4s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce){ .swipe-nudge { animation: none } }
      `}</style>

      <div className="mx-auto w-full px-5 py-14 md:px-8 md:py-16 xl:px-10" style={{ maxWidth: 1440 }}>
        <Reveal>
          <div className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-wider" style={{ color: c.orange }}>
            <span style={{ width: 18, height: 2, borderRadius: 2, background: c.orange, display: "inline-block" }} />
            The Fleet
          </div>
          <h2 className="mt-4 font-semibold tracking-tight"
              style={{ fontSize: "clamp(1.6rem, 2.8vw + 0.3rem, 2.6rem)", lineHeight: 1.08, letterSpacing: "-0.02em" }}>
            Five specialists. <span style={{ color: c.orange }}>One decision.</span>
          </h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed" style={{ color: c.muted }}>
            Each agent owns a single job and passes its result to the next through Band’s shared room — turning a fresh regulation into a board-ready memo automatically.
          </p>
          <div className="mt-5 inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium"
               style={{ background: c.card, border: `1px solid ${c.border}`, color: c.muted }}>
            <Share2 size={14} color={c.orange} />
            Coordinated through Band · Reasoning on Groq (Llama + GPT-OSS)
          </div>
        </Reveal>

        <div className="mt-8 flex items-center gap-2 text-sm font-semibold md:hidden" style={{ color: c.orange }}>
          <span className="swipe-nudge inline-flex">
            <svg width="32" height="20" viewBox="0 0 32 20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 4c7 12 16 13 26 10" /><path d="M22 17l6-3" /><path d="M28 14l-2-6" />
            </svg>
          </span>
          Swipe to see more
        </div>

        <Reveal delay={60} className="mt-4 md:mt-8">
          <div className="fleet-scroll flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-3 md:gap-5 md:overflow-visible md:pb-0">
            {cards.map((card) => {
              const Icon = card.icon;
              return (
                <div key={card.name}
                     className="flex shrink-0 basis-[78%] snap-start flex-col rounded-2xl p-5 sm:basis-[45%] md:basis-auto"
                     style={{ background: c.card, border: `1px solid ${c.border}` }}>
                  <div className="grid h-7 w-7 place-items-center rounded-lg text-xs font-bold" style={{ background: card.tint, color: card.accent }}>{card.badge}</div>
                  <div className="mx-auto mt-3 grid h-14 w-14 place-items-center rounded-full" style={{ background: card.tint }}>
                    <Icon size={24} color={card.accent} />
                  </div>
                  <h3 className="mt-3 text-center text-base font-bold leading-tight">{card.name}</h3>
                  <p className="mt-1.5 text-center text-sm leading-relaxed" style={{ color: c.muted }}>{card.role}</p>
                  <div className="mt-auto pt-4">
                    <div className="rounded-lg px-3 py-2 text-center" style={{ background: card.tagBg, border: `1px solid ${card.tagBorder}` }}>
                      <div className="text-[11px]" style={{ color: c.muted }}>{card.tagLabel}</div>
                      <div className="mt-0.5 break-words font-mono text-[11px] font-semibold" style={{ color: card.accent }}>{card.tag}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
