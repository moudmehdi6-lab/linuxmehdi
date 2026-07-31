"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { blogPostFormSchema, type BlogPostFormValues } from "@/lib/validations/admin";
import { saveBlogPost } from "@/actions/admin/blog";

type PostDefaults = Partial<BlogPostFormValues> & { id?: string };

export function BlogPostFormDialog({
  post,
  authors,
  trigger,
}: {
  post?: PostDefaults;
  authors: { id: string; name: string }[];
  trigger: React.ReactNode;
}) {
  const t = useTranslations("admin.blog");
  const tCommon = useTranslations("admin");
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<BlogPostFormValues>({
    resolver: zodResolver(blogPostFormSchema),
    defaultValues: {
      id: post?.id,
      title: post?.title ?? "",
      slug: post?.slug ?? "",
      excerpt: post?.excerpt ?? "",
      content: post?.content ?? "",
      categoryName: post?.categoryName ?? "",
      tags: post?.tags ?? "",
      authorId: post?.authorId ?? authors[0]?.id ?? "",
      status: post?.status ?? "DRAFT",
    },
  });

  const onSubmit = async (values: BlogPostFormValues) => {
    setError(null);
    const result = await saveBlogPost(values);
    if (!result.success) {
      setError(result.error);
      return;
    }
    setOpen(false);
    router.refresh();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{post ? t("title") : t("newPost")}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <input type="hidden" {...register("id")} />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">{t("titleField")}</Label>
              <Input id="title" className="mt-2" {...register("title")} />
            </div>
            <div>
              <Label htmlFor="slug">{t("slug")}</Label>
              <Input id="slug" className="mt-2" {...register("slug")} />
            </div>
          </div>
          <div>
            <Label htmlFor="excerpt">{t("excerpt")}</Label>
            <Textarea id="excerpt" className="mt-2 min-h-16" {...register("excerpt")} />
          </div>
          <div>
            <Label htmlFor="content">{t("content")}</Label>
            <Textarea id="content" className="mt-2 min-h-40 font-mono text-xs" {...register("content")} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="categoryName">{t("category")}</Label>
              <Input id="categoryName" className="mt-2" {...register("categoryName")} />
            </div>
            <div>
              <Label htmlFor="tags">{t("tags")}</Label>
              <Input id="tags" className="mt-2" {...register("tags")} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="authorId">{t("author")}</Label>
              <select
                id="authorId"
                className="focus-ring mt-2 h-11 w-full rounded-lg border border-white/15 bg-white/[0.03] px-4 text-sm"
                {...register("authorId")}
              >
                {authors.map((author) => (
                  <option key={author.id} value={author.id} className="bg-obsidian">
                    {author.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="status">{t("status")}</Label>
              <select
                id="status"
                className="focus-ring mt-2 h-11 w-full rounded-lg border border-white/15 bg-white/[0.03] px-4 text-sm"
                {...register("status")}
              >
                <option value="DRAFT" className="bg-obsidian">
                  Draft
                </option>
                <option value="PUBLISHED" className="bg-obsidian">
                  Published
                </option>
              </select>
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {tCommon("save")}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
