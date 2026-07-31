"use client";

import { useTranslations } from "next-intl";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  User,
  CreditCard,
  ShoppingBag,
  Receipt,
  Bell,
  LifeBuoy,
  Settings,
  LogOut,
} from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const links = [
  { href: "/dashboard", key: "overview", icon: LayoutDashboard },
  { href: "/dashboard/profile", key: "profile", icon: User },
  { href: "/dashboard/subscription", key: "subscription", icon: CreditCard },
  { href: "/dashboard/orders", key: "orders", icon: ShoppingBag },
  { href: "/dashboard/invoices", key: "invoices", icon: Receipt },
  { href: "/dashboard/notifications", key: "notifications", icon: Bell },
  { href: "/dashboard/support", key: "support", icon: LifeBuoy },
  { href: "/dashboard/settings", key: "settings", icon: Settings },
] as const;

export function DashboardSidebar() {
  const t = useTranslations("dashboard");
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 border-r border-white/10 p-4 lg:block">
      <nav className="flex flex-col gap-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive =
            link.href === "/dashboard" ? pathname === link.href : pathname.startsWith(link.href);
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
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="focus-ring mt-4 flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
        >
          <LogOut className="h-4 w-4" />
          {t("logout")}
        </button>
      </nav>
    </aside>
  );
}
