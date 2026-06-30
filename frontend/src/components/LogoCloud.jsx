import React from "react";
import { useLang } from "../i18n/LanguageContext";

/* Row 1 — Giacomo's personal stack (text marquee, original aesthetic kept) */
const TECH = [
  "Python", "PyTorch", "TensorFlow", "LangChain", "OpenCV", "RAG Systems",
  "FastAPI", "Django", "React", "TypeScript", "Docker", "Kubernetes",
  "Azure", "Neo4j", "PostgreSQL", "Redis", "MongoDB", "Git", "Linux", "AutoGen",
];

/* Row 2 — Curated best-in-class tech logos (image marquee, opposite direction).
   Slugs match Simple Icons CDN: https://cdn.simpleicons.org/<slug>
   Logos are served as monochrome SVGs and re-tinted via CSS filter so they
   look uniform in both dark and light mode. Kept compact (~26 icons) so the
   initial page weight stays low. */
const TECH_LOGOS = [
  { slug: "python", name: "Python" },
  { slug: "typescript", name: "TypeScript" },
  { slug: "javascript", name: "JavaScript" },
  { slug: "react", name: "React" },
  { slug: "nextdotjs", name: "Next.js" },
  { slug: "nodedotjs", name: "Node.js" },
  { slug: "tailwindcss", name: "Tailwind" },
  { slug: "django", name: "Django" },
  { slug: "fastapi", name: "FastAPI" },
  { slug: "pytorch", name: "PyTorch" },
  { slug: "tensorflow", name: "TensorFlow" },
  { slug: "openai", name: "OpenAI", src: "/assets/logos/openai.svg" },
  { slug: "huggingface", name: "Hugging Face" },
  { slug: "postgresql", name: "PostgreSQL" },
  { slug: "mongodb", name: "MongoDB" },
  { slug: "redis", name: "Redis" },
  { slug: "neo4j", name: "Neo4j" },
  { slug: "docker", name: "Docker" },
  { slug: "kubernetes", name: "Kubernetes" },
  { slug: "amazonwebservices", name: "AWS", src: "/assets/logos/aws.svg" },
  { slug: "microsoftazure", name: "Azure", src: "/assets/logos/azure.svg" },
  { slug: "googlecloud", name: "Google Cloud" },
  { slug: "linux", name: "Linux" },
  { slug: "git", name: "Git" },
  { slug: "github", name: "GitHub" },
  { slug: "graphql", name: "GraphQL" },
];

/* A single copy of the marquee track. We render two of these side-by-side
   inside an animated parent. Because each copy carries identical inner gaps
   AND identical right-padding (to act as the "seam gap"), translating the
   outer parent by exactly -50% produces a perfectly seamless loop with no
   visible jumps or empty stretches. */
const TextRow = ({ items }) => (
  <div className="flex shrink-0 items-center gap-16 sm:gap-20 pr-16 sm:pr-20 py-3">
    {items.map((label, i) => (
      <span
        key={i}
        className="tech-item whitespace-nowrap text-xl font-semibold tracking-tight text-white/35"
      >
        {label}
      </span>
    ))}
  </div>
);

const LogoRow = ({ items }) => (
  <div className="flex shrink-0 items-center gap-10 sm:gap-12 pr-10 sm:pr-12 py-5">
    {items.map((logo, i) => (
      <div
        key={`${logo.slug}-${i}`}
        title={logo.name}
        className="tech-logo group/logo relative flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center"
      >
        <img
          src={logo.src ? logo.src : `https://cdn.simpleicons.org/${logo.slug}`}
          alt={logo.name}
          loading="lazy"
          decoding="async"
          className="tech-logo-img h-full w-full object-contain transition-all duration-300"
        />
        <span className="tech-logo-tip pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border border-white/10 bg-[#111113] px-2 py-1 text-[11px] font-medium text-white/80 opacity-0 backdrop-blur-md transition-opacity duration-200 group-hover/logo:opacity-100">
          {logo.name}
        </span>
      </div>
    ))}
  </div>
);

const LogoCloud = () => {
  const { c } = useLang();

  // Each marquee "copy" repeats the items so a single copy is always wider
  // than even ultra-wide monitors — this guarantees the strip fills the
  // viewport edge-to-edge from the very first frame (no empty gap on large
  // screens) while the two-copies + translateX(-50%) loop stays seamless.
  const techLoop = [...TECH, ...TECH];
  const logosLoop = [...TECH_LOGOS, ...TECH_LOGOS];

  return (
    <section className="relative bg-[#060608] py-24 sm:py-28">
      <div className="mx-auto max-w-6xl px-6 text-center">
        <h2 className="text-2xl sm:text-3xl font-medium text-white">{c.tech.title}</h2>
        <p className="mt-1 text-lg text-white/45">{c.tech.subtitle}</p>
      </div>

      {/* Row 1 — text marquee with Giacomo's personal stack */}
      <div className="relative mt-12 overflow-hidden">
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-32 bg-gradient-to-r from-[var(--bg)] to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-32 bg-gradient-to-l from-[var(--bg)] to-transparent" />

        <div className="flex w-max animate-marquee">
          <TextRow items={techLoop} />
          <TextRow items={techLoop} />
        </div>
      </div>

      {/* Row 2 — logo marquee (opposite direction) */}
      <div className="relative mt-10 overflow-hidden">
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-32 bg-gradient-to-r from-[var(--bg)] to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-32 bg-gradient-to-l from-[var(--bg)] to-transparent" />

        <div className="flex w-max animate-marquee-reverse">
          <LogoRow items={logosLoop} />
          <LogoRow items={logosLoop} />
        </div>
      </div>
    </section>
  );
};

export default LogoCloud;
