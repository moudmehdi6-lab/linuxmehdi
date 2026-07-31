import { useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

export function BlogPagination({
  basePath,
  currentPage,
  totalPages,
  searchParams,
}: {
  basePath: string;
  currentPage: number;
  totalPages: number;
  searchParams?: Record<string, string | undefined>;
}) {
  const t = useTranslations("blog");

  if (totalPages <= 1) return null;

  const buildHref = (page: number) => {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(searchParams ?? {})) {
      if (value) params.set(key, value);
    }
    if (page > 1) params.set("page", String(page));
    const qs = params.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  };

  return (
    <div className="mt-10 flex items-center justify-center gap-3">
      {currentPage > 1 ? (
        <Button asChild variant="outline" size="sm">
          <Link href={buildHref(currentPage - 1)}>
            <ChevronLeft className="h-4 w-4" />
            {t("previous")}
          </Link>
        </Button>
      ) : (
        <Button variant="outline" size="sm" disabled>
          <ChevronLeft className="h-4 w-4" />
          {t("previous")}
        </Button>
      )}
      <span className="text-sm text-muted-foreground">
        {currentPage} / {totalPages}
      </span>
      {currentPage < totalPages ? (
        <Button asChild variant="outline" size="sm">
          <Link href={buildHref(currentPage + 1)}>
            {t("next")}
            <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
      ) : (
        <Button variant="outline" size="sm" disabled>
          {t("next")}
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
