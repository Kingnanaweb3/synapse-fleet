import React from "react";
import { ShieldCheck, Activity, Zap, CheckCircle2 } from "lucide-react";

const c = {
  bg: "#09090A", surface: "#141416", border: "rgba(255,255,255,0.08)",
  text: "#F5F5F4", muted: "#9A9DA4", dim: "#6B6E76", orange: "#F5521C",
};

const GITHUB = "https://github.com/Kingnanaweb3/synapse-fleet";
const TWITTER = "https://x.com/almond_env";

function LogoMark({ size = 26 }) {
  return (
    <img src="/logo.png" alt="Synapse Fleet" style={{ height: size, width: "auto" }} />
  );
}

function GitHubIcon({ size = 16 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
      <path d="M12 .5C5.37.5 0 5.78 0 12.29c0 5.2 3.44 9.6 8.21 11.16.6.11.82-.25.82-.56 0-.28-.01-1.02-.02-2-3.34.71-4.04-1.58-4.04-1.58-.55-1.36-1.34-1.73-1.34-1.73-1.09-.73.08-.72.08-.72 1.21.08 1.84 1.21 1.84 1.21 1.07 1.79 2.81 1.27 3.49.97.11-.76.42-1.27.76-1.56-2.67-.29-5.47-1.31-5.47-5.83 0-1.29.47-2.34 1.24-3.17-.12-.29-.54-1.48.12-3.09 0 0 1.01-.32 3.3 1.21a11.6 11.6 0 0 1 3-.39c1.02 0 2.05.13 3 .39 2.29-1.53 3.3-1.21 3.3-1.21.66 1.61.24 2.8.12 3.09.77.83 1.24 1.88 1.24 3.17 0 4.53-2.81 5.53-5.49 5.82.43.36.81 1.07.81 2.16 0 1.56-.01 2.82-.01 3.2 0 .31.22.68.83.56A12.02 12.02 0 0 0 24 12.29C24 5.78 18.63.5 12 .5z"/>
    </svg>
  );
}

function XIcon({ size = 15 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/>
    </svg>
  );
}

const explore = [
  { label: "How it works", href: "#how-it-works" },
  { label: "The Fleet", href: "#fleet" },
  { label: "Outcomes", href: "#outcomes" },
  { label: "Who it's for", href: "#who-its-for" },
];

const features = [
  { icon: ShieldCheck, t: "Enterprise-grade security", d: "Built with security and privacy at the core." },
  { icon: Activity, t: "Continuous intelligence", d: "Always-on monitoring across regulations and systems." },
  { icon: Zap, t: "Automated execution", d: "From insight to action — without manual handoffs." },
  { icon: CheckCircle2, t: "Human in the loop", d: "You stay in control. We handle the rest." },
];

export default function Footer() {
  return (
    <footer style={{ background: c.bg, color: c.text, borderTop: `1px solid ${c.border}` }}>
      <style>{`
        .foot-link { transition: color .15s ease; }
        .foot-link:hover { color: #F5F5F4; }
        .foot-social { transition: border-color .15s ease, background .15s ease; }
        .foot-social:hover { background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.18); }
      `}</style>

      <div className="mx-auto w-full px-5 py-14 md:px-8 md:py-16 xl:px-10" style={{ maxWidth: 1440 }}>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.4fr_0.8fr_0.8fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <LogoMark />
              <span className="text-lg font-semibold tracking-tight">Synapse <span style={{ color: c.orange }}>Fleet</span></span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed" style={{ color: c.muted }}>
              Autonomous compliance intelligence for a world of evolving regulations.
            </p>
            <div className="mt-5 flex items-center gap-2.5 text-sm" style={{ color: c.muted }}>
              <span style={{ width: 3, height: 18, borderRadius: 2, background: c.orange, display: "inline-block" }} />
              Built for the <span style={{ color: c.text }}>Band of Agents</span> Hackathon
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: c.orange }}>Explore</div>
            <ul className="mt-4 flex flex-col gap-3 text-sm">
              {explore.map((l) => (
                <li key={l.href}><a href={l.href} className="foot-link" style={{ color: c.muted }}>{l.label}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: c.orange }}>Connect</div>
            <p className="mt-4 text-sm" style={{ color: c.muted }}>Follow along and dig into the code.</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <a href={GITHUB} target="_blank" rel="noreferrer" className="foot-social flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium"
                 style={{ background: c.surface, border: `1px solid ${c.border}`, color: c.text }}>
                <GitHubIcon /> GitHub
              </a>
              <a href={TWITTER} target="_blank" rel="noreferrer" className="foot-social flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium"
                 style={{ background: c.surface, border: `1px solid ${c.border}`, color: c.text }}>
                <XIcon /> X (Twitter)
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 rounded-2xl p-6 sm:grid-cols-2 md:p-8 lg:grid-cols-4"
             style={{ background: c.surface, border: `1px solid ${c.border}` }}>
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.t} className="flex gap-3">
                <Icon size={22} color={c.orange} className="mt-0.5 shrink-0" />
                <div>
                  <div className="text-sm font-bold">{f.t}</div>
                  <div className="mt-1 text-sm leading-relaxed" style={{ color: c.muted }}>{f.d}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t pt-6 text-sm md:flex-row"
             style={{ borderColor: c.border, color: c.dim }}>
          <div>© 2026 Synapse Fleet. All rights reserved.</div>
          <div className="flex items-center gap-2" style={{ color: c.muted }}>
            <LogoMark size={16} />
            Built for the <span style={{ color: c.text }}>Band of Agents</span> Hackathon
          </div>
        </div>
      </div>
    </footer>
  );
}
