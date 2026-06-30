import React, { useState, useEffect } from "react";
import { ChevronDown, Menu, X, Globe, Sun, Moon } from "lucide-react";
import { useLang } from "../i18n/LanguageContext";
import { useTheme } from "../theme/ThemeContext";

const WebionMark = ({ className = "" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 7l3.2 10L8.4 9 11.6 17 14.8 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M16.5 7l3.2 10L22.9 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.55" />
  </svg>
);

const Navbar = () => {
  const { c, lang, setLang, toggle } = useLang();
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [openDrop, setOpenDrop] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    document.body.classList.toggle("menu-open", mobileOpen);
    return () => {
      document.body.style.overflow = "";
      document.body.classList.remove("menu-open");
    };
  }, [mobileOpen]);

  const leftLinks = [
    { label: c.nav.home, href: "#home" },
    { label: c.nav.progetti, href: "#progetti" },
    { label: c.nav.cosaFaccio, href: "#competenze", dropdown: c.nav.dropCosa },
  ];
  const rightLinks = [
    { label: c.nav.suDiMe, href: "#esperienza", dropdown: c.nav.dropSu },
    { label: c.nav.contatta, href: "#contattaci" },
  ];
  const mobileLinks = [...leftLinks, ...rightLinks];

  // Robust in-page navigation for the MOBILE menu. Relying on a plain
  // <a href="#id"> here was unreliable: the full-screen overlay is
  // position:fixed with body overflow:hidden, so the browser's native
  // hash-jump happened while scrolling was still locked and the page
  // ended up at the wrong section (often the last one). We instead close
  // the menu first, then smooth-scroll to the target once the overlay is
  // gone and scrolling is unlocked.
  const goTo = (href) => (e) => {
    if (!href || !href.startsWith("#")) return;
    e.preventDefault();
    const id = href.slice(1);
    setMobileOpen(false);
    setExpanded(null);
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      else window.location.hash = href;
    }, 300);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-3">
        <nav
          className={`w-full max-w-5xl rounded-2xl border transition-all duration-500 ${
            scrolled
              ? "bg-[#0c0c0f]/90 border-white/10 backdrop-blur-xl shadow-[0_8px_40px_rgba(0,0,0,0.5)]"
              : "bg-[#0c0c0f]/50 border-white/10 backdrop-blur-md"
          }`}
        >
          <div className="flex items-center justify-between px-5 h-12">
            {/* Left links */}
            <div className="hidden lg:flex items-center gap-1 flex-1">
              {leftLinks.map((link) => (
                <NavItem key={link.label} link={link} openDrop={openDrop} setOpenDrop={setOpenDrop} />
              ))}
            </div>

            {/* Center logo */}
            <a href="#home" className="flex items-center gap-2 shrink-0">
              <WebionMark className="w-5 h-5 text-white hidden sm:block" />
              <span className="text-white font-bold text-lg tracking-tight whitespace-nowrap">Giacomo Reggianini</span>
            </a>

            {/* Right links */}
            <div className="hidden lg:flex items-center justify-end gap-1 flex-1">
              {rightLinks.map((link) => (
                <NavItem key={link.label} link={link} openDrop={openDrop} setOpenDrop={setOpenDrop} align="right" />
              ))}
              <button
                onClick={toggle}
                className="ml-1 inline-flex items-center gap-1.5 rounded-full border border-white/15 px-2.5 py-1 text-[12px] font-medium text-white/70 hover:text-white hover:border-white/30 transition-colors"
                aria-label="Cambia lingua"
              >
                <Globe size={13} />
                {lang.toUpperCase()}
              </button>
              <button
                onClick={toggleTheme}
                className="ml-1 inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/15 text-white/70 hover:text-white hover:border-white/30 transition-colors"
                aria-label="Cambia tema chiaro/scuro"
                title="Cambia tema"
              >
                {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
              </button>
            </div>

            {/* Mobile toggle */}
            <button
              className="lg:hidden text-white/85 hover:text-white"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Menu"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>
      </header>

      {/* Full-screen mobile menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-[#060608]/96 mobile-menu-bg" />
          <div className="mobile-menu-panel relative flex h-full flex-col overflow-y-auto px-8 pt-24 pb-10">
            <nav className="flex flex-col">
              {mobileLinks.map((link) => (
                <div key={link.label} className="border-b border-white/10">
                  {link.dropdown ? (
                    <>
                      <button
                        onClick={() => setExpanded(expanded === link.label ? null : link.label)}
                        className="flex w-full items-center justify-between py-5 text-left text-2xl font-medium text-white"
                      >
                        {link.label}
                        <ChevronDown
                          size={22}
                          className={`text-white/50 transition-transform ${expanded === link.label ? "rotate-180" : ""}`}
                        />
                      </button>
                      {expanded === link.label && (
                        <div className="flex flex-col pb-5 pl-1">
                          {link.dropdown.map((d) => (
                            <a
                              key={d.label}
                              href={d.href}
                              onClick={goTo(d.href)}
                              className="py-2 text-lg text-white/55 hover:text-white"
                            >
                              {d.label}
                            </a>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <a
                      href={link.href}
                      onClick={goTo(link.href)}
                      className="block py-5 text-2xl font-medium text-white"
                    >
                      {link.label}
                    </a>
                  )}
                </div>
              ))}
            </nav>

            <div className="mt-auto pt-10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="inline-flex items-center gap-1 rounded-full border border-white/10 p-1">
                  <Globe size={15} className="ml-1.5 text-white/45" />
                  {["it", "en"].map((lng) => (
                    <button
                      key={lng}
                      onClick={() => setLang(lng)}
                      className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                        lang === lng ? "bg-white text-black" : "text-white/60 hover:text-white"
                      }`}
                    >
                      {lng.toUpperCase()}
                    </button>
                  ))}
                </div>
                <button
                  onClick={toggleTheme}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/70"
                  aria-label="Cambia tema chiaro/scuro"
                >
                  {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
                </button>
              </div>
              <a
                href="#contattaci"
                onClick={goTo("#contattaci")}
                className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-black"
              >
                {c.nav.contatta}
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const NavItem = ({ link, openDrop, setOpenDrop, align = "left" }) => {
  const hasDrop = !!link.dropdown;
  const open = openDrop === link.label;

  return (
    <div
      className="relative"
      onMouseEnter={() => hasDrop && setOpenDrop(link.label)}
      onMouseLeave={() => hasDrop && setOpenDrop(null)}
    >
      <a
        href={link.href}
        className="inline-flex items-center gap-1 whitespace-nowrap px-3 py-1.5 rounded-lg text-[13.5px] text-white/70 hover:text-white hover:bg-white/5 transition-colors"
      >
        {link.label}
        {hasDrop && <ChevronDown size={14} className={`transition-transform ${open ? "rotate-180" : ""}`} />}
      </a>

      {hasDrop && open && (
        <div
          className={`absolute top-full mt-2 ${align === "right" ? "right-0" : "left-0"} w-64 rounded-xl border border-white/10 bg-[#101014]/95 backdrop-blur-xl p-2 shadow-2xl`}
        >
          {link.dropdown.map((d) => (
            <a
              key={d.label}
              href={d.href}
              className="block rounded-lg px-3 py-2.5 hover:bg-white/5 transition-colors"
            >
              <div className="text-white text-sm font-medium">{d.label}</div>
              <div className="text-white/45 text-xs mt-0.5">{d.desc}</div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default Navbar;
export { WebionMark };
