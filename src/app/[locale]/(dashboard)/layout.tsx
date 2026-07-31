import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Link } from "@/i18n/navigation";
import { Logo } from "@/components/layout/logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { AccountMenu } from "@/components/layout/account-menu";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardMobileNav } from "@/components/dashboard/dashboard-mobile-nav";
import { SkipToContent } from "@/components/shared/skip-to-content";

// Every route under this layout renders per-user data from an authenticated
// session — it must never be served as cached static HTML.
export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <div className="flex min-h-screen flex-col">
      <SkipToContent />
      <header className="glass sticky top-0 z-40 flex items-center justify-between px-6 py-4">
        <Link href="/" aria-label="IPTVLinux home">
          <Logo />
        </Link>
        <div className="flex items-center gap-3">
          <LocaleSwitcher />
          <ThemeToggle />
          <AccountMenu />
        </div>
      </header>

      <DashboardMobileNav />

      <div className="flex flex-1">
        <DashboardSidebar />
        <main id="main-content" className="flex-1 p-6 lg:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}
