"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/audit";
import { blogPostFormSchema, type BlogPostFormValues } from "@/lib/validations/admin";

type ActionResult = { success: true } | { success: false; error: string };

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function wordsPerMinute(html: string) {
  const words = html.replace(/<[^>]+>/g, " ").trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

export async function saveBlogPost(values: BlogPostFormValues): Promise<ActionResult> {
  const parsed = blogPostFormSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const session = await requireAdmin();
  const { id, categoryName, tags, ...rest } = parsed.data;

  const category = await prisma.blogCategory.upsert({
    where: { slug: slugify(categoryName) },
    update: { name: categoryName },
    create: { slug: slugify(categoryName), name: categoryName },
  });

  const tagNames = (tags ?? "")
    .split(",")
    .map((tg) => tg.trim())
    .filter(Boolean);
  const tagIds: string[] = [];
  for (const tagName of tagNames) {
    const tag = await prisma.blogTag.upsert({
      where: { slug: slugify(tagName) },
      update: { name: tagName },
      create: { slug: slugify(tagName), name: tagName },
    });
    tagIds.push(tag.id);
  }

  const data = {
    ...rest,
    categoryId: category.id,
    readingTimeMins: wordsPerMinute(rest.content),
    publishedAt: rest.status === "PUBLISHED" ? new Date() : null,
  };

  let postId = id;
  if (id) {
    await prisma.blogPost.update({ where: { id }, data });
    await prisma.blogPostTag.deleteMany({ where: { postId: id } });
    await logAudit(session.user.id, "update", "BlogPost", id);
  } else {
    const created = await prisma.blogPost.create({ data });
    postId = created.id;
    await logAudit(session.user.id, "create", "BlogPost", created.id);
  }

  if (postId && tagIds.length > 0) {
    await prisma.blogPostTag.createMany({
      data: tagIds.map((tagId) => ({ postId: postId!, tagId })),
    });
  }

  revalidatePath("/admin/blog");
  revalidatePath("/[locale]/blog", "page");
  revalidatePath("/[locale]/blog/[slug]", "page");
  return { success: true };
}

export async function deleteBlogPost(id: string): Promise<ActionResult> {
  const session = await requireAdmin();
  await prisma.blogPost.delete({ where: { id } }).catch(() => null);
  await logAudit(session.user.id, "delete", "BlogPost", id);
  revalidatePath("/admin/blog");
  return { success: true };
}
