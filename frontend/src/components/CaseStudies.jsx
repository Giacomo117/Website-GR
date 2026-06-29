import React, { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Github, FileText, ExternalLink, Sparkles } from "lucide-react";
import { useLang } from "../i18n/LanguageContext";
import { projectsData } from "../i18n/projectsData";
import { person } from "../i18n/content";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";

const iconFor = (name) => {
  if (name === "github") return Github;
  if (name === "paper") return FileText;
  return ExternalLink;
};

/* Per-project accent palette (mapped to the existing theme tokens so they
   re-skin automatically in light mode). Each entry is a pair of CSS color
   strings used to build the mesh gradient + glow ring. */
const ACCENT_BY_INDEX = [
  { a: "var(--acc-1)", b: "var(--acc-3)" }, // Civetta
  { a: "var(--acc-2)", b: "var(--acc-1)" }, // AutoGuardian
  { a: "var(--acc-4)", b: "var(--acc-2)" }, // Drowsiness
  { a: "var(--acc-3)", b: "var(--acc-4)" }, // Excogita
  { a: "var(--acc-1)", b: "var(--acc-2)" }, // Routing
];

/* Bento layout per breakpoint — keeps Civetta + Excogita as the two hero tiles. */
const LAYOUT = [
  // Civetta — large featured (tall, left)
  { col: "lg:col-span-7", row: "lg:row-span-2", featured: true, minH: "min-h-[460px]" },
  // AutoGuardian — top right
  { col: "lg:col-span-5", row: "lg:row-span-1", featured: false, minH: "min-h-[220px]" },
  // Drowsiness — mid right
  { col: "lg:col-span-5", row: "lg:row-span-1", featured: false, minH: "min-h-[220px]" },
  // Excogita — large featured (bottom left)
  { col: "lg:col-span-7", row: "lg:row-span-2", featured: true, minH: "min-h-[420px]" },
  // Routing — tall right
  { col: "lg:col-span-5", row: "lg:row-span-2", featured: false, minH: "min-h-[420px]" },
];

