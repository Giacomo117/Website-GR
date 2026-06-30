import React, { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Check } from "lucide-react";
import { useLang } from "../i18n/LanguageContext";

// Accent palette cycled across the service cards — uses theme CSS variables.
const SERVICE_ACCENTS = ["var(--acc-1)", "var(--acc-2)", "var(--acc-3)", "var(--acc-4)"];

const Card = ({ s, index }) => {
  const ref = useRef(null);
  const [show, setShow] = useState(false);
  const accent = SERVICE_ACCENTS[index % SERVICE_ACCENTS.length];
  useEffect(() => {
    const ob = new IntersectionObserver(
      ([e]) => e.isIntersecting && setShow(true),
      { rootMargin: "0px 0px 320px 0px", threshold: 0.01 }
    );
    if (ref.current) ob.observe(ref.current);
    return () => ob.disconnect();
  }, []);
  const goToContact = () => {
    const el = document.getElementById("contattaci");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  return (
    <div
      ref={ref}
      onClick={goToContact}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && goToContact()}
      className={`group relative cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent p-7 transition-all duration-700 hover:-translate-y-1 hover:border-white/20 ${
        show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{ transitionDelay: `${index * 90}ms` }}
    >
      {/* top accent line that draws in on hover */}
      <span
        className="pointer-events-none absolute inset-x-5 top-0 h-px origin-center scale-x-0 opacity-0 transition-all duration-500 group-hover:scale-x-100 group-hover:opacity-100"
        style={{ background: `linear-gradient(90deg, transparent, rgb(${accent} / 0.9), transparent)` }}
      />
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: `radial-gradient(circle, rgb(${accent} / 0.28), transparent 70%)` }}
      />
      <div className="flex items-center justify-between">
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/60">
          {s.tag}
        </span>
        <ArrowUpRight className="text-white/30 transition-all duration-300 group-hover:text-white group-hover:rotate-45" size={20} />
      </div>
      <h3 className="mt-6 text-xl font-semibold text-white">{s.title}</h3>
      <p className="mt-2.5 text-[15px] leading-relaxed text-white/50">{s.desc}</p>
      <ul className="mt-5 space-y-2">
        {s.points.map((p) => (
          <li key={p} className="flex items-center gap-2 text-sm text-white/65">
            <Check size={15} style={{ color: `rgb(${accent})` }} />
            {p}
          </li>
        ))}
      </ul>
    </div>
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
