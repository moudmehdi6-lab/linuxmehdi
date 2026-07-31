import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

// Absolute icon URLs, not root-relative: some browsers resolve manifest
// icon `src` against the current document URL instead of the manifest's
// own URL, which under the [locale] segment turned "/icon" into a
// locale-prefixed "/en/icon" 404. Absolute URLs remove the ambiguity.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: siteConfig.name,
    description: siteConfig.tagline,
    start_url: "/",
    display: "standalone",
    background_color: siteConfig.colors.black,
    theme_color: siteConfig.colors.black,
    icons: [
      { src: `${siteConfig.url}/icon`, sizes: "32x32", type: "image/png" },
      { src: `${siteConfig.url}/apple-icon`, sizes: "180x180", type: "image/png" },
    ],
  };
}
