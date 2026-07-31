"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { mediaAssetFormSchema, type MediaAssetFormValues } from "@/lib/validations/admin";
import { addMediaAsset } from "@/actions/admin/media";

export function MediaUploadForm() {
  const t = useTranslations("admin.media");
  const tCommon = useTranslations("admin");
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<MediaAssetFormValues>({
    resolver: zodResolver(mediaAssetFormSchema),
    defaultValues: { url: "", alt: "", type: "IMAGE" },
  });

  const onSubmit = async (values: MediaAssetFormValues) => {
    setError(null);
    const result = await addMediaAsset(values);
    if (!result.success) {
      setError(result.error);
      return;
    }
    setOpen(false);
    reset();
    router.refresh();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4" />
          {t("addAsset")}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("addAsset")}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div>
            <Label htmlFor="url">{t("url")}</Label>
            <Input id="url" className="mt-2" placeholder="https://..." {...register("url")} />
          </div>
          <div>
            <Label htmlFor="alt">{t("alt")}</Label>
            <Input id="alt" className="mt-2" {...register("alt")} />
          </div>
          <div>
            <Label htmlFor="type">{t("type")}</Label>
            <select
              id="type"
              className="focus-ring mt-2 h-11 w-full rounded-lg border border-white/15 bg-white/[0.03] px-4 text-sm"
              {...register("type")}
            >
              <option value="IMAGE" className="bg-obsidian">
                Image
              </option>
              <option value="SVG" className="bg-obsidian">
                SVG
              </option>
              <option value="DOCUMENT" className="bg-obsidian">
                Document
              </option>
            </select>
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
