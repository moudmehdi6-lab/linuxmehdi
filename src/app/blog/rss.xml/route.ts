import { prisma } from "@/lib/prisma";
import { blogPostInclude } from "@/lib/blog";
import { siteConfig } from "@/lib/site-config";

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const posts = await prisma.blogPost.findMany({
    where: { status: "PUBLISHED" },
    include: blogPostInclude,
    orderBy: { publishedAt: "desc" },
    take: 50,
  });

  const items = posts
    .map((post) => {
      const url = `${siteConfig.url}/en/blog/${post.slug}`;
      const pubDate = (post.publishedAt ?? post.createdAt).toUTCString();
      return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid>${url}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(post.excerpt)}</description>
      <author>${escapeXml(post.author.name)}</author>
      <category>${escapeXml(post.category.name)}</category>
    </item>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${siteConfig.name} Blog</title>
    <link>${siteConfig.url}/en/blog</link>
    <description>${siteConfig.tagline}</description>
    <language>en</language>${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
