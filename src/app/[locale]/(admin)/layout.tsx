import { Link } from "@/i18n/navigation";
import { Logo } from "@/components/layout/logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { AccountMenu } from "@/components/layout/account-menu";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { requireAdmin } from "@/lib/rbac";
import { SkipToContent } from "@/components/shared/skip-to-content";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();

  return (
    <div className="flex min-h-screen flex-col">
      <SkipToContent />
      <header className="glass sticky top-0 z-40 flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <Link href="/admin" aria-label="IPTVLinux admin">
            <Logo />
          </Link>
          <span className="rounded-full bg-gold/15 px-2.5 py-1 text-xs font-medium text-gold">
            Admin
          </span>
        </div>
        <div className="flex items-center gap-3">
          <LocaleSwitcher />
          <ThemeToggle />
          <AccountMenu />
        </div>
      </header>

      <div className="flex flex-1">
        <AdminSidebar />
        <main id="main-content" className="flex-1 overflow-x-auto p-6 lg:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}
