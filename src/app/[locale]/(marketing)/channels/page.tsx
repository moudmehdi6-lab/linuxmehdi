import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { PageHero } from "@/components/marketing/page-hero";
import { AnimatedCounter } from "@/components/marketing/animated-counter";
import { WhatsAppCTAButton } from "@/components/whatsapp/whatsapp-cta-button";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { buildGeneralWhatsAppLink } from "@/lib/whatsapp";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";
import { getChannelCategoryIcon } from "@/lib/channel-category-icons";
import { FALLBACK_CHANNELS } from "@/lib/fallback-data";

const qualityLabels: Record<string, string> = {
  SD: "SD",
  HD: "HD",
  FHD: "Full HD",
  UHD_4K: "4K UHD",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "channels" });

  return buildMetadata({
    title: t("title"),
    description: t("subtitle"),
    path: "/channels",
    locale,
  });
}

export default async function ChannelsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "channels" });
  const channels = FALLBACK_CHANNELS;
  const totalCount = channels.reduce((sum, c) => sum + c.channelCount, 0);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: `${siteConfig.url}/${locale}` },
          { name: t("title"), url: `${siteConfig.url}/${locale}/channels` },
        ]}
      />
      <PageHero eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")}>
        <div className="mx-auto mt-10 max-w-xs text-center">
          <div className="text-gradient-gold font-display text-5xl font-bold">
            <AnimatedCounter value={totalCount} suffix="+" />
          </div>
          <div className="mt-1.5 text-sm text-muted-foreground">{t("totalLabel")}</div>
        </div>
      </PageHero>

      <section className="pb-10 sm:pb-16 lg:pb-24">
        <Container>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {channels.map((channel) => {
              const Icon = getChannelCategoryIcon(channel.category);
              return (
                <div
                  key={channel.id}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-7 transition-all duration-300 hover:-translate-y-1.5 hover:border-gold/30 hover:bg-white/[0.05] hover:shadow-[0_25px_60px_-25px_rgba(212,175,55,0.3)]"
                >
                  <Icon
                    className="pointer-events-none absolute -right-4 -top-4 h-28 w-28 text-white/[0.04] transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6"
                    strokeWidth={1}
                  />
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-gold/20 to-electric/20 ring-1 ring-inset ring-white/10">
                      <Icon className="h-5 w-5 text-gold" />
                    </div>
                    <Badge variant="outline">{qualityLabels[channel.quality]}</Badge>
                  </div>

                  <h3 className="mt-5 text-lg font-semibold">{channel.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{channel.region}</p>

                  <div className="mt-4 flex items-baseline gap-1.5 border-t border-white/10 pt-4">
                    <span className="font-display text-2xl font-bold text-gold">
                      {channel.channelCount.toLocaleString(locale)}+
                    </span>
                    <span className="text-xs text-muted-foreground">{channel.category}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-16 flex justify-center">
            <WhatsAppCTAButton
              href={buildGeneralWhatsAppLink(locale)}
              label="WhatsApp"
              size="lg"
            />
          </div>
        </Container>
      </section>
    </>
  );
}
