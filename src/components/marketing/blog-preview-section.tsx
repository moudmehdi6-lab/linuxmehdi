import { getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { PostCard } from "@/components/blog/post-card";
import { getPublishedPosts } from "@/lib/blog";

export async function BlogPreviewSection() {
  const t = await getTranslations("home.blogPreview");
  const { posts } = await getPublishedPosts({ page: 1, perPage: 3 });

  if (posts.length === 0) return null;

  return (
    <section className="py-10 sm:py-16 lg:py-24">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <Badge>{t("eyebrow")}</Badge>
          <h2 className="mt-6 text-balance font-display text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
            {t("title")}
          </h2>
        </div>

        <div className="mt-10 sm:mt-12 lg:mt-14 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>

        <div className="mt-8 flex justify-center sm:mt-10 lg:mt-12">
          <Button asChild variant="outline">
            <Link href="/blog">
              {t("viewAll")}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}
