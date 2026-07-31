import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { FileText } from "lucide-react";
import { MediaUploadForm } from "@/components/admin/media-upload-form";
import { DeleteButton } from "@/components/admin/delete-button";
import { prisma } from "@/lib/prisma";
import { safeQuery } from "@/lib/db";
import { deleteMediaAsset } from "@/actions/admin/media";

export default async function AdminMediaPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("admin.media");
  const assets = await safeQuery(
    () => prisma.mediaAsset.findMany({ orderBy: { createdAt: "desc" } }),
    [],
  );

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold">{t("title")}</h1>
          <p className="mt-1 text-muted-foreground">{t("subtitle")}</p>
        </div>
        <MediaUploadForm />
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {assets.map((asset) => (
          <div key={asset.id} className="glass overflow-hidden rounded-2xl">
            <div className="relative flex h-32 items-center justify-center bg-white/5">
              {asset.type === "DOCUMENT" ? (
                <FileText className="h-8 w-8 text-muted-foreground" />
              ) : (
                <Image
                  src={asset.url}
                  alt={asset.alt ?? ""}
                  fill
                  className="object-cover"
                  unoptimized
                />
              )}
            </div>
            <div className="flex items-center justify-between p-3">
              <p className="truncate text-xs text-muted-foreground">{asset.alt || asset.url}</p>
              <DeleteButton id={asset.id} action={deleteMediaAsset} />
            </div>
          </div>
        ))}
      </div>
      {assets.length === 0 && (
        <p className="mt-10 text-center text-sm text-muted-foreground">{t("subtitle")}</p>
      )}
    </div>
  );
}
