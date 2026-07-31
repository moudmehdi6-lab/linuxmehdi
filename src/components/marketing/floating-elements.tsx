"use client";

import { motion } from "framer-motion";
import { Play, Tv, Smartphone, Wifi, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const devices = [
  {
    className: "left-[4%] top-[16%]",
    delay: 0,
    animation: "animate-float-slow",
    shape: "tv" as const,
  },
  {
    className: "right-[5%] top-[12%]",
    delay: 0.15,
    animation: "animate-float-delayed",
    shape: "phone" as const,
  },
  {
    className: "left-[10%] top-[70%]",
    delay: 0.3,
    animation: "animate-float-delayed",
    shape: "chip" as const,
    Icon: Wifi,
  },
  {
    className: "right-[10%] top-[68%]",
    delay: 0.45,
    animation: "animate-float-slow",
    shape: "chip" as const,
    Icon: Sparkles,
  },
];

export function FloatingElements() {
  return (
    <div className="pointer-events-none absolute inset-0 hidden lg:block" aria-hidden>
      {devices.map((device, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 + device.delay, duration: 0.6, ease: "easeOut" }}
          className={cn("absolute", device.animation, device.className)}
        >
          {device.shape === "tv" && (
            <div className="glass flex w-32 flex-col items-center rounded-xl p-2 shadow-2xl">
              <div className="flex aspect-video w-full items-center justify-center rounded-md bg-gradient-to-br from-gold/20 to-electric/20">
                <Play className="h-5 w-5 fill-gold text-gold" />
              </div>
              <div className="mt-1.5 h-1 w-8 rounded-full bg-white/15" />
            </div>
          )}

          {device.shape === "phone" && (
            <div className="glass flex h-24 w-14 flex-col items-center justify-center gap-1.5 rounded-2xl p-1.5 shadow-2xl">
              <Tv className="h-5 w-5 text-electric-light" strokeWidth={1.5} />
              <div className="h-1 w-5 rounded-full bg-white/15" />
            </div>
          )}

          {device.shape === "chip" && device.Icon && (
            <div className="glass flex h-11 w-11 items-center justify-center rounded-2xl">
              <device.Icon className="h-[45%] w-[45%] text-gold/70" strokeWidth={1.5} />
            </div>
          )}
        </motion.div>
      ))}

      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.75, duration: 0.6, ease: "easeOut" }}
        className="animate-float-slow absolute left-[2%] top-[44%]"
      >
        <div className="glass flex h-9 w-9 items-center justify-center rounded-2xl">
          <Smartphone className="h-[42%] w-[42%] text-gold/70" strokeWidth={1.5} />
        </div>
      </motion.div>
    </div>
  );
}
