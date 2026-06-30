import React, { useMemo } from "react";
import { ArrowRight, MapPin, PenLine } from "lucide-react";
import { WebionMark } from "./Navbar";
import { useLang } from "../i18n/LanguageContext";
import { useTheme } from "../theme/ThemeContext";

const Hero = () => {
  const { c } = useLang();
  const { theme } = useTheme();
  const isLight = theme === "light";

  const stars = useMemo(() => {
    const darkTints = [
      "255,255,255", "255,255,255", "255,255,255", // white (majority)
      "180,205,255", // soft blue
      "170,225,255", // cyan
      "205,190,255", // violet
    ];
    // In daylight the stars become faint warm-brown dots scattered across the dawn sky
    const lightTints = ["91,57,38", "120,80,52", "140,100,72", "165,120,88"];
    const tints = isLight ? lightTints : darkTints;
    // On phones/tablets we render far fewer stars — 90 individually
    // animated DOM nodes are a big mobile-GPU tax for very little visual
    // gain on a small screen.
    const isMobile =
      typeof window !== "undefined" &&
      (window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 1024);
    const count = isMobile ? 35 : 90;
    const arr = [];
    for (let i = 0; i < count; i++) {
      const size = Math.random() * 2 + 0.4;
      arr.push({
        left: Math.random() * 100,
        top: Math.random() * 80,
        size,
        delay: Math.random() * 6,
        duration: 2.2 + Math.random() * 4.5,
        tint: tints[Math.floor(Math.random() * tints.length)],
        glint: isLight ? false : size > 1.7,
      });
    }
    return arr;
  }, [isLight]);

  const atmosphere = isLight
    ? "radial-gradient(120% 80% at 50% 118%, rgba(244,140,75,0.62) 0%, rgba(255,170,105,0.36) 22%, rgba(255,215,170,0.16) 42%, rgba(255,255,255,0) 68%)"
    : "radial-gradient(120% 80% at 50% 118%, rgba(120,170,255,0.55) 0%, rgba(60,110,210,0.32) 22%, rgba(20,40,90,0.18) 42%, rgba(6,6,8,0) 68%)";
  const nebulaA = isLight
    ? "radial-gradient(circle, rgba(255,160,110,0.18), transparent 70%)"
    : "radial-gradient(circle, rgba(120,90,230,0.18), transparent 70%)";
  const nebulaB = isLight
    ? "radial-gradient(circle, rgba(232,120,140,0.14), transparent 70%)"
    : "radial-gradient(circle, rgba(60,150,230,0.16), transparent 70%)";

  // Light: warm "dawn over Mediterranean" sky — pale taupe top fading into peach
  // and apricot at the horizon, so the atmosphere glow blends seamlessly into the
  // warm-beige ground (no more cool/blue → warm/yellow clash).
  const skyBg = isLight
    ? "linear-gradient(180deg, #ecdfd5 0%, #f1d6c0 32%, #f5c597 66%, #f0bd80 100%)"
    : "transparent";

  // Light: warm beige "ground" below the curve, with a subtle dotted pattern.
  // Matches the page (.App) base so the hero terrain flows seamlessly into the rest.
  const planetStyle = isLight
    ? {
        backgroundColor: "#f1e1b8",
        backgroundImage: "radial-gradient(circle, rgba(176,136,80,0.11) 1px, transparent 1.7px)",
        backgroundSize: "20px 20px",
      }
    : { backgroundColor: "#060608" };

  return (
    <section id="home" className="relative min-h-screen w-full overflow-hidden bg-[#060608]">
      {/* Sky: subtle vertical color fade so it isn't flat white (light) / dark space (dark) */}
      <div className="pointer-events-none absolute inset-0" style={{ background: skyBg }} />

      {/* Atmosphere — desktop keeps the original strong gradient; on mobile we
          fade it in along with the sphere so the text reads first, then the
          horizon "rises". Wrapped so we can stage it. */}
      <div
        className="hero-sphere-stage pointer-events-none absolute inset-x-0 bottom-0 h-[85vh]"
        style={{ background: atmosphere }}
      />

      {/* Drifting nebula glows for ambient colored motion */}
      <div
        className="hero-sphere-stage nebula-pulse pointer-events-none absolute left-[14%] top-[16%] h-72 w-72 rounded-full blur-[90px]"
        style={{ background: nebulaA }}
      />
      <div
        className="hero-sphere-stage nebula-pulse pointer-events-none absolute right-[10%] top-[28%] h-80 w-80 rounded-full blur-[100px]"
        style={{ background: nebulaB, animationDelay: "4s" }}
      />

      {/* Twinkling, color-tinted starfield with a slow parallax drift */}
      <div className="hero-sphere-stage stars-drift absolute inset-0">
        {stars.map((s, i) => (
          <span
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${s.left}%`,
              top: `${s.top}%`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              backgroundColor: `rgb(${s.tint})`,
              color: `rgb(${s.tint})`,
              animation: `${s.glint ? "twinkleGlow" : "twinkle"} ${s.duration}s ease-in-out ${s.delay}s infinite`,
            }}
          />
        ))}
      </div>

      {/* Planet horizon — staged so it rises after the text on mobile.
          IMPORTANT: centered horizontally with margin-left (NOT transform),
          so the heroSphereRise entrance animation (which animates transform)
          can never knock it off-centre. */}
      <div
        className="hero-sphere-stage planet-rim pointer-events-none absolute rounded-[50%]"
        style={{
          width: "260vw",
          height: "260vw",
          top: "70vh",
          left: "50%",
          marginLeft: "-130vw",
          ...planetStyle,
        }}
      />

      {/* Soft, BLURRED inner halo above the sphere — gives a clean fading
          dome backdrop that matches the Webion reference. Animated in
          softly so the text appears against an empty sky first. */}
      <div
        className="hero-sphere-stage hero-halo pointer-events-none absolute inset-0 z-[5]"
        style={{
          background: isLight
            ? "radial-gradient(55% 42% at 50% 60%, rgba(255,210,170,0.55) 0%, rgba(255,210,170,0.22) 32%, rgba(255,210,170,0.08) 55%, rgba(255,210,170,0) 80%)"
            : "radial-gradient(55% 42% at 50% 58%, rgba(95,150,235,0.40) 0%, rgba(70,120,210,0.20) 32%, rgba(40,70,150,0.08) 55%, rgba(20,40,90,0) 80%)",
          filter: "blur(18px)",
        }}
      />

      {/* ===================== MOBILE HERO (minimal — Webion-style) =====================
          Three vertical zones via flex:
          - top: badge + headline (centered, animates in first)
          - middle/lower: empty space (sphere visually crosses here)
          - bottom: CTA (sits below the sphere line)                                       */}
      <div className="relative z-10 flex min-h-[100svh] flex-col items-center px-6 text-center md:hidden">
        {/* Top spacer to vertically position text near the visual center-top */}
        <div className="flex-[0.9]" />

        <div className="hero-mobile-badge inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 backdrop-blur-sm">
          <WebionMark className="w-3.5 h-3.5 text-white" />
          <span className="text-[13px] font-medium text-white/90">Giacomo</span>
        </div>

        <h1 className="mx-auto mt-7 w-full max-w-[20rem] text-white text-center">
          <span className="hero-mobile-line1 block text-[40px] font-bold tracking-tight leading-[1.05]">
            {c.hero.mobileBold}
          </span>
          <span className="hero-mobile-line2 font-serif-italic block text-[30px] leading-[1.2] mt-2 text-white">
            {c.hero.mobileItalic}
          </span>
        </h1>

        {/* Bottom spacer pushes CTA below the sphere horizon */}
        <div className="flex-[1.1]" />

        <a
          href="#contattaci"
          className="hero-mobile-cta mb-14 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-5 py-2 text-[13.5px] font-medium text-white backdrop-blur-md transition-colors hover:bg-white/15"
        >
          <PenLine size={14} className="opacity-90" />
          {c.hero.mobileCta}
        </a>
      </div>

      {/* ===================== DESKTOP HERO (full) ===================== */}
      <div className="relative z-10 hidden md:flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <div className="fade-up inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 backdrop-blur-sm">
          <WebionMark className="w-3.5 h-3.5 text-white" />
          <span className="text-[13px] font-medium text-white/90">{c.hero.badge}</span>
        </div>

        <h1 className="fade-up mt-7 max-w-4xl text-white" style={{ animationDelay: "0.1s" }}>
          <span className="block text-5xl sm:text-6xl md:text-7xl font-semibold tracking-tight leading-[1.05]">
            {c.hero.line1}
          </span>
          <span className="font-serif-italic block text-5xl sm:text-6xl md:text-7xl leading-[1.15] mt-2 text-white">
            {c.hero.line2}
          </span>
        </h1>

        <p className="fade-up mt-6 max-w-xl text-base sm:text-lg leading-relaxed text-white/55" style={{ animationDelay: "0.2s" }}>
          {c.hero.intro}
        </p>

        <div className="fade-up mt-9 flex flex-wrap items-center justify-center gap-3" style={{ animationDelay: "0.3s" }}>
          <a
            href="#progetti"
            className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black transition-all hover:scale-[1.03]"
          >
            {c.hero.cta1} <ArrowRight size={15} />
          </a>
          <a
            href="#contattaci"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm text-white backdrop-blur-sm transition-colors hover:bg-white/10"
          >
            {c.hero.cta2}
          </a>
        </div>

        <div className="fade-up mt-7 inline-flex items-center gap-1.5 text-sm text-white/40" style={{ animationDelay: "0.4s" }}>
          <MapPin size={14} /> {c.hero.location}
        </div>
      </div>
    </section>
  );
};

export default Hero;
