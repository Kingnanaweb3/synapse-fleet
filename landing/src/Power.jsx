import React from "react";
import Reveal from "./Reveal.jsx";
import { ArrowDownRight, ArrowDownLeft, ArrowUpRight, ArrowUpLeft } from "lucide-react";

const c = {
  bg: "#09090A",
  text: "#F5F5F4",
  muted: "#9A9DA4",
  orange: "#F5521C",
  gray: "#3A3B3F",
};

const caps = [
  { t: "Continuous regulation ingestion", d: "Never miss a change. Ever." },
  { t: "Real-time exposure visibility", d: "See impact across your entire organization." },
  { t: "Financial risk quantification", d: "Turn regulatory impact into monetary risk." },
  { t: "Automated remediation planning", d: "From insight to action—instantly." },
  { t: "Board-level decision output", d: "Board-ready memos, approved faster." },
];

function ArrowsGraphic() {
  const s = { width: "60%", height: "60%" };
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[230px] lg:max-w-sm">
      <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 34% 32%, rgba(245,82,28,0.20), transparent 60%)" }} />
      <div className="relative grid h-full w-full grid-cols-2 place-items-center">
        <ArrowDownRight color={c.orange} strokeWidth={2.2} style={s} />
        <ArrowDownLeft color={c.gray} strokeWidth={2.2} style={s} />
        <ArrowUpRight color={c.gray} strokeWidth={2.2} style={s} />
        <ArrowUpLeft color={c.gray} strokeWidth={2.2} style={s} />
      </div>
    </div>
  );
}

export default function Power() {
  return (
    <section id="power" style={{ background: c.bg, color: c.text }}>
      <div className="mx-auto w-full px-5 py-14 md:px-8 md:py-16 xl:px-10" style={{ maxWidth: 1440 }}>
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:gap-10">
          <Reveal>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider" style={{ color: c.orange }}>
              <span style={{ width: 18, height: 2, borderRadius: 2, background: c.orange, display: "inline-block" }} />
              The Power of Synapse Fleet
            </div>
            <h2 className="mt-4 font-semibold tracking-tight"
                style={{ fontSize: "clamp(1.6rem, 2.8vw + 0.3rem, 2.6rem)", lineHeight: 1.05, letterSpacing: "-0.02em" }}>
              <span className="block">More than</span>
              <span className="block">compliance <span style={{ color: c.orange }}>automation.</span></span>
            </h2>
            <div className="mt-7 flex flex-col gap-4">
              {caps.map((cap) => (
                <div key={cap.t} className="pl-4" style={{ borderLeft: `2px solid ${c.orange}` }}>
                  <div className="font-bold">{cap.t}</div>
                  <div className="mt-0.5 text-sm" style={{ color: c.muted }}>{cap.d}</div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={120}>
            <ArrowsGraphic />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
