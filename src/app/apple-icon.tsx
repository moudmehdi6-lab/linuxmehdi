import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0B0B0B",
        }}
      >
        <svg width="130" height="130" viewBox="0 0 48 48" fill="none">
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
      </div>
    ),
    { ...size },
  );
}
