import type { Metadata } from "next";
import { Inter, Manrope, Noto_Sans_Arabic } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { NextIntlClientProvider } from "next-intl";
import { getTranslations, getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing, rtlLocales, isValidLocale } from "@/i18n/routing";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { SessionProvider } from "@/components/layout/session-provider";
import { siteConfig } from "@/lib/site-config";
import "@/app/globals.css";

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const fontDisplay = Manrope({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const fontArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  variable: "--font-arabic",
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home.hero" });

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: `${siteConfig.name} — ${t("title")}`,
      template: `%s | ${siteConfig.name}`,
    },
    description: siteConfig.tagline,
    applicationName: siteConfig.name,
    generator: "Next.js",
    referrer: "strict-origin-when-cross-origin",
    // Explicit absolute icon URLs: with only the file-convention icon.tsx /
    // apple-icon.tsx present, Next's per-segment metadata resolution under
    // the [locale] dynamic route was emitting an extra locale-prefixed
    // request (/en/icon) that 404s. Pinning fully-qualified URLs here
    // removes the ambiguity.
    icons: {
      icon: `${siteConfig.url}/icon`,
      apple: `${siteConfig.url}/apple-icon`,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const dir = rtlLocales.includes(locale) ? "rtl" : "ltr";
  const messages = await getMessages();

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontDisplay.variable} ${fontArabic.variable} font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <NextIntlClientProvider locale={locale} messages={messages}>
            <SessionProvider>{children}</SessionProvider>
          </NextIntlClientProvider>
        </ThemeProvider>
        {siteConfig.gaMeasurementId && (
          <GoogleAnalytics gaId={siteConfig.gaMeasurementId} />
        )}
      </body>
    </html>
  );
}
