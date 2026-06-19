import React from "react";
import Reveal from "./Reveal";
import { Settings2, FileText, ArrowRight } from "lucide-react";

const FONT = "'DM Sans', ui-sans-serif, system-ui, sans-serif";
const MONO = "ui-monospace, SFMono-Regular, Menlo, monospace";
const DASHBOARD_URL = "https://web-production-85997.up.railway.app/";
const GITHUB_URL = "https://github.com/Kingnanaweb3/synapse-fleet";

const c = {
  bg: "#09090A",
  surface: "#141416",
  code: "#0E0E10",
  border: "rgba(255,255,255,0.08)",
  text: "#F5F5F4",
  muted: "#9A9DA4",
  dim: "#6B6E76",
  orange: "#F5521C",
  green: "#34C77B",
};

const steps = [
  {
    icon: <Settings2 size={16} color={c.orange} />,
    title: "Describe your company",
    body: "Edit config/company_profile.json — revenue, jurisdictions, AI systems, headcount.",
  },
  {
    icon: <FileText size={16} color={c.orange} />,
    title: "Add your policies",
    body: "Drop your .txt or .md policy documents into config/policies/.",
  },
];

const lines = [
  { code: "from config.sdk import get_company_context" },
  { code: "" },
  { code: "ctx = get_company_context()" },
  { code: "" },
  { code: 'ctx["company_name"]', note: '"Acme Financial Services Ltd"' },
  { code: 'ctx["profile"]', note: "revenue, jurisdictions, AI systems" },
  { code: 'ctx["policy_text"]', note: "your policy documents" },
  { code: 'ctx["source"]', note: '"sdk"  -> it is using your data' },
];

function GitHubIcon({ size = 15 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
      <path d="M12 .5C5.37.5 0 5.78 0 12.29c0 5.2 3.44 9.6 8.21 11.16.6.11.82-.25.82-.56 0-.28-.01-1.02-.02-2-3.34.71-4.04-1.58-4.04-1.58-.55-1.36-1.34-1.73-1.34-1.73-1.09-.73.08-.72.08-.72 1.21.08 1.84 1.21 1.84 1.21 1.07 1.79 2.81 1.27 3.49.97.11-.76.42-1.27.76-1.56-2.67-.29-5.47-1.31-5.47-5.83 0-1.29.47-2.34 1.24-3.17-.12-.29-.54-1.48.12-3.09 0 0 1.01-.32 3.3 1.21a11.6 11.6 0 0 1 3-.39c1.02 0 2.05.13 3 .39 2.29-1.53 3.3-1.21 3.3-1.21.66 1.61.24 2.8.12 3.09.77.83 1.24 1.88 1.24 3.17 0 4.53-2.81 5.53-5.49 5.82.43.36.81 1.07.81 2.16 0 1.56-.01 2.82-.01 3.2 0 .31.22.68.83.56A12.02 12.02 0 0 0 24 12.29C24 5.78 18.63.5 12 .5z" />
    </svg>
  );
}

export default function SDK() {
  return (
    <section id="sdk" style={{ background: c.bg, color: c.text, fontFamily: FONT }}>
      <style>{`
        .sdk-btn { transition: transform .15s ease, filter .15s ease; }
        .sdk-btn:hover { transform: translateY(-1px); filter: brightness(1.05); }
        .sdk-ghost { transition: background .15s ease, border-color .15s ease; }
        .sdk-ghost:hover { background: rgba(255,255,255,0.04); }
      `}</style>

      <div className="mx-auto w-full px-5 py-16 md:px-8 md:py-20 xl:px-10" style={{ maxWidth: 1440 }}>
        <Reveal>
          <div className="flex items-center gap-2.5">
            <span style={{ width: 18, height: 2, borderRadius: 2, background: c.orange, display: "inline-block" }} />
            <span className="text-sm font-medium" style={{ color: c.muted }}>The SDK</span>
          </div>
          <h2 className="mt-4 font-semibold tracking-tight"
              style={{ fontSize: "clamp(1.6rem, 2.6vw + 0.3rem, 2.5rem)", lineHeight: 1.06, letterSpacing: "-0.02em", maxWidth: "14em" }}>
            Point the fleet at <span style={{ color: c.orange }}>your own company.</span>
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-relaxed" style={{ color: c.muted }}>
            Synapse Fleet ships with an SDK. Drop in your company profile and policy documents —
            no code changes — and the same five agents analyze you.
          </p>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-center lg:gap-12">
          {/* LEFT — steps + CTA */}
          <Reveal delay={80}>
            <div className="flex flex-col gap-5">
              {steps.map((s, i) => (
                <div key={s.title} className="flex gap-4 rounded-2xl p-5"
                     style={{ background: c.surface, border: `1px solid ${c.border}` }}>
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-sm font-semibold"
                       style={{ background: "rgba(245,82,28,0.12)", color: c.orange }}>
                    {i + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-sm font-semibold">{s.icon} {s.title}</div>
                    <p className="mt-1.5 text-sm leading-relaxed" style={{ color: c.muted }}>{s.body}</p>
                  </div>
                </div>
              ))}

              <div className="mt-1 flex items-center gap-2.5 text-sm" style={{ color: c.muted }}>
                <span style={{ width: 18, height: 2, borderRadius: 2, background: c.green, display: "inline-block" }} />
                That&apos;s it — run a regulation and the report is about you.
              </div>

              <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                <a href={DASHBOARD_URL} target="_blank" rel="noreferrer"
                   className="sdk-btn flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold"
                   style={{ background: c.orange, color: "#fff" }}>
                  Run it live <ArrowRight size={16} />
                </a>
                <a href={GITHUB_URL} target="_blank" rel="noreferrer"
                   className="sdk-ghost flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold"
                   style={{ background: "transparent", color: c.text, border: `1px solid ${c.border}` }}>
                  <GitHubIcon /> View the code
                </a>
              </div>
            </div>
          </Reveal>

          {/* RIGHT — code block */}
          <Reveal delay={140}>
            <div className="overflow-hidden rounded-2xl" style={{ background: c.code, border: `1px solid ${c.border}` }}>
              <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: `1px solid ${c.border}` }}>
                <span className="inline-block h-3 w-3 rounded-full" style={{ background: "#FF5F57" }} />
                <span className="inline-block h-3 w-3 rounded-full" style={{ background: "#FEBC2E" }} />
                <span className="inline-block h-3 w-3 rounded-full" style={{ background: "#28C840" }} />
                <span className="ml-2 text-xs" style={{ color: c.dim, fontFamily: MONO }}>your_app.py</span>
              </div>
              <div className="overflow-x-auto px-5 py-5 text-[13px] leading-6"
                   style={{ fontFamily: MONO, color: c.text }}>
                {lines.map((l, i) => (
                  <div key={i} style={{ whiteSpace: "pre" }}>
                    {l.code === ""
                      ? "\u00A0"
                      : (
                        <span>
                          {l.code}
                          {l.note ? <span style={{ color: c.dim }}>{"   # " + l.note}</span> : null}
                        </span>
                      )}
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
