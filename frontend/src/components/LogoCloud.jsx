import React from "react";
import { useLang } from "../i18n/LanguageContext";

/* Row 1 — Giacomo's personal stack (text marquee, original aesthetic kept) */
const TECH = [
  "Python", "PyTorch", "TensorFlow", "LangChain", "OpenCV", "RAG Systems",
  "FastAPI", "Django", "React", "TypeScript", "Docker", "Kubernetes",
  "Azure", "Neo4j", "PostgreSQL", "Redis", "MongoDB", "Git", "Linux", "AutoGen",
];

/* Row 2 — Best-in-class tech logos (image marquee, opposite direction).
   Slugs match Simple Icons CDN: https://cdn.simpleicons.org/<slug>
   Logos are served as monochrome SVGs and re-tinted via CSS filter so they
   look uniform in both dark and light mode. */
const TECH_LOGOS = [
  { slug: "python", name: "Python" },
  { slug: "javascript", name: "JavaScript" },
  { slug: "typescript", name: "TypeScript" },
  { slug: "react", name: "React" },
  { slug: "nextdotjs", name: "Next.js" },
  { slug: "nodedotjs", name: "Node.js" },
  { slug: "vuedotjs", name: "Vue" },
  { slug: "angular", name: "Angular" },
  { slug: "svelte", name: "Svelte" },
  { slug: "tailwindcss", name: "Tailwind" },
  { slug: "django", name: "Django" },
  { slug: "fastapi", name: "FastAPI" },
  { slug: "flask", name: "Flask" },
  { slug: "spring", name: "Spring" },
  { slug: "rust", name: "Rust" },
  { slug: "go", name: "Go" },
  { slug: "kotlin", name: "Kotlin" },
  { slug: "swift", name: "Swift" },
  { slug: "openjdk", name: "Java" },
  { slug: "cplusplus", name: "C++" },
  { slug: "postgresql", name: "PostgreSQL" },
  { slug: "mongodb", name: "MongoDB" },
  { slug: "mysql", name: "MySQL" },
  { slug: "redis", name: "Redis" },
  { slug: "neo4j", name: "Neo4j" },
  { slug: "elasticsearch", name: "Elasticsearch" },
  { slug: "docker", name: "Docker" },
  { slug: "kubernetes", name: "Kubernetes" },
  { slug: "amazonwebservices", name: "AWS" },
  { slug: "microsoftazure", name: "Azure" },
  { slug: "googlecloud", name: "Google Cloud" },
  { slug: "terraform", name: "Terraform" },
  { slug: "linux", name: "Linux" },
  { slug: "nginx", name: "Nginx" },
  { slug: "git", name: "Git" },
  { slug: "github", name: "GitHub" },
  { slug: "gitlab", name: "GitLab" },
  { slug: "pytorch", name: "PyTorch" },
  { slug: "tensorflow", name: "TensorFlow" },
  { slug: "openai", name: "OpenAI" },
  { slug: "huggingface", name: "Hugging Face" },
  { slug: "pandas", name: "Pandas" },
  { slug: "numpy", name: "NumPy" },
  { slug: "jupyter", name: "Jupyter" },
  { slug: "graphql", name: "GraphQL" },
  { slug: "apachekafka", name: "Kafka" },
];

const LogoCloud = () => {
  const { c } = useLang();
  const loop = [...TECH, ...TECH];
  const logoLoop = [...TECH_LOGOS, ...TECH_LOGOS];

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

        <div className="flex w-max animate-marquee items-center gap-16 sm:gap-20">
          {loop.map((logo, i) => (
            <span
              key={i}
              className="tech-item whitespace-nowrap text-xl font-semibold tracking-tight text-white/35"
            >
              {logo}
            </span>
          ))}
        </div>
      </div>

      {/* Row 2 — logo marquee with the best-in-class IT tech logos (opposite direction) */}
      <div className="relative mt-10 overflow-hidden">
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-32 bg-gradient-to-r from-[var(--bg)] to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-32 bg-gradient-to-l from-[var(--bg)] to-transparent" />

        <div className="flex w-max animate-marquee-reverse items-center gap-10 sm:gap-12">
          {logoLoop.map((logo, i) => (
            <div
              key={`${logo.slug}-${i}`}
              title={logo.name}
              className="tech-logo group/logo relative flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center"
            >
              <img
                src={`https://cdn.simpleicons.org/${logo.slug}`}
                alt={logo.name}
                loading="lazy"
                decoding="async"
                className="tech-logo-img h-full w-full object-contain transition-all duration-300"
              />
              {/* Hover tooltip */}
              <span className="tech-logo-tip pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border border-white/10 bg-[var(--bg-elevated)] px-2 py-1 text-[11px] font-medium text-white/80 opacity-0 backdrop-blur-md transition-opacity duration-200 group-hover/logo:opacity-100">
                {logo.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LogoCloud;
