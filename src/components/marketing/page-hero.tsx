import type { ReactNode } from "react";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { AuroraBackground } from "@/components/marketing/aurora-background";
import { cn } from "@/lib/utils";

export function PageHero({
  eyebrow,
  title,
  subtitle,
  children,
  className,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("relative overflow-hidden pb-8 pt-10 sm:pb-10 sm:pt-14 lg:pb-12 lg:pt-20", className)}>
      <AuroraBackground />
      <Container className="relative">
        <div className="mx-auto max-w-2xl text-center">
          <Badge>{eyebrow}</Badge>
          <h1 className="mt-6 text-balance font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-4 text-balance text-muted-foreground">{subtitle}</p>
          )}
        </div>
        {children}
      </Container>
    </section>
  );
}
