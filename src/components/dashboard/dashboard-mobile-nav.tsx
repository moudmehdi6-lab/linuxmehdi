"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const links = [
  { href: "/dashboard", key: "overview" },
  { href: "/dashboard/profile", key: "profile" },
  { href: "/dashboard/subscription", key: "subscription" },
  { href: "/dashboard/orders", key: "orders" },
  { href: "/dashboard/invoices", key: "invoices" },
  { href: "/dashboard/notifications", key: "notifications" },
  { href: "/dashboard/support", key: "support" },
  { href: "/dashboard/settings", key: "settings" },
] as const;

export function DashboardMobileNav() {
  const t = useTranslations("dashboard");
  const pathname = usePathname();

  return (
    <div className="flex gap-2 overflow-x-auto border-b border-white/10 px-4 py-3 lg:hidden">
      {links.map((link) => {
        const isActive =
          link.href === "/dashboard" ? pathname === link.href : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium",
              isActive ? "bg-gold text-obsidian" : "border border-white/15 text-muted-foreground",
            )}
          >
            {t(`nav.${link.key}`)}
          </Link>
        );
      })}
    </div>
  );
}
