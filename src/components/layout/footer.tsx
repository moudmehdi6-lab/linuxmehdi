import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/container";
import { Logo } from "@/components/layout/logo";
import { WhatsAppCTAButton } from "@/components/whatsapp/whatsapp-cta-button";
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

  return (
    <footer className="border-t border-white/10 bg-black/40">
      <Container className="py-16">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-6">
          <div className="lg:col-span-2">
            <Logo />
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              {t("tagline")}
            </p>
            <div className="mt-6">
              <WhatsAppCTAButton
                href={buildGeneralWhatsAppLink(locale)}
                label="WhatsApp"
                size="sm"
              />
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-semibold text-foreground">{col.title}</h3>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="focus-ring text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-10" />

        <div className="flex flex-col gap-4 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {siteConfig.name}. {t("rights")}
          </p>
          <p className="max-w-2xl md:text-right">{t("disclaimer")}</p>
        </div>
      </Container>
    </footer>
  );
}
