"use client";

import * as React from "react";
import { useInView, useMotionValue, useSpring } from "framer-motion";

/**
 * Animates a numeric value counting up once it scrolls into view.
 * `value` is the target number; `prefix`/`suffix` wrap the formatted output
 * (e.g. suffix="+", suffix="%") so the surrounding text stays static.
 */
export function AnimatedCounter({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  duration = 1.6,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  duration?: number;
}) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { duration: duration * 1000, bounce: 0 });
  const [display, setDisplay] = React.useState("0");

  React.useEffect(() => {
    if (isInView) motionValue.set(value);
  }, [isInView, value, motionValue]);

  React.useEffect(() => {
    const unsubscribe = spring.on("change", (latest) => {
      setDisplay(
        decimals > 0
          ? latest.toFixed(decimals)
          : Math.round(latest).toLocaleString(),
      );
    });
    return unsubscribe;
  }, [spring, decimals]);

  return (
    <span ref={ref}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}
