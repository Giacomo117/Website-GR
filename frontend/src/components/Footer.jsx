import React from "react";
import { Linkedin, Instagram, Github, ArrowUp, Globe } from "lucide-react";
import { useLang } from "../i18n/LanguageContext";
import { person } from "../i18n/content";
import { WebionMark } from "./Navbar";

const Footer = () => {
  const { c, lang, setLang } = useLang();
  const f = c.footer;
  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const socials = [
    { Icon: Linkedin, href: person.socials.linkedin },
    { Icon: Instagram, href: person.socials.instagram },
    { Icon: Github, href: person.socials.github },
  ];

  return (
    <footer className="relative border-t border-white/10 bg-[#08080b] pt-20 pb-8">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Brand */}
          <div className="lg:col-span-3">
            <div className="flex items-center gap-2">
              <WebionMark className="w-6 h-6 text-white" />
              <span className="text-xl font-bold tracking-tight text-white">Giacomo Reggianini</span>
            </div>

            <div className="mt-8">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/35">{f.follow}</p>
              <div className="mt-4 flex items-center gap-3">
                {socials.map(({ Icon, href }, i) => (
                  <a
                    key={i}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/55 transition-colors hover:border-white/30 hover:text-white"
                  >
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:col-span-7 lg:grid-cols-5">
            {f.columns.map((col) => (
              <div key={col.title} className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wider text-white/35">{col.title}</p>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <a href={l.href} className="text-sm text-white/65 transition-colors hover:text-white">
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Contatti + language */}
          <div className="lg:col-span-2">
            <p className="text-xs font-medium uppercase tracking-wider text-white/35">{f.contactsLabel}</p>
            <a
              href={`mailto:${person.email}`}
              className="mt-4 block break-words text-sm text-white/65 transition-colors hover:text-white"
            >
              {person.email}
            </a>
            <div className="mt-6 inline-flex items-center gap-1 rounded-full border border-white/10 p-1">
              <Globe size={14} className="ml-1.5 text-white/45" />
              {["it", "en"].map((lng) => (
                <button
                  key={lng}
                  onClick={() => setLang(lng)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                    lang === lng ? "bg-white text-black" : "text-white/60 hover:text-white"
                  }`}
                >
                  {lng.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-7 sm:flex-row">
          <p className="text-center text-xs text-white/40 sm:text-left">{f.legal}</p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {f.bottom.map((b) => (
              <a key={b.label} href={b.href} className="text-xs text-white/50 transition-colors hover:text-white">
                {b.label}
              </a>
            ))}
            <button
              onClick={scrollTop}
              className="inline-flex items-center gap-1.5 text-xs text-white/50 transition-colors hover:text-white"
            >
              <ArrowUp size={14} /> {f.back}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
