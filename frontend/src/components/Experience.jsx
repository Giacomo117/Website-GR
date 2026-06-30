import React, { useEffect, useRef, useState } from "react";
import { Briefcase } from "lucide-react";
import { useLang } from "../i18n/LanguageContext";

const Item = ({ x, index, last }) => {
  const ref = useRef(null);
  const [show, setShow] = useState(false);
  useEffect(() => {
    const ob = new IntersectionObserver(
      ([e]) => e.isIntersecting && setShow(true),
      { rootMargin: "0px 0px 320px 0px", threshold: 0.01 }
    );
    if (ref.current) ob.observe(ref.current);
    return () => ob.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`relative pl-10 sm:pl-14 transition-all duration-700 ${
        show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      } ${last ? "" : "pb-12"}`}
      style={{ transitionDelay: `${index * 90}ms` }}
    >
      {!last && <span className="absolute left-[15px] sm:left-[19px] top-9 bottom-0 w-px bg-white/10" />}
      <span className="absolute left-0 top-1.5 flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-white/10 bg-white/5">
        <Briefcase size={15} className="text-[#6f9bff]" />
      </span>

      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-xl font-semibold text-white">{x.role}</h3>
        <span className="text-sm text-white/40">{x.period}</span>
      </div>
      <p className="mt-1 text-[15px] text-white/70">
        {x.company} <span className="text-white/35">· {x.meta}</span>
      </p>
      <p className="mt-3 text-[15px] leading-relaxed text-white/50">{x.desc}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {x.tags.map((t) => (
          <span key={t} className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-white/60">
            {t}
          </span>
        ))}
      </div>
    </div>
  );
};

const Experience = () => {
  const { c } = useLang();
  const e = c.experience;
  return (
    <section id="esperienza" className="relative bg-[#060608] py-24 sm:py-32">
      <div className="mx-auto max-w-4xl px-6">
        <div className="mb-14">
          <span className="text-sm font-medium uppercase tracking-[0.2em] text-[#6f9bff]">{e.kicker}</span>
          <h2 className="mt-4 text-4xl sm:text-5xl font-semibold tracking-tight text-white">
            {e.titleA} <span className="font-serif-italic text-white/90">{e.titleEm}</span>
          </h2>
        </div>
        <div>
          {e.items.map((x, i) => (
            <Item key={x.role} x={x} index={i} last={i === e.items.length - 1} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
