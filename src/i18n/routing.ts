import { defineRouting } from "next-intl/routing";

export const locales = ["en", "fr", "de", "es", "ar"] as const;

export const rtlLocales: readonly string[] = ["ar"];

export type Locale = (typeof locales)[number];

export const localeNames: Record<Locale, string> = {
  en: "English",
  fr: "Français",
  de: "Deutsch",
  es: "Español",
  ar: "العربية",
};

export const localeFlags: Record<Locale, string> = {
  en: "🇬🇧",
  fr: "🇫🇷",
  de: "🇩🇪",
  es: "🇪🇸",
  ar: "🇸🇦",
};

export const routing = defineRouting({
  locales,
  defaultLocale: "en",
  localePrefix: "always",
  // Defaults handle both requirements: localeDetection reads the browser's
  // Accept-Language header on first visit, localeCookie persists whatever
  // locale the visitor ends up on for subsequent visits.
});

// next-intl v3 doesn't export `hasLocale` (added in v4) — this is the
// equivalent locale-narrowing guard used in its place.
export function isValidLocale(value: string | undefined): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}
