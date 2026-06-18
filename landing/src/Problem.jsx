import React from "react";
import Reveal from "./Reveal.jsx";

const c = {
  bg: "#EAEAE8",
  card: "rgba(255,255,255,0.45)",
  border: "rgba(17,17,17,0.10)",
  text: "#17181B",
  muted: "#55565B",
  orange: "#F5521C",
};

const cards = [
  {
    n: "01",
    title: "Information Overload",
    desc: "Regulations are long, complex, and constantly changing.",
    points: ["100+ page documents", "Legal language, unclear impact", "Multiple jurisdictions"],
  },
  {
    n: "02",
    title: "Fragmented Analysis",
    desc: "Teams work in silos with no unified view of risk.",
    points: ["Legal, compliance, product disconnected", "Manual interpretation", "No real-time visibility"],
  },
  {
    n: "03",
    title: "Slow Decision Cycles",
    desc: "By the time decisions are made, the risk has already materialized.",
    points: ["Weeks to assess impact", "Delayed executive action", "Missed deadlines & penalties"],
  },
];

export default function Problem() {
  return (
    <section id="problem" style={{ background: c.bg, color: c.text }}>
      <style>{`
        .px-scroll { -ms-overflow-style: none; scrollbar-width: none; }
        .px-scroll::-webkit-scrollbar { display: none; }
        @keyframes swipeNudge { 0%,100%{ transform: translateX(0) } 50%{ transform: translateX(-7px) } }
        .swipe-nudge { animation: swipeNudge 1.4s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce){ .swipe-nudge { animation: none } }
      `}</style>

      <div className="mx-auto w-full px-5 py-20 md:px-8 md:py-24 xl:px-10" style={{ maxWidth: 1440 }}>
        <Reveal>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider" style={{ color: c.orange }}>
            <span style={{ width: 18, height: 2, borderRadius: 2, background: c.orange, display: "inline-block" }} />
            The Problem
          </div>
          <h2 className="mt-5 font-semibold tracking-tight"
              style={{ fontSize: "clamp(1.6rem, 2.9vw + 0.3rem, 2.7rem)", lineHeight: 1.05, letterSpacing: "-0.02em", maxWidth: "12em" }}>
            Regulation moves faster than your organization can <span style={{ color: c.orange }}>keep up.</span>
          </h2>
          <p className="mt-5 max-w-xl text-base leading-relaxed" style={{ color: c.muted }}>
            New regulations arrive constantly, but understanding their real impact across your organization
            takes days or weeks—leaving critical exposure unnoticed.
          </p>
        </Reveal>

        {/* swipe hint — mobile only */}
        <div className="mt-10 flex items-center gap-2 text-sm font-semibold md:hidden" style={{ color: c.orange }}>
          <span className="swipe-nudge inline-flex">
            <svg width="32" height="20" viewBox="0 0 32 20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 4c7 12 16 13 26 10" />
              <path d="M22 17l6-3" />
              <path d="M28 14l-2-6" />
            </svg>
          </span>
          Swipe to see more
        </div>

        {/* cards: swipe carousel on mobile, grid on desktop */}
        <Reveal delay={80} className="mt-4 md:mt-12">
          <div className="px-scroll flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:pb-0">
            {cards.map((card) => (
              <div key={card.n} className="snap-start shrink-0 basis-[82%] rounded-2xl p-6 sm:basis-[47%] md:basis-auto md:p-7"
                   style={{ background: c.card, border: `1px solid ${c.border}` }}>
                <div className="text-sm font-bold" style={{ color: c.orange }}>{card.n}</div>
                <h3 className="mt-4 text-xl font-bold">{card.title}</h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: c.muted }}>{card.desc}</p>
                <div className="my-5 h-px w-full" style={{ background: c.border }} />
                <ul className="flex flex-col gap-2.5">
                  {card.points.map((pt) => (
                    <li key={pt} className="flex items-start gap-2.5 text-sm">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: c.orange }} />
                      {pt}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Reveal>

        {/* callout */}
        <Reveal delay={120}>
          <div className="my-10 h-px w-full" style={{ background: c.border }} />
          <div className="flex items-start gap-4 md:items-center md:gap-5">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-lg font-bold"
                  style={{ border: `1.5px solid ${c.orange}`, color: c.orange }}>!</span>
            <p className="text-base font-bold leading-snug" style={{ maxWidth: "62ch" }}>
              Delayed understanding doesn’t just slow you down— <span style={{ color: c.orange }}>it creates blind spots</span> that lead to financial exposure, regulatory penalties, and reputational damage.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
