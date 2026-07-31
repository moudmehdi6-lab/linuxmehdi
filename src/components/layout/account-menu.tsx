"use client";

import { useSession, signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import { LayoutDashboard, LogOut, Shield } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function AccountMenu() {
  const { data: session, status } = useSession();
  const t = useTranslations("nav");
  const tDashboard = useTranslations("dashboard");

  if (status === "loading") {
    return <div className="h-10 w-24" aria-hidden />;
  }

  if (!session) {
    return (
      <Button asChild variant="outline" size="sm">
        <Link href="/login">{t("login")}</Link>
      </Button>
    );
  }

  const initials = (session.user.name ?? session.user.email ?? "?")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="focus-ring flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-gold to-electric text-sm font-semibold text-obsidian">
          {initials}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{session.user.name ?? session.user.email}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard">
            <LayoutDashboard className="h-4 w-4" />
            {tDashboard("nav.overview")}
          </Link>
        </DropdownMenuItem>
        {session.user.role === "ADMIN" && (
          <DropdownMenuItem asChild>
            <Link href="/admin">
              <Shield className="h-4 w-4" />
              Admin
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })}>
          <LogOut className="h-4 w-4" />
          {tDashboard("logout")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