const ProjectCard = ({ p, index, onOpen }) => {
  const ref = useRef(null);
  const [show, setShow] = useState(false);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, mx: 50, my: 50 });
  const accent = ACCENT_BY_INDEX[index % ACCENT_BY_INDEX.length];
  const meta = LAYOUT[index] || LAYOUT[1];

  useEffect(() => {
    const ob = new IntersectionObserver(
      ([e]) => e.isIntersecting && setShow(true),
      { threshold: 0.15 }
    );
    if (ref.current) ob.observe(ref.current);
    return () => ob.disconnect();
  }, []);

  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    // Soft tilt (max ~5deg)
    setTilt({
      rx: (0.5 - y) * 5,
      ry: (x - 0.5) * 5,
      mx: x * 100,
      my: y * 100,
    });
  };
  const onLeave = () => setTilt({ rx: 0, ry: 0, mx: 50, my: 50 });

  return (
    <button
      ref={ref}
      data-testid={`project-card-${p.id}`}
      onClick={() => onOpen(p)}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0d] text-left transition-all duration-700 ${meta.col} ${meta.row} ${meta.minH} ${
        show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      } hover:border-white/25 hover:-translate-y-1`}
      style={{
        transitionDelay: `${index * 90}ms`,
        transform: `perspective(1100px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
        transformStyle: "preserve-3d",
      }}
    >
      {/* Background image — full-bleed, slightly desaturated, zooms on hover */}
      <div className="absolute inset-0">
        <img
          src={p.image}
          alt={p.title}
          loading="lazy"
          className="h-full w-full object-cover opacity-60 transition-all duration-[1200ms] ease-out group-hover:scale-[1.06] group-hover:opacity-75"
        />
        {/* Theme-aware tonal wash so text stays readable on both light & dark */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgb(var(--card-wash)) 0%, rgb(var(--card-wash) / 0.92) 35%, rgb(var(--card-wash) / 0.55) 65%, rgb(var(--card-wash) / 0.2) 100%)",
          }}
        />
        {/* Subtle grain to match cosmic vibe */}
        <div
          className="absolute inset-0 mix-blend-overlay opacity-[0.18]"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.45) 1px, transparent 1px)",
            backgroundSize: "3px 3px",
          }}
        />
      </div>

      {/* Color mesh that follows the cursor (lights up on hover) */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(420px circle at ${tilt.mx}% ${tilt.my}%, rgb(${accent.a} / 0.32), transparent 60%)`,
        }}
      />
      {/* Aurora accent ring (top edge) */}
      <span
        className="pointer-events-none absolute inset-x-6 top-0 h-px origin-center scale-x-0 opacity-0 transition-all duration-500 group-hover:scale-x-100 group-hover:opacity-100"
        style={{
          background: `linear-gradient(90deg, transparent, rgb(${accent.a}), rgb(${accent.b}), transparent)`,
        }}
      />
      {/* Soft corner glow */}
      <div
        className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: `radial-gradient(circle, rgb(${accent.b} / 0.35), transparent 70%)` }}
      />

      {/* CONTENT */}
      <div className="card-3d relative z-10 flex h-full flex-col justify-between p-6 sm:p-7">
        {/* Top row: badge + arrow + number */}
        <div className="card-layer-top flex items-start justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="rounded-full border px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider text-white/85 backdrop-blur-md"
              style={{
                borderColor: `rgb(${accent.a} / 0.45)`,
                backgroundColor: "rgb(var(--card-wash) / 0.55)",
              }}
            >
              {p.category}
            </span>
            <span
              className="rounded-full border border-white/10 px-2.5 py-1 text-[11px] font-medium text-white/65 backdrop-blur-md"
              style={{ backgroundColor: "rgb(var(--card-wash) / 0.45)" }}
            >
              {p.year}
            </span>
            {meta.featured && (
              <span
                className="inline-flex items-center gap-1 rounded-full border border-white/10 px-2.5 py-1 text-[11px] font-medium text-white/75 backdrop-blur-md"
                style={{ backgroundColor: "rgb(var(--card-wash) / 0.45)" }}
              >
                <Sparkles size={11} style={{ color: `rgb(${accent.a})` }} /> Featured
              </span>
            )}
          </div>
          <div
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/15 text-white/75 backdrop-blur-md transition-all duration-300 group-hover:scale-110 group-hover:border-white/40 group-hover:text-white"
            style={{ backgroundColor: "rgb(var(--card-wash) / 0.55)" }}
          >
            <ArrowUpRight
              size={16}
              className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </div>
        </div>

        {/* Bottom: number + title + tech */}
        <div className="card-layer-content mt-6">
          <div className="flex items-end justify-between gap-4">
            <h3
              className={`project-title font-semibold leading-[1.1] tracking-tight text-white ${
                meta.featured ? "text-3xl sm:text-4xl" : "text-2xl"
              }`}
            >
              {p.title}
            </h3>
            <span
              className="card-layer-numeral hidden font-serif-italic text-3xl leading-none text-white/15 group-hover:text-white/35 sm:block sm:text-5xl"
              aria-hidden="true"
            >
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>

          {meta.featured && (
            <p className="mt-3 max-w-xl text-[14px] leading-relaxed text-white/65 clamp-3">
              {p.summary}
            </p>
          )}

          {/* Tech ticker — auto-scrolling skill chips, pauses on card hover */}
          <div className="relative mt-4 overflow-hidden">
            <div className="tech-ticker-track flex w-max items-center gap-2 whitespace-nowrap">
              {[...p.skills, ...p.skills].map((s, i) => (
                <span
                  key={`${s}-${i}`}
                  className="shrink-0 rounded-md border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[11px] font-medium text-white/70 backdrop-blur-sm"
                >
                  {s}
                </span>
              ))}
            </div>
            {/* Edge fades so chips appear/disappear smoothly */}
            <div
              className="pointer-events-none absolute inset-y-0 left-0 w-10"
              style={{
                background:
                  "linear-gradient(to right, rgb(var(--card-wash)) 0%, rgb(var(--card-wash) / 0) 100%)",
              }}
            />
            <div
              className="pointer-events-none absolute inset-y-0 right-0 w-10"
              style={{
                background:
                  "linear-gradient(to left, rgb(var(--card-wash)) 0%, rgb(var(--card-wash) / 0) 100%)",
              }}
            />
          </div>
        </div>
      </div>
    </button>
  );
};

const ProjectModal = ({ project, labels, onClose }) => {
  if (!project) return null;
  return (
    <Dialog open={!!project} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl w-[calc(100%-2rem)] max-h-[88vh] overflow-y-auto border-white/10 bg-[#0a0a0d] p-0 text-white">
        <div className="relative h-44 w-full overflow-hidden sm:h-52">
          <img src={project.image} alt={project.title} className="h-full w-full object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-elevated)] to-transparent" />
          <div className="absolute bottom-4 left-6 right-6">
            <div className="flex items-center gap-2 text-xs text-white/60">
              <span className="rounded-full border border-white/15 bg-black/40 px-2.5 py-1 backdrop-blur-sm">{project.category}</span>
              <span className="rounded-full border border-white/15 bg-black/40 px-2.5 py-1 backdrop-blur-sm">{project.year}</span>
            </div>
          </div>
        </div>

        <div className="px-6 pb-8 pt-2">
          <DialogTitle className="text-2xl font-semibold tracking-tight text-white">{project.title}</DialogTitle>
          {project.association && (
            <p className="mt-1.5 text-sm text-[#9db8ff]">{labels.association} {project.association}</p>
          )}

          <p className="mt-5 text-[15px] leading-relaxed text-white/65">{project.summary}</p>

          {project.sections.map((sec) => (
            <div key={sec.heading} className="mt-6">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-white/45">{sec.heading}</h4>
              {sec.items ? (
                <ul className="mt-3 space-y-2.5">
                  {sec.items.map((it, i) => (
                    <li key={i} className="flex gap-2.5 text-[14.5px] leading-relaxed text-white/60">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#6f9bff]" />
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-[14.5px] leading-relaxed text-white/60">{sec.text}</p>
              )}
            </div>
          ))}

          <div className="mt-7">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white/45">{labels.skillsLabel}</h4>
            <div className="mt-3 flex flex-wrap gap-2">
              {project.skills.map((s) => (
                <span key={s} className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-sm text-white/70">
                  {s}
                </span>
              ))}
            </div>
          </div>

          {project.links.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-3">
              {project.links.map((l) => {
                const Icon = iconFor(l.icon);
                return (
                  <a
                    key={l.label}
                    href={l.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black transition-all hover:scale-[1.03]"
                  >
                    <Icon size={15} /> {l.label}
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const CaseStudies = () => {
  const { c } = useLang();
  const p = c.projects;
  const [selected, setSelected] = useState(null);

  return (
    <section id="progetti" className="relative bg-[#060608] py-24 sm:py-32">
      {/* Ambient nebula glow behind the grid */}
      <div className="pointer-events-none absolute inset-x-0 top-1/3 -z-0 mx-auto h-[420px] max-w-5xl opacity-50 blur-3xl">
        <div
          className="h-full w-full"
          style={{
            background:
              "radial-gradient(60% 60% at 20% 40%, rgb(var(--acc-1) / 0.25), transparent 70%), radial-gradient(50% 50% at 80% 60%, rgb(var(--acc-3) / 0.22), transparent 70%)",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="gradient-text-aurora text-sm font-medium uppercase tracking-[0.2em]">{p.kicker}</span>
            <h2 className="mt-4 text-4xl sm:text-5xl font-semibold tracking-tight text-white">
              {p.titleA} <span className="font-serif-italic text-white/90">{p.titleEm}</span>
            </h2>
          </div>
          <a
            href={person.socials.github}
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-white/10 px-4 py-2 text-sm text-white/70 transition-colors hover:border-white/30 hover:text-white"
          >
            {p.all} <ArrowUpRight size={15} />
          </a>
        </div>

        <p className="mt-3 inline-flex items-center gap-1.5 text-sm text-white/40">
          <Sparkles size={14} /> {p.detailsHint}
        </p>

        {/* Bento grid */}
        <div className="mt-10 grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-12 lg:auto-rows-[220px]">
          {projectsData.map((proj, i) => (
            <ProjectCard key={proj.id} p={proj} index={i} onOpen={setSelected} />
          ))}
        </div>
      </div>

      <ProjectModal project={selected} labels={p} onClose={() => setSelected(null)} />
    </section>
  );
};

export default CaseStudies;
