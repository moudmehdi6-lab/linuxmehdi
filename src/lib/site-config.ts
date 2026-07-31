// Falls back to the placeholder production domain (never localhost) if
// NEXT_PUBLIC_SITE_URL isn't set for a production build, so canonical URLs,
// the sitemap, and JSON-LD can never accidentally ship pointing at localhost.
// Set NEXT_PUBLIC_SITE_URL in the deployment environment to the real domain.
const PLACEHOLDER_PRODUCTION_URL = "https://www.iptvlinux.com";

const resolvedSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.NODE_ENV === "production"
    ? PLACEHOLDER_PRODUCTION_URL
    : "http://localhost:3000");

export const siteConfig = {
  name: "IPTVLinux",
  tagline: "Premium streaming, engineered for reliability.",
  url: resolvedSiteUrl,
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "34603171403",
  contactEmail: "support@iptvlinux.com",
  social: {
    twitter: "https://twitter.com/iptvlinux",
    facebook: "https://facebook.com/iptvlinux",
    instagram: "https://instagram.com/iptvlinux",
    telegram: "https://t.me/iptvlinux",
  },
  colors: {
    black: "#0B0B0B",
    gold: "#D4AF37",
    blue: "#2563EB",
  },
} as const;

export type SitePlan = {
  slug: string;
  name: string;
  durationMonths: number;
  price: number;
  currency: string;
  discountPercent: number;
  badge: "NONE" | "MOST_POPULAR" | "BEST_VALUE";
  features: string[];
};

export const plans: SitePlan[] = [
  {
    slug: "1-month",
    name: "1 Month",
    durationMonths: 1,
    price: 20,
    currency: "EUR",
    discountPercent: 0,
    badge: "NONE",
    features: [
      "Full channel library",
      "HD & FHD streams",
      "All devices supported",
      "24/7 support",
    ],
  },
  {
    slug: "3-months",
    name: "3 Months",
    durationMonths: 3,
    price: 35,
    currency: "EUR",
    discountPercent: 42,
    badge: "NONE",
    features: [
      "Full channel library",
      "HD & FHD streams",
      "All devices supported",
      "24/7 support",
      "Save 42% vs monthly",
    ],
  },
  {
    slug: "6-months",
    name: "6 Months",
    durationMonths: 6,
    price: 45,
    currency: "EUR",
    discountPercent: 63,
    badge: "MOST_POPULAR",
    features: [
      "Full channel library",
      "4K UHD streams",
      "All devices supported",
      "Priority 24/7 support",
      "Save 63% vs monthly",
    ],
  },
  {
    slug: "12-months",
    name: "12 Months",
    durationMonths: 12,
    price: 65,
    currency: "EUR",
    discountPercent: 73,
    badge: "BEST_VALUE",
    features: [
      "Full channel library",
      "4K UHD streams",
      "All devices supported",
      "Priority 24/7 support",
      "Save 73% vs monthly",
      "Free setup assistance",
    ],
  },
];
