import React from "react";
import { Linkedin, Mail, ArrowUpRight, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { useLang } from "../i18n/LanguageContext";
import { person } from "../i18n/content";

const Contact = () => {
  const { c } = useLang();
  const ct = c.contact;
  const [copied, setCopied] = React.useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(person.email);
      setCopied(true);
      toast.success(ct.copiedOk);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error(ct.copiedErr);
    }
  };

  return (
    <section id="contattaci" className="relative overflow-hidden bg-[#060608] py-28 sm:py-36">
      <div
        className="glow-breathe pointer-events-none absolute inset-x-0 top-0 h-[60vh]"
        style={{
          background:
            "radial-gradient(70% 60% at 50% -10%, rgb(var(--acc-1) / 0.22) 0%, rgb(var(--acc-3) / 0.12) 35%, rgba(0,0,0,0) 70%)",
        }}
      />
      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <p className="text-xs font-medium uppercase tracking-[0.25em] text-white/45">{ct.kicker}</p>
        <h2 className="mt-3 text-4xl sm:text-5xl font-semibold tracking-tight text-white">
          {ct.titleA} <span className="font-serif-italic">{ct.titleEm}</span>
        </h2>
        <p className="mt-5 text-lg text-white/55 max-w-xl mx-auto">{ct.subtitle}</p>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {/* LinkedIn card */}
          <a
            href={person.socials.linkedin}
            target="_blank"
            rel="noreferrer"
            className="group relative flex flex-col items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-6 text-left backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-white/25 hover:bg-white/[0.06]"
          >
            <div className="flex w-full items-start justify-between">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/85 transition-colors group-hover:border-white/30 group-hover:text-white">
                <Linkedin size={20} />
              </span>
              <ArrowUpRight
                size={18}
                className="text-white/40 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white/80"
              />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-white/40">{ct.linkedinLabel}</p>
              <p className="mt-1 text-base font-medium text-white">{ct.linkedinTitle}</p>
              <p className="mt-1 text-sm text-white/55">{ct.linkedinDesc}</p>
            </div>
          </a>

          {/* Email card */}
          <a
            href={`mailto:${person.email}`}
            className="group relative flex flex-col items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-6 text-left backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-white/25 hover:bg-white/[0.06]"
          >
            <div className="flex w-full items-start justify-between">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/85 transition-colors group-hover:border-white/30 group-hover:text-white">
                <Mail size={20} />
              </span>
              <ArrowUpRight
                size={18}
                className="text-white/40 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white/80"
              />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-white/40">{ct.emailLabel}</p>
              <p className="mt-1 text-base font-medium text-white break-all">{person.email}</p>
              <p className="mt-1 text-sm text-white/55">{ct.emailDesc}</p>
            </div>
          </a>
        </div>

        {/* Copy email helper */}
        <div className="mt-8 flex items-center justify-center">
          <button
            type="button"
            onClick={copyEmail}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 backdrop-blur-sm transition-colors hover:border-white/25 hover:text-white"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? ct.copied : ct.copyBtn}
          </button>
        </div>
      </div>
    </section>
  );
};

export default Contact;
