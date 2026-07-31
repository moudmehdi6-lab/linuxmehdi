import { cn } from "@/lib/utils";

export function AuroraBackground({
  className,
  variant = "default",
}: {
  className?: string;
  variant?: "default" | "hero";
}) {
  const isHero = variant === "hero";

  return (
    <div className={cn("aurora-layer", className)} aria-hidden>
      <div
        className={cn(
          "absolute left-1/2 top-[-10%] -translate-x-1/2 rounded-full bg-gold/20 blur-[120px] animate-aurora",
          isHero ? "h-[46rem] w-[46rem] bg-gold/25" : "h-[40rem] w-[40rem]",
        )}
      />
      <div
        className={cn(
          "absolute right-[-10%] top-[10%] rounded-full bg-electric/20 blur-[120px] animate-aurora [animation-delay:4s]",
          isHero ? "h-[34rem] w-[34rem] bg-electric/25" : "h-[30rem] w-[30rem]",
        )}
      />
      {isHero && (
        <div className="absolute bottom-[-15%] left-[10%] h-[26rem] w-[26rem] rounded-full bg-gold/10 blur-[110px] animate-aurora [animation-delay:2s]" />
      )}
      <div className="bg-grid-pattern absolute inset-0 bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)]" />
      {isHero && (
        <div className="bg-mesh-gradient absolute inset-0 opacity-70" />
      )}
    </div>
  );
}
