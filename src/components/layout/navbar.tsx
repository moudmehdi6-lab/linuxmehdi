"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { AccountMenu } from "@/components/layout/account-menu";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";
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
        scrolled
          ? "glass shadow-[0_8px_30px_rgba(0,0,0,0.35)]"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <Link
          href="/"
          aria-label="IPTVLinux home"
          className="focus-ring rounded-lg transition-opacity hover:opacity-85"
        >
          <Logo />
        </Link>

        <div className="hidden items-center gap-1 rounded-full border border-white/[0.06] bg-white/[0.02] p-1 lg:flex">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "focus-ring relative rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-white/[0.06] text-gold"
                    : "text-foreground/70 hover:text-foreground",
                )}
              >
                {t(link.key)}
              </Link>
            );
          })}
        </div>

        <div className="hidden items-center gap-2.5 lg:flex">
          <LocaleSwitcher />
          <ThemeToggle />
          <AccountMenu />
          <WhatsAppCTAButton
            href={buildGeneralWhatsAppLink(locale)}
            label={t("whatsapp")}
            size="sm"
          />
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <LocaleSwitcher compact />
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

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden lg:hidden"
          >
            <div className="glass border-t border-white/10 px-6 pb-6 pt-2">
              <div className="flex flex-col gap-1">
                {navLinks.map((link) => {
                  const isActive =
                    link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "focus-ring rounded-lg px-3 py-3 text-sm font-medium transition-colors",
                        isActive ? "bg-gold/10 text-gold" : "hover:bg-white/5",
                      )}
                    >
                      {t(link.key)}
                    </Link>
                  );
                })}
              </div>
              <div className="mt-4 flex flex-col gap-3">
                <AccountMenu />
                <WhatsAppCTAButton
                  href={buildGeneralWhatsAppLink(locale)}
                  label={t("whatsapp")}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
