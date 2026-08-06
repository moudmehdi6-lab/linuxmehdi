import { useTranslations, useLocale } from "next-intl";
import { Twitter, Facebook, Instagram, Send, ArrowUpRight, Mail } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/container";
import { Logo } from "@/components/layout/logo";
import { WhatsAppCTAButton } from "@/components/whatsapp/whatsapp-cta-button";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import { FooterNewsletterForm } from "@/components/layout/footer-newsletter-form";
import { Separator } from "@/components/ui/separator";
import { buildGeneralWhatsAppLink } from "@/lib/whatsapp";
import { siteConfig } from "@/lib/site-config";

export function Footer() {
  const t = useTranslations("footer");
  const locale = useLocale();
  const year = new Date().getFullYear();

  const columns = [
    {
      title: t("product"),
      links: [
        { href: "/features", label: t("features") },
        { href: "/pricing", label: t("pricing") },
        { href: "/channels", label: t("channels") },
        { href: "/devices", label: t("devices") },
        { href: "/downloads", label: t("downloads") },
      ],
    },
    {
      title: t("company"),
      links: [
        { href: "/about", label: t("about") },
        { href: "/contact", label: t("contact") },
        { href: "/affiliate-program", label: t("affiliateProgram") },
        { href: "/reseller-program", label: t("resellerProgram") },
      ],
    },
    {
      title: t("resources"),
      links: [
        { href: "/blog", label: t("blog") },
        { href: "/blog/glossary", label: t("glossary") },
        { href: "/knowledge-base", label: t("knowledgeBase") },
        { href: "/faq", label: t("faq") },
        { href: "/status", label: t("status") },
      ],
    },
    {
      title: t("legal"),
      links: [
        { href: "/privacy-policy", label: t("privacyPolicy") },
        { href: "/terms", label: t("terms") },
        { href: "/refund-policy", label: t("refundPolicy") },
        { href: "/cookie-policy", label: t("cookiePolicy") },
      ],
    },
  ];

  const socialLinks = [
    { href: siteConfig.social.twitter, icon: Twitter, label: "Twitter" },
    { href: siteConfig.social.facebook, icon: Facebook, label: "Facebook" },
    { href: siteConfig.social.instagram, icon: Instagram, label: "Instagram" },
    { href: siteConfig.social.telegram, icon: Send, label: "Telegram" },
  ];

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-black/40">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent"
        aria-hidden
      />
      <Container className="py-10 sm:py-14 lg:py-20">
        <div className="glass flex flex-col items-center gap-5 rounded-3xl px-6 py-8 text-center sm:flex-row sm:justify-between sm:text-left">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-gold/20 to-electric/20">
              <Mail className="h-5 w-5 text-gold" />
            </div>
            <div>
              <div className="font-semibold">{t("newsletterTitle")}</div>
              <div className="text-sm text-muted-foreground">{t("newsletterSubtitle")}</div>
            </div>
          </div>
          <FooterNewsletterForm />
        </div>

        <div className="mt-10 grid grid-cols-1 gap-10 sm:mt-12 lg:mt-16 lg:grid-cols-6">
          <div className="lg:col-span-2">
            <Logo />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted-foreground">
              {t("tagline")}
            </p>
            <div className="mt-7">
              <WhatsAppCTAButton
                href={buildGeneralWhatsAppLink(locale)}
                label="WhatsApp"
                size="sm"
              />
            </div>
            <div className="mt-8 flex items-center gap-2">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="focus-ring flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-muted-foreground transition-colors hover:border-gold/40 hover:text-gold"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {col.title}
              </h3>
              <ul className="mt-5 space-y-3.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="focus-ring group inline-flex items-center gap-1 text-sm text-foreground/75 transition-colors hover:text-gold"
                    >
                      {link.label}
                      <ArrowUpRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-8 sm:my-10 lg:my-12" />

        <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
          <p className="text-xs text-muted-foreground">
            © {year} {siteConfig.name}. {t("rights")}
          </p>
          <LocaleSwitcher />
        </div>
        <p className="mt-6 text-center text-xs text-muted-foreground md:text-right">
          {t("disclaimer")}
        </p>
      </Container>
    </footer>
  );
}
