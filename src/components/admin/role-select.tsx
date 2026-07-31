"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import type { Role } from "@prisma/client";
import { updateUserRole } from "@/actions/admin/users";

const roles: Role[] = ["CUSTOMER", "SUPPORT", "ADMIN"];

export function RoleSelect({ userId, role }: { userId: string; role: Role }) {
  const router = useRouter();
  const [value, setValue] = React.useState(role);
  const [error, setError] = React.useState<string | null>(null);
  const [isPending, startTransition] = React.useTransition();

  return (
    <div>
      <select
        value={value}
        disabled={isPending}
        onChange={(e) => {
          const next = e.target.value as Role;
          const previous = value;
          setValue(next);
          setError(null);
          startTransition(async () => {
            const result = await updateUserRole(userId, next);
            if (!result.success) {
              setValue(previous);
              setError(result.error);
              return;
            }
            router.refresh();
          });
        }}
        className="focus-ring rounded-lg border border-white/15 bg-white/[0.03] px-2.5 py-1.5 text-xs"
      >
        {roles.map((r) => (
          <option key={r} value={r} className="bg-obsidian">
            {r}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}
