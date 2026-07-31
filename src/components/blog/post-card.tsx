import { useTranslations } from "next-intl";
import { Clock } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { BlogPostWithRelations } from "@/lib/blog";
import { getBlogCategoryIcon } from "@/lib/blog-category-icons";

export function PostCard({ post }: { post: BlogPostWithRelations }) {
  const t = useTranslations("blog");
  const CategoryIcon = getBlogCategoryIcon(post.category.name);
  const authorInitials = post.author.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Link href={`/blog/${post.slug}`}>
      <Card className="group flex h-full flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:border-gold/30 hover:shadow-[0_25px_60px_-25px_rgba(212,175,55,0.35)]">
        <div className="relative flex aspect-[16/9] items-center justify-center overflow-hidden bg-gradient-to-br from-gold/15 via-electric/10 to-transparent">
          <div className="bg-grid-pattern absolute inset-0 bg-[size:28px_28px] opacity-30 [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,black,transparent)]" />
          <CategoryIcon
            className="h-14 w-14 text-white/90 opacity-80 transition-transform duration-500 group-hover:scale-110"
            strokeWidth={1.25}
          />
          <Badge variant="electric" className="absolute start-4 top-4 shadow-md">
            {post.category.name}
          </Badge>
        </div>

        <CardContent className="flex flex-1 flex-col pt-6">
          <h3 className="text-lg font-semibold leading-snug transition-colors group-hover:text-gold">
            {post.title}
          </h3>
          <p className="mt-2.5 flex-1 text-sm text-muted-foreground">{post.excerpt}</p>

          <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-gold to-electric text-[10px] font-semibold text-obsidian">
                {authorInitials}
              </div>
              <span>{post.author.name}</span>
            </div>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {t("minRead", { minutes: post.readingTimeMins })}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
