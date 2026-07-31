"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DeleteButton({
  id,
  action,
}: {
  id: string;
  action: (id: string) => Promise<unknown>;
}) {
  const t = useTranslations("admin");
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();

  return (
    <Button
      variant="ghost"
      size="icon"
      disabled={isPending}
      onClick={() => {
        if (!window.confirm(t("confirmDelete"))) return;
        startTransition(async () => {
          await action(id);
          router.refresh();
        });
      }}
    >
      <Trash2 className="h-4 w-4 text-destructive" />
    </Button>
  );
}
