"use client";

import * as React from "react";
import type { OrderStatus } from "@prisma/client";
import { updateOrderStatus } from "@/actions/admin/orders";

const statuses: OrderStatus[] = ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"];

export function OrderStatusSelect({
  orderId,
  status,
}: {
  orderId: string;
  status: OrderStatus;
}) {
  const [value, setValue] = React.useState(status);
  const [isPending, startTransition] = React.useTransition();

  return (
    <select
      value={value}
      disabled={isPending}
      onChange={(e) => {
        const next = e.target.value as OrderStatus;
        setValue(next);
        startTransition(() => {
          void updateOrderStatus(orderId, next);
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
