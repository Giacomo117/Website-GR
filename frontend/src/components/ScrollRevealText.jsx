import React, { useEffect, useRef, useState } from "react";
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

// Each word reveals from a dim base color to bright as the section scrolls through.
const ScrollRevealText = ({ text, accent = "neutral" }) => {
  const ref = useRef(null);
  const [progress, setProgress] = useState(0);
  const words = text.split(" ");

  useEffect(() => {
    let raf = null;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = null;
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const vh = window.innerHeight;
        // start revealing when top reaches 80% of viewport, finish when bottom passes 35%
        const start = vh * 0.8;
        const end = vh * 0.3;
        const total = start - end;
        const p = (start - rect.top) / (total + rect.height * 0.6);
        setProgress(Math.min(1, Math.max(0, p)));
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const { theme } = useTheme();
  const isLight = theme === "light";
  const sets = isLight ? LIGHT_PALETTES : PALETTES;
  const palette = sets[accent] || sets.neutral;
  const total = Math.max(1, words.length - 1);
  // dim base + the "pop" target differ per theme so the reveal stays legible
  const base = isLight ? [196, 200, 208] : [78, 84, 104];
  const popTarget = isLight ? [25, 28, 38] : [255, 255, 255];
  const popCoeff = isLight ? 0.5 : 0.55;

  return (
    <div ref={ref} className="mx-auto max-w-5xl px-6 py-[14vh]">
      <p className="reveal-serif text-3xl sm:text-4xl md:text-5xl font-normal leading-[1.4] flex flex-wrap">
        {words.map((word, i) => {
          const wordProgress = progress * words.length;
          // local reveal value for this word (0..1)
          const local = Math.min(1, Math.max(0, wordProgress - i));

          // Each word's target hue is sampled along the aurora gradient,
          // so a revealed line carries a full blue -> cyan -> violet sweep.
          const [tr, tg, tb] = sampleGradient(palette, i / total);

          // dim base -> full color as the word reveals
          let r = base[0] + (tr - base[0]) * local;
          let g = base[1] + (tg - base[1]) * local;
          let b = base[2] + (tb - base[2]) * local;

          // leading edge gets a "hot" pop for a sparkling pass
          const edge = Math.max(0, 1 - Math.abs(wordProgress - i - 0.5) * 1.5);
          const pop = edge * popCoeff;
          r += (popTarget[0] - r) * pop;
          g += (popTarget[1] - g) * pop;
          b += (popTarget[2] - b) * pop;

          // colored glow that grows with the reveal (luminous trail)
          const glow = Math.max(0, local - 0.15) * 0.7;
          const textShadow =
            glow > 0.03
              ? `0 0 ${6 + glow * 22}px rgba(${Math.round(tr)}, ${Math.round(tg)}, ${Math.round(tb)}, ${glow})`
              : "none";

          return (
            <span
              key={i}
              className="mr-[0.28em]"
              style={{
                color: `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`,
                textShadow,
                transition: "color 0.15s linear, text-shadow 0.15s linear",
              }}
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
