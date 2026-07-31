import { siteConfig } from "@/lib/site-config";

export const dynamic = "force-static";

function build(): string {
  const { url, name, tagline, contactEmail } = siteConfig;

  return `# ${name}

> ${tagline} ${name} is a premium IPTV streaming subscription service offering a large live-channel library, HD/FHD/4K quality, and support across all major streaming devices.

## Key pages

- [Home](${url}/en): overview, plans, and highlights
- [Pricing](${url}/en/pricing): subscription plans and pricing
- [Channels](${url}/en/channels): channel catalog by category
- [Devices](${url}/en/devices): supported devices and setup instructions
- [How It Works](${url}/en/how-it-works): getting started guide
- [FAQ](${url}/en/faq): frequently asked questions
- [Blog](${url}/en/blog): articles and streaming guides
- [About](${url}/en/about): company information
- [Contact](${url}/en/contact): support and contact details

## Notes

- Content is available in English, French, German, Spanish, and Arabic under the corresponding locale prefix (e.g. /fr, /de, /es, /ar).
- Support contact: ${contactEmail}
- Full URL index: ${url}/sitemap.xml
`;
}

export function GET() {
  return new Response(build(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
