import { useTranslations } from "next-intl";

export function SkipToContent() {
  const t = useTranslations("common");

  return (
    <a
      href="#main-content"
      className="focus-ring fixed start-4 top-4 z-[100] -translate-y-20 rounded-lg bg-gold px-4 py-2 text-sm font-medium text-obsidian transition-transform focus:translate-y-0"
    >
      {t("skipToContent")}
    </a>
  );
}
