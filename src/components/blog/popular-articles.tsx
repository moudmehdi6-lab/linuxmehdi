import { useTranslations } from "next-intl";
import { Flame } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { BlogPostWithRelations } from "@/lib/blog";

export function PopularArticles({ posts }: { posts: BlogPostWithRelations[] }) {
  const t = useTranslations("blog");

  if (posts.length === 0) return null;

  return (
    <nav aria-label={t("popularTitle")} className="glass rounded-2xl p-5">
      <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        <Flame className="h-3.5 w-3.5 text-gold" />
        {t("popularTitle")}
      </div>
      <ul className="mt-3 space-y-3">
        {posts.map((post, index) => (
          <li key={post.id}>
            <Link
              href={`/blog/${post.slug}`}
              className="focus-ring group flex items-start gap-3"
            >
              <span className="font-display text-lg font-semibold text-gold/50 transition-colors group-hover:text-gold">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="text-sm leading-snug text-foreground/85 transition-colors group-hover:text-foreground">
                {post.title}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
