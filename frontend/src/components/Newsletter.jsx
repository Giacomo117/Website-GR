import React, { useState } from "react";
import { toast } from "sonner";
import { useLang } from "../i18n/LanguageContext";

const Newsletter = () => {
  const { c } = useLang();
  const n = c.newsletter;
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error(n.errEmail);
      return;
    }
    if (!consent) {
      toast.error(n.errConsent);
      return;
    }
    toast.success(n.okMsg);
    setEmail("");
    setConsent(false);
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
      <div className="relative mx-auto max-w-2xl px-6 text-center">
        <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight text-white">{n.title}</h2>
        <p className="mt-4 text-lg text-white/50">{n.subtitle}</p>

        <form onSubmit={submit} className="mt-10 flex flex-col items-center">
          <div className="flex w-full max-w-md items-center gap-2 rounded-full border border-white/10 bg-white/5 p-1.5 pl-5 backdrop-blur-sm focus-within:border-white/25 transition-colors">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={n.placeholder}
              className="flex-1 bg-transparent text-[15px] text-white placeholder:text-white/40 outline-none"
            />
            <button
              type="submit"
              className="rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black transition-colors hover:bg-white/90"
            >
              {n.button}
            </button>
          </div>

          <label className="mt-4 flex cursor-pointer items-center gap-2 text-sm text-white/45">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="h-4 w-4 accent-[#6f9bff]"
            />
            {n.consent}
          </label>
        </form>
      </div>
    </section>
  );
};

export default Newsletter;
