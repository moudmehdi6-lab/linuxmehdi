import { defineRouting } from "next-intl/routing";

// Phase 1: only English is live. fr/de/es/ar are added to this array in the
// i18n phase once their message catalogs are filled in; the [locale] routing,
// middleware, and RTL layout logic are already in place for all five.
export const locales = ["en"] as const;

export const rtlLocales: readonly string[] = ["ar"];

export type Locale = (typeof locales)[number];

export const routing = defineRouting({
  locales,
  defaultLocale: "en",
  localePrefix: "always",
});
