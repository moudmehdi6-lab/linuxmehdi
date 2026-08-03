import { ArrowLeft, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { BlogPostWithRelations } from "@/lib/blog";

export function PostNavigation({
  previous,
  next,
}: {
  previous: BlogPostWithRelations | null;
  next: BlogPostWithRelations | null;
}) {
  const t = useTranslations("blog");

  if (!previous && !next) return null;

  return (
    <nav aria-label={t("postNavigation")} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {previous ? (
        <Link
          href={`/blog/${previous.slug}`}
          className="focus-ring glass group flex flex-col gap-1.5 rounded-2xl p-5 transition-colors hover:border-white/25"
        >
          <span className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            <ArrowLeft className="h-3.5 w-3.5" />
            {t("previous")}
          </span>
          <span className="text-sm font-medium leading-snug group-hover:text-gold">
            {previous.title}
          </span>
        </Link>
      ) : (
        <div />
      )}

      {next ? (
        <Link
          href={`/blog/${next.slug}`}
          className="focus-ring glass group flex flex-col gap-1.5 rounded-2xl p-5 text-end transition-colors hover:border-white/25 sm:items-end"
        >
          <span className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {t("next")}
            <ArrowRight className="h-3.5 w-3.5" />
          </span>
          <span className="text-sm font-medium leading-snug group-hover:text-gold">
            {next.title}
          </span>
        </Link>
      ) : (
        <div />
      )}
    </nav>
  );
}
