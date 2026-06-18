import React from "react";
import Reveal from "./Reveal.jsx";

const c = {
  bg: "#09090A",
  text: "#F5F5F4",
  muted: "#9A9DA4",
  dim: "#6B6E76",
  orange: "#F5521C",
};

const cols = [
  "For compliance and risk teams buried in regulatory change — Synapse ingests every new rule the moment it lands and maps your exposure automatically, so nothing slips past you.",
  "For legal and policy leads reconciling obligations across jurisdictions — conflicts are flagged the instant they appear, and one aligned remediation plan is assembled for you.",
  "For executives and boards who need decisions, not data dumps — every finding arrives quantified, prioritized, and board-ready, with a clear action attached.",
];

export default function WhoItsFor() {
  return (
    <section id="who-its-for" style={{ background: c.bg, color: c.text }}>
      <div className="mx-auto w-full px-5 py-14 md:px-8 md:py-16 xl:px-10" style={{ maxWidth: 1440 }}>
        <Reveal>
          <div className="flex items-center gap-3">
            <span style={{ width: 32, height: 1, background: c.dim, display: "inline-block" }} />
            <span className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: c.dim }}>Who it’s for</span>
          </div>
          <h2 className="mt-6 font-semibold tracking-tight"
              style={{ fontSize: "clamp(1.7rem, 3vw + 0.3rem, 2.9rem)", lineHeight: 1.08, letterSpacing: "-0.02em", maxWidth: "16em" }}>
            Made for the teams who <span style={{ color: c.orange }}>answer for compliance.</span>
          </h2>
        </Reveal>

        <Reveal delay={90} className="mt-10 md:mt-12">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-10">
            {cols.map((p, i) => (
              <p key={i} className="text-base leading-relaxed" style={{ color: c.muted }}>{p}</p>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
