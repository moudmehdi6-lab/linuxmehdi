"use client";

import { useTranslations } from "next-intl";
import {
  BarChart3,
  Users,
  ShoppingBag,
  Tags,
  Ticket,
  Handshake,
  Newspaper,
  Images,
  Search,
  FileBarChart,
  UserCog,
  ShieldCheck,
  Settings,
  ArrowLeft,
} from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", key: "analytics", icon: BarChart3 },
  { href: "/admin/customers", key: "customers", icon: Users },
  { href: "/admin/orders", key: "orders", icon: ShoppingBag },
  { href: "/admin/plans", key: "plans", icon: Tags },
  { href: "/admin/coupons", key: "coupons", icon: Ticket },
  { href: "/admin/affiliates", key: "affiliates", icon: Handshake },
  { href: "/admin/blog", key: "blog", icon: Newspaper },
  { href: "/admin/media", key: "media", icon: Images },
  { href: "/admin/seo", key: "seo", icon: Search },
  { href: "/admin/reports", key: "reports", icon: FileBarChart },
  { href: "/admin/users", key: "users", icon: UserCog },
  { href: "/admin/roles", key: "roles", icon: ShieldCheck },
  { href: "/admin/settings", key: "settings", icon: Settings },
] as const;

export function AdminSidebar() {
  const t = useTranslations("admin");
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-white/10 p-4 lg:flex">
      <nav className="flex flex-1 flex-col gap-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive =
            link.href === "/admin" ? pathname === link.href : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "focus-ring flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-gold/10 text-gold"
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
              {t(`nav.${link.key}`)}
            </Link>
          );
        })}
      </nav>
      <Link
        href="/"
        className="focus-ring flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-white/5 hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        {t("backToSite")}
      </Link>
    </aside>
  );
}
