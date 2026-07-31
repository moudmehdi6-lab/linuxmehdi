import { getTranslations, setRequestLocale } from "next-intl/server";
import { Plus, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BlogPostFormDialog } from "@/components/admin/blog-post-form-dialog";
import { DeleteButton } from "@/components/admin/delete-button";
import { prisma } from "@/lib/prisma";
import { safeQuery } from "@/lib/db";
import { deleteBlogPost } from "@/actions/admin/blog";

export default async function AdminBlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("admin.blog");

  const [posts, authors] = await Promise.all([
    safeQuery(
      () =>
        prisma.blogPost.findMany({
          include: { author: true, category: true, tags: { include: { tag: true } } },
          orderBy: { createdAt: "desc" },
        }),
      [],
    ),
    safeQuery(() => prisma.author.findMany({ orderBy: { name: "asc" } }), []),
  ]);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold">{t("title")}</h1>
          <p className="mt-1 text-muted-foreground">{t("subtitle")}</p>
        </div>
        <BlogPostFormDialog
          authors={authors}
          trigger={
            <Button>
              <Plus className="h-4 w-4" />
              {t("newPost")}
            </Button>
          }
        />
      </div>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/[0.03] text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-5 py-3 font-medium">{t("titleField")}</th>
              <th className="px-5 py-3 font-medium">{t("category")}</th>
              <th className="px-5 py-3 font-medium">{t("author")}</th>
              <th className="px-5 py-3 font-medium">{t("status")}</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id} className="border-t border-white/5">
                <td className="px-5 py-4 font-medium">{post.title}</td>
                <td className="px-5 py-4 text-muted-foreground">{post.category.name}</td>
                <td className="px-5 py-4 text-muted-foreground">{post.author.name}</td>
                <td className="px-5 py-4">
                  <Badge variant={post.status === "PUBLISHED" ? "success" : "outline"}>
                    {post.status}
                  </Badge>
                </td>
                <td className="px-5 py-4 text-right">
                  <div className="flex justify-end gap-1">
                    <BlogPostFormDialog
                      authors={authors}
                      post={{
                        id: post.id,
                        title: post.title,
                        slug: post.slug,
                        excerpt: post.excerpt,
                        content: post.content,
                        categoryName: post.category.name,
                        tags: post.tags.map((t) => t.tag.name).join(", "),
                        authorId: post.authorId,
                        status: post.status,
                      }}
                      trigger={
                        <Button variant="ghost" size="icon">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      }
                    />
                    <DeleteButton id={post.id} action={deleteBlogPost} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {posts.length === 0 && (
          <p className="p-8 text-center text-sm text-muted-foreground">{t("subtitle")}</p>
        )}
      </div>
    </div>
  );
}
