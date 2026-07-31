"use client";

import * as React from "react";
import type { AffiliateStatus } from "@prisma/client";
import { updateAffiliateStatus } from "@/actions/admin/affiliates";

const statuses: AffiliateStatus[] = ["PENDING", "APPROVED", "SUSPENDED"];

export function AffiliateStatusSelect({
  affiliateId,
  status,
}: {
  affiliateId: string;
  status: AffiliateStatus;
}) {
  const [value, setValue] = React.useState(status);
  const [isPending, startTransition] = React.useTransition();

  return (
    <select
      value={value}
      disabled={isPending}
      onChange={(e) => {
        const next = e.target.value as AffiliateStatus;
        setValue(next);
        startTransition(() => {
          void updateAffiliateStatus(affiliateId, next);
        });
      }}
      className="focus-ring rounded-lg border border-white/15 bg-white/[0.03] px-2.5 py-1.5 text-xs"
    >
      {statuses.map((s) => (
        <option key={s} value={s} className="bg-obsidian">
          {s}
        </option>
      ))}
    </select>
  );
}
