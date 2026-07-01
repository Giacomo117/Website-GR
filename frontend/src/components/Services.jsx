import React, { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { useLang } from "../i18n/LanguageContext";

// Per-service accent pair cycled across the cards
const SERVICE_ACCENTS = [
  { a: "99,102,241", b: "168,85,247" },   // indigo → purple
  { a: "59,130,246", b: "99,102,241" },   // blue → indigo
  { a: "168,85,247", b: "236,72,153" },   // purple → pink
  { a: "236,72,153", b: "59,130,246" },   // pink → blue
];

/* Card styled to match the Projects bento tiles: full-bleed accent mesh
   background (instead of a photo), badge + arrow-circle header, top accent
   ring and a row of skill chips. Static gradients keep it light on mobile
   GPUs while looking polished inside the horizontal carousel. */
const Card = ({ s, index }) => {
  const ref = useRef(null);
  const [show, setShow] = useState(false);
  const accent = SERVICE_ACCENTS[index % SERVICE_ACCENTS.length];
  useEffect(() => {
    const ob = new IntersectionObserver(
      ([e]) => e.isIntersecting && setShow(true),
      { threshold: 0.2 }
    );
    if (ref.current) ob.observe(ref.current);
    return () => ob.disconnect();
  }, []);
  const goToContact = () => {
    const el = document.getElementById("contattaci");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  return (
    <button
      ref={ref}
      onClick={goToContact}
      className={`service-card group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0d] text-left transition-all duration-700 min-h-[220px] hover:border-white/25 hover:-translate-y-1 ${
        show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{ transitionDelay: `${index * 90}ms` }}
    >
      {/* Accent mesh background — always visible so the tile never looks empty */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(120% 95% at 0% 0%, rgba(${accent.a},0.20), transparent 55%), radial-gradient(120% 95% at 100% 100%, rgba(${accent.b},0.16), transparent 55%)`,
        }}
      />
      {/* Subtle grain to match the cosmic vibe */}
      <div
        className="pointer-events-none absolute inset-0 mix-blend-overlay opacity-[0.15]"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.4) 1px, transparent 1px)",
          backgroundSize: "3px 3px",
        }}
      />
      {/* Aurora accent ring (top edge) — brightens on hover */}
      <span
        className="pointer-events-none absolute inset-x-6 top-0 h-px origin-center scale-x-0 opacity-0 transition-all duration-500 group-hover:scale-x-100 group-hover:opacity-100"
        style={{ background: `linear-gradient(90deg, transparent, rgb(${accent.a}), rgb(${accent.b}), transparent)` }}
      />
      {/* Soft corner glow (hover only) */}
      <div
        className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: `radial-gradient(circle, rgba(${accent.b},0.35), transparent 70%)` }}
      />

      {/* CONTENT */}
      <div className="relative z-10 flex h-full flex-col justify-between p-6 sm:p-7">
        <div className="flex items-start justify-between gap-3">
          <span
            className="rounded-full border px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider text-white/85 backdrop-blur-md"
            style={{ borderColor: `rgba(${accent.a},0.45)`, backgroundColor: "rgba(15,15,20,0.55)" }}
          >
            {s.tag}
          </span>
          <div
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/15 text-white/75 backdrop-blur-md transition-all duration-300 group-hover:scale-110 group-hover:border-white/40 group-hover:text-white"
            style={{ backgroundColor: "rgba(15,15,20,0.55)" }}
          >
            <ArrowUpRight
              size={16}
              className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-2xl font-semibold leading-[1.1] tracking-tight text-white">{s.title}</h3>
          <p className="mt-2.5 text-[14px] leading-relaxed text-white/60 clamp-3">{s.desc}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {s.points.map((p) => (
              <span
                key={p}
                className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[11px] font-medium text-white/70 backdrop-blur-sm"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </button>
  );
};

const Services = () => {
  const { c } = useLang();
  const s = c.services;
  return (
    <section id="competenze" className="relative bg-[#060608] py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl">
          <span className="gradient-text-aurora text-sm font-medium uppercase tracking-[0.2em]">{s.kicker}</span>
          <h2 className="mt-4 text-4xl sm:text-5xl font-semibold tracking-tight text-white">
            {s.titleA} <span className="font-serif-italic text-white/90">{s.titleEm}</span>
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-white/50">{s.intro}</p>
          {/* Mobile-only swipe hint (same behaviour as the Projects carousel) */}
          <p className="mt-3 text-xs text-white/35 lg:hidden">← {c.projects.swipeHint} →</p>
        </div>
        <div className="projects-bento mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {s.items.map((item, i) => (
            <Card key={item.title} s={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
