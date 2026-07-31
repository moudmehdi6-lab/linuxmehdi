import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0B0B0B",
          backgroundImage:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(212,175,55,0.25), transparent), radial-gradient(ellipse 80% 60% at 100% 100%, rgba(37,99,235,0.25), transparent)",
        }}
      >
        <svg width="96" height="96" viewBox="0 0 48 48" fill="none">
          <defs>
            <linearGradient id="g" x1="0" y1="0" x2="48" y2="48">
              <stop offset="0%" stopColor="#D4AF37" />
              <stop offset="100%" stopColor="#2563EB" />
            </linearGradient>
          </defs>
          <path d="M20 15.5L31 24L20 32.5V15.5Z" fill="url(#g)" />
          <path
            d="M14 18.5C11.5 20.5 11.5 27.5 14 29.5"
            stroke="url(#g)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M10.5 15C6.5 18.5 6.5 29.5 10.5 33"
            stroke="url(#g)"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.6"
          />
        </svg>
        <div
          style={{
            marginTop: 28,
            fontSize: 64,
            fontWeight: 700,
            color: "white",
            letterSpacing: -1.5,
            display: "flex",
          }}
        >
          IPTV<span style={{ color: "#D4AF37" }}>Linux</span>
        </div>
        <div style={{ marginTop: 12, fontSize: 26, color: "rgba(255,255,255,0.6)" }}>
          Premium streaming, engineered for reliability.
        </div>
      </div>
    ),
    { ...size },
  );
}
