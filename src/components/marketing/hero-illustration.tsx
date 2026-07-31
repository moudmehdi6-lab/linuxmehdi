/**
 * Original decorative graphic: concentric signal rings orbiting a play
 * mark, echoing the brand logo at hero scale. Purely ornamental (aria-hidden),
 * sits behind the hero copy to add depth without competing with the text.
 */
export function HeroIllustration() {
  return (
    <div
      className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[52rem] w-[52rem] -translate-x-1/2 -translate-y-1/2 opacity-[0.35] sm:opacity-40"
      aria-hidden
    >
      <svg viewBox="0 0 800 800" className="h-full w-full">
        <defs>
          <linearGradient id="hero-ring-1" x1="0" y1="0" x2="800" y2="800">
            <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="hero-ring-2" x1="800" y1="0" x2="0" y2="800">
            <stop offset="0%" stopColor="#2563EB" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="hero-core" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#2563EB" stopOpacity="0.4" />
          </radialGradient>
        </defs>

        <circle
          cx="400"
          cy="400"
          r="360"
          fill="none"
          stroke="url(#hero-ring-1)"
          strokeWidth="1"
          strokeDasharray="4 10"
          className="origin-center animate-spin-slow"
        />
        <circle
          cx="400"
          cy="400"
          r="280"
          fill="none"
          stroke="url(#hero-ring-2)"
          strokeWidth="1"
          className="origin-center animate-spin-slow"
          style={{ animationDirection: "reverse", animationDuration: "26s" }}
        />
        <circle cx="400" cy="400" r="200" fill="none" stroke="white" strokeOpacity="0.05" strokeWidth="1" />

        <g className="origin-center animate-spin-slow" style={{ animationDuration: "20s" }}>
          <circle cx="760" cy="400" r="5" fill="#D4AF37" />
          <circle cx="40" cy="400" r="4" fill="#2563EB" />
        </g>
        <g
          className="origin-center animate-spin-slow"
          style={{ animationDirection: "reverse", animationDuration: "16s" }}
        >
          <circle cx="400" cy="120" r="4" fill="#2563EB" />
          <circle cx="400" cy="680" r="5" fill="#D4AF37" />
        </g>

        <circle cx="400" cy="400" r="86" fill="url(#hero-core)" opacity="0.25" />
        <path d="M378 356L440 400L378 444V356Z" fill="#D4AF37" opacity="0.7" />
      </svg>
    </div>
  );
}
