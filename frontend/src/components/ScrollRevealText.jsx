import React, { useEffect, useMemo, useRef } from "react";
import { useTheme } from "../theme/ThemeContext";

// Professional "aurora" palettes — multi-stop gradients per accent (DARK / night).
const PALETTES = {
  blue: [
    [111, 155, 255],
    [94, 210, 255],
    [129, 170, 255],
  ],
  violet: [
    [129, 140, 248],
    [167, 139, 250],
    [192, 132, 252],
  ],
  // full cosmic sweep: blue -> cyan -> violet
  neutral: [
    [111, 155, 255],
    [94, 210, 255],
    [167, 139, 250],
  ],
};

// Warm "sunrise" palettes used in light mode (the opposite of the cool night).
const LIGHT_PALETTES = {
  blue: [
    [234, 88, 12],
    [245, 158, 11],
    [234, 120, 30],
  ],
  violet: [
    [244, 63, 94],
    [217, 70, 160],
    [244, 90, 110],
  ],
  neutral: [
    [234, 88, 12],
    [245, 158, 11],
    [244, 63, 94],
  ],
};

// Sample a multi-stop color gradient at position t (0..1).
const sampleGradient = (stops, t) => {
  const n = stops.length - 1;
  const x = Math.min(0.9999, Math.max(0, t)) * n;
  const i = Math.floor(x);
  const f = x - i;
  const a = stops[i];
  const b = stops[Math.min(n, i + 1)];
  return [
    a[0] + (b[0] - a[0]) * f,
    a[1] + (b[1] - a[1]) * f,
    a[2] + (b[2] - a[2]) * f,
  ];
};

/**
 * Each word reveals from a dim base color to bright as the section scrolls
 * through. Optimized to update DOM directly via refs (no React re-render per
 * frame) and to skip work entirely while the section is offscreen using an
 * IntersectionObserver.
 */
const ScrollRevealText = ({ text, accent = "neutral" }) => {
  const containerRef = useRef(null);
  const wordRefs = useRef([]);
  const visibleRef = useRef(false);
  const rafRef = useRef(null);
  const words = useMemo(() => text.split(" "), [text]);

  const { theme } = useTheme();
  const isLight = theme === "light";

  // On phones/touch devices the per-frame scroll-driven gradient + text-shadow
  // writes across dozens of words (x3 sections) cause heavy repaint jank and
  // make fast scrolling feel slow / not "load in time". There we switch to a
  // cheap ONE-SHOT reveal: a single IntersectionObserver flips the words from
  // dim to their bright target colour via a staggered CSS transition — no
  // scroll listener, no requestAnimationFrame, no text-shadow blur.
  const isMobile = useMemo(
    () =>
      typeof window !== "undefined" &&
      (window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 1024),
    []
  );
  const [revealed, setRevealed] = React.useState(false);

  // Recompute per-word target color when palette/theme changes.
  const targets = useMemo(() => {
    const sets = isLight ? LIGHT_PALETTES : PALETTES;
    const palette = sets[accent] || sets.neutral;
    const total = Math.max(1, words.length - 1);
    return words.map((_, i) => sampleGradient(palette, i / total));
  }, [words, accent, isLight]);

  // ---- MOBILE: cheap one-shot reveal ----
  useEffect(() => {
    if (!isMobile) return undefined;
    const el = containerRef.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setRevealed(true);
            io.disconnect();
            break;
          }
        }
      },
      // fire well before the section enters the viewport so it's already
      // revealed when the user arrives, even on a fast flick-scroll.
      { rootMargin: "0px 0px 400px 0px", threshold: 0.01 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [isMobile]);

  // ---- DESKTOP: rich scroll-driven gradient reveal ----
  useEffect(() => {
    if (isMobile) return undefined;
    const base = isLight ? [196, 200, 208] : [78, 84, 104];
    const popTarget = isLight ? [25, 28, 38] : [255, 255, 255];
    const popCoeff = isLight ? 0.5 : 0.55;

    const apply = () => {
      rafRef.current = null;
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = vh * 0.8;
      const end = vh * 0.3;
      const total = start - end;
      const progress = Math.min(
        1,
        Math.max(0, (start - rect.top) / (total + rect.height * 0.6))
      );
      const wp = progress * words.length;

      for (let i = 0; i < wordRefs.current.length; i++) {
        const node = wordRefs.current[i];
        if (!node) continue;
        const local = Math.min(1, Math.max(0, wp - i));
        const [tr, tg, tb] = targets[i];

        let r = base[0] + (tr - base[0]) * local;
        let g = base[1] + (tg - base[1]) * local;
        let b = base[2] + (tb - base[2]) * local;

        const edge = Math.max(0, 1 - Math.abs(wp - i - 0.5) * 1.5);
        const pop = edge * popCoeff;
        r += (popTarget[0] - r) * pop;
        g += (popTarget[1] - g) * pop;
        b += (popTarget[2] - b) * pop;

        const glow = Math.max(0, local - 0.15) * 0.7;
        node.style.color = `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
        node.style.textShadow =
          glow > 0.03
            ? `0 0 ${6 + glow * 22}px rgba(${Math.round(tr)}, ${Math.round(tg)}, ${Math.round(tb)}, ${glow})`
            : "none";
      }
    };

    const schedule = () => {
      if (rafRef.current != null) return;
      rafRef.current = requestAnimationFrame(apply);
    };

    const onScroll = () => {
      if (!visibleRef.current) return;
      schedule();
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          visibleRef.current = entry.isIntersecting;
          if (entry.isIntersecting) schedule();
        }
      },
      { rootMargin: "200px 0px 200px 0px", threshold: 0 }
    );
    if (containerRef.current) io.observe(containerRef.current);

    schedule();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", schedule);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", schedule);
      io.disconnect();
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, [isMobile, words.length, targets, isLight]);

  const baseColor = isLight ? "rgb(150, 154, 164)" : "rgb(96, 102, 124)";

  return (
    <div ref={containerRef} className="mx-auto max-w-5xl px-6 py-[14vh]">
      <p className="reveal-serif text-3xl sm:text-4xl md:text-5xl font-normal leading-[1.4] flex flex-wrap">
        {words.map((word, i) => {
          // On mobile: cheap staggered color transition, no text-shadow.
          const mobileStyle = isMobile
            ? {
                color: revealed
                  ? `rgb(${targets[i].map((v) => Math.round(v)).join(", ")})`
                  : baseColor,
                transition: "color 0.5s ease-out",
                transitionDelay: `${Math.min(i * 28, 700)}ms`,
              }
            : {
                color: isLight ? "rgb(196, 200, 208)" : "rgb(78, 84, 104)",
                transition: "color 0.15s linear, text-shadow 0.15s linear",
              };
          return (
            <span
              key={i}
              ref={(el) => (wordRefs.current[i] = el)}
              className="mr-[0.28em]"
              style={mobileStyle}
            >
              {word}
            </span>
          );
        })}
      </p>
    </div>
  );
};

export default ScrollRevealText;
