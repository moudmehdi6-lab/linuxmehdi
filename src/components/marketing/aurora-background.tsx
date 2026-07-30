import { cn } from "@/lib/utils";

export function AuroraBackground({ className }: { className?: string }) {
  return (
    <div className={cn("aurora-layer", className)} aria-hidden>
      <div className="absolute left-1/2 top-[-10%] h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-gold/20 blur-[120px] animate-aurora" />
      <div className="absolute right-[-10%] top-[10%] h-[30rem] w-[30rem] rounded-full bg-electric/20 blur-[120px] animate-aurora [animation-delay:4s]" />
      <div className="bg-grid-pattern absolute inset-0 bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)]" />
    </div>
  );
}
