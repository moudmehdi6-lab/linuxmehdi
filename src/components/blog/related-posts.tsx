import { useTranslations } from "next-intl";
import { PostCard } from "@/components/blog/post-card";
import type { BlogPostWithRelations } from "@/lib/blog";

export function RelatedPosts({ posts }: { posts: BlogPostWithRelations[] }) {
  const t = useTranslations("blog");

  if (posts.length === 0) return null;

  return (
    <div>
      <h2 className="font-display text-2xl font-semibold">{t("relatedTitle")}</h2>
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
