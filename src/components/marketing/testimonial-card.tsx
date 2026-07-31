import { Star } from "lucide-react";
import type { Testimonial } from "@/lib/fallback-data";
import { Card, CardContent } from "@/components/ui/card";

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <Card className="flex h-full flex-col">
      <CardContent className="flex flex-1 flex-col pt-6">
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={
                i < testimonial.rating
                  ? "h-4 w-4 fill-gold text-gold"
                  : "h-4 w-4 text-white/15"
              }
            />
          ))}
        </div>
        <p className="mt-4 flex-1 text-sm text-muted-foreground">
          &ldquo;{testimonial.content}&rdquo;
        </p>
        <div className="mt-5">
          <div className="text-sm font-medium">{testimonial.name}</div>
          {testimonial.role && (
            <div className="text-xs text-muted-foreground">{testimonial.role}</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
