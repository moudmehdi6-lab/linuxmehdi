import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
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
          borderRadius: 8,
        }}
      >
        <svg width="22" height="22" viewBox="0 0 48 48" fill="none">
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
        </svg>
      </div>
    ),
    { ...size },
  );
}
