import { useId } from "react";
import { cn } from "@/lib/utils";

type LogoProps = {
  variant?: "mark" | "horizontal" | "mono";
  className?: string;
};

/**
 * Original IPTVLinux brand mark: three concentric signal arcs radiating from a
 * play triangle, framed in a rounded square — gold-to-electric-blue gradient.
 */
function Mark({ id, mono }: { id: string; mono?: boolean }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="block h-full w-full"
    >
      <defs>
        <linearGradient id={`grad-${id}`} x1="0" y1="0" x2="48" y2="48">
          <stop offset="0%" stopColor={mono ? "currentColor" : "#D4AF37"} />
          <stop offset="100%" stopColor={mono ? "currentColor" : "#2563EB"} />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="14" fill={mono ? "transparent" : "#0B0B0B"} />
      <rect
        width="47"
        height="47"
        x="0.5"
        y="0.5"
        rx="13.5"
        stroke={mono ? "currentColor" : "url(#grad-" + id + ")"}
        strokeOpacity={mono ? 1 : 0.35}
      />
      <path
        d="M20 15.5L31 24L20 32.5V15.5Z"
        fill={`url(#grad-${id})`}
      />
      <path
        d="M14 18.5C11.5 20.5 11.5 27.5 14 29.5"
        stroke={`url(#grad-${id})`}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M10.5 15C6.5 18.5 6.5 29.5 10.5 33"
        stroke={`url(#grad-${id})`}
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.6"
      />
    </svg>
  );
}

export function Logo({ variant = "horizontal", className }: LogoProps) {
  const id = useId().replace(/:/g, "");

  if (variant === "mark" || variant === "mono") {
    return (
      <div className={cn("h-9 w-9", className)}>
        <Mark id={id} mono={variant === "mono"} />
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div className="h-9 w-9 shrink-0">
        <Mark id={id} />
      </div>
      <span className="font-display text-lg font-semibold tracking-tight">
        IPTV<span className="text-gradient-gold">Linux</span>
      </span>
    </div>
  );
}
