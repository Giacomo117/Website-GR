import React from "react";
import { useLang } from "../i18n/LanguageContext";

const About = () => {
  const { c } = useLang();
  const a = c.about;

  return (
    <section id="su-di-me" className="relative overflow-hidden bg-[#060608] py-24 sm:py-32">
      {/* Soft ambient glow on the side, so the section feels alive without overpowering */}
      <div
        className="pointer-events-none absolute -left-32 top-1/3 h-96 w-96 rounded-full blur-[120px] opacity-60"
        style={{ background: "radial-gradient(circle, rgb(var(--acc-1) / 0.22), transparent 70%)" }}
      />
      <div
        className="pointer-events-none absolute -right-32 bottom-0 h-[28rem] w-[28rem] rounded-full blur-[120px] opacity-50"
        style={{ background: "radial-gradient(circle, rgb(var(--acc-4) / 0.18), transparent 70%)" }}
      />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Photo column */}
          <div className="relative lg:col-span-5">
            <div className="relative mx-auto aspect-[4/5] w-full max-w-sm lg:max-w-none">
              {/* Aurora ring behind the photo */}
              <div
                className="pointer-events-none absolute -inset-3 rounded-[2rem] opacity-70 blur-2xl"
                style={{
                  background:
                    "linear-gradient(135deg, rgb(var(--acc-1) / 0.45), rgb(var(--acc-3) / 0.35), rgb(var(--acc-4) / 0.4))",
                }}
              />
              {/* Photo frame */}
              <div className="relative h-full w-full overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#0a0a0d] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.6)]">
                <img
                  src="/assets/giacomo.jpeg"
                  alt={a.imageAlt}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                />
                {/* subtle bottom vignette to blend into dark background */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#060608]/55 to-transparent" />
              </div>

              {/* Small badge floating on the frame */}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 inline-flex items-center gap-2 rounded-full border border-white/12 bg-[#0c0c0f]/90 px-4 py-2 text-[12px] font-medium text-white/85 backdrop-blur-md">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                {a.facts[0].value}
              </div>
            </div>
          </div>

          {/* Text column */}
          <div className="lg:col-span-7">
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-white/45">{a.kicker}</p>
            <h2 className="mt-3 text-4xl sm:text-5xl font-semibold tracking-tight text-white">
              {a.titleA} <span className="font-serif-italic">{a.titleEm}</span>
            </h2>

            <div className="mt-7 space-y-4 text-[15.5px] leading-relaxed text-white/65">
              {a.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {a.facts.map((f) => (
                <div
                  key={f.label}
                  className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 backdrop-blur-sm"
                >
                  <p className="text-[11px] font-medium uppercase tracking-wider text-white/40">{f.label}</p>
                  <p className="mt-1 text-sm font-medium text-white/90">{f.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
