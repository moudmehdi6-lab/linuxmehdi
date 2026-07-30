"use client";

import * as React from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";
import { WhatsAppCTAButton } from "@/components/whatsapp/whatsapp-cta-button";
import { buildGeneralWhatsAppLink } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", key: "home" },
  { href: "/features", key: "features" },
  { href: "/pricing", key: "pricing" },
  { href: "/channels", key: "channels" },
  { href: "/devices", key: "devices" },
  { href: "/blog", key: "blog" },
  { href: "/faq", key: "faq" },
] as const;

export function Navbar() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  React.useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-300",
        scrolled ? "glass shadow-lg shadow-black/20" : "border-b border-transparent",
      )}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <Link href="/" aria-label="IPTVLinux home">
          <Logo />
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "focus-ring rounded-full px-4 py-2 text-sm font-medium transition-colors hover:bg-white/5",
                  isActive ? "text-gold" : "text-foreground/80",
                )}
              >
                {t(link.key)}
              </Link>
            );
          })}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <ThemeToggle />
          <Button asChild variant="outline" size="sm">
            <Link href="/login">{t("login")}</Link>
          </Button>
          <WhatsAppCTAButton
            href={buildGeneralWhatsAppLink(locale)}
            label={t("whatsapp")}
            size="sm"
          />
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </nav>

      {open && (
        <div className="glass border-t border-white/10 px-6 pb-6 pt-2 lg:hidden">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="focus-ring rounded-lg px-3 py-3 text-sm font-medium hover:bg-white/5"
              >
                {t(link.key)}
              </Link>
            ))}
          </div>
          <div className="mt-4 flex flex-col gap-3">
            <Button asChild variant="outline">
              <Link href="/login">{t("login")}</Link>
            </Button>
            <WhatsAppCTAButton
              href={buildGeneralWhatsAppLink(locale)}
              label={t("whatsapp")}
            />
          </div>
        </div>
      )}
    </header>
  );
}
