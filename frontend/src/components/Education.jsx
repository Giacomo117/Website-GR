import React, { useEffect, useRef, useState } from "react";
import { GraduationCap, MapPin, Award } from "lucide-react";
import { useLang } from "../i18n/LanguageContext";

const EduCard = ({ e, thesisLabel, index }) => {
  const ref = useRef(null);
  const [show, setShow] = useState(false);
  useEffect(() => {
    const ob = new IntersectionObserver(([o]) => o.isIntersecting && setShow(true), { rootMargin: "0px 0px 320px 0px", threshold: 0.01 });
    if (ref.current) ob.observe(ref.current);
    return () => ob.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={`rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent p-6 transition-all duration-700 hover:border-white/20 ${
        show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{ transitionDelay: `${index * 90}ms` }}
    >
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/60">
          <GraduationCap size={13} className="text-[#6f9bff]" /> {e.badge}
        </span>
        <span className="text-xs text-white/40">{e.period}</span>
      </div>
      <h3 className="mt-5 text-lg font-semibold text-white">{e.field}</h3>
      <p className="mt-1 text-sm text-white/65">{e.school}</p>
      <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-white/40">
        <MapPin size={13} /> {e.location}
      </p>
      {e.grade && (
        <p className="mt-3 inline-flex items-center gap-1.5 text-sm text-[#9db8ff]">
          <Award size={14} /> {e.grade}
        </p>
      )}
      <p className="mt-3 text-sm leading-relaxed text-white/50">
        {e.isExchange ? e.thesis : <><span className="text-white/70">{thesisLabel}</span> {e.thesis}</>}
      </p>
    </div>
  );
};

const Education = () => {
  const { c } = useLang();
  const ed = c.education;
  return (
    <section id="formazione" className="relative bg-[#060608] py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-14">
          <span className="text-sm font-medium uppercase tracking-[0.2em] text-[#6f9bff]">{ed.kicker}</span>
          <h2 className="mt-4 text-4xl sm:text-5xl font-semibold tracking-tight text-white">
            {ed.titleA} <span className="font-serif-italic text-white/90">{ed.titleEm}</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {ed.items.map((e, i) => (
            <EduCard key={e.field + e.period} e={e} thesisLabel={ed.thesisLabel} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Education;
