import { useTranslations } from "next-intl";
import type { TocHeading } from "@/lib/blog";
import { cn } from "@/lib/utils";

export function TableOfContents({ headings }: { headings: TocHeading[] }) {
  const t = useTranslations("blog");

  if (headings.length === 0) return null;

  return (
    <nav aria-label={t("tableOfContents")} className="glass rounded-2xl p-5">
      <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {t("tableOfContents")}
      </div>
      <ul className="mt-3 space-y-2 text-sm">
        {headings.map((heading) => (
          <li key={heading.id} className={cn(heading.level === 3 && "pl-4")}>
            <a
              href={`#${heading.id}`}
              className="focus-ring text-muted-foreground transition-colors hover:text-foreground"
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
