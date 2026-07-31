import { getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { prisma } from "@/lib/prisma";
import { getChannelCategoryIcon } from "@/lib/channel-category-icons";
import { safeQuery } from "@/lib/db";
import { FALLBACK_CHANNELS } from "@/lib/fallback-data";

export async function ChannelCategoriesSection() {
  const t = await getTranslations("home.channelCategories");
  const channels = await safeQuery(
    () => prisma.channel.findMany({ orderBy: { sortOrder: "asc" }, take: 8 }),
    FALLBACK_CHANNELS.slice(0, 8),
  );

  if (channels.length === 0) return null;

  return (
    <section className="py-10 sm:py-16 lg:py-24">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <Badge>{t("eyebrow")}</Badge>
          <h2 className="mt-6 text-balance font-display text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
            {t("title")}
          </h2>
          <p className="mt-5 text-balance text-lg text-muted-foreground">{t("subtitle")}</p>
        </div>

        <div className="mt-10 sm:mt-12 lg:mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {channels.map((channel) => {
            const Icon = getChannelCategoryIcon(channel.category);
            return (
              <div
                key={channel.id}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-gold/30 hover:bg-white/[0.05]"
              >
                <Icon
                  className="pointer-events-none absolute -right-3 -top-3 h-20 w-20 text-white/[0.04] transition-transform duration-500 group-hover:scale-110"
                  strokeWidth={1}
                />
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-gold/20 to-electric/20">
                  <Icon className="h-5 w-5 text-gold" />
                </div>
                <h3 className="mt-5 font-semibold">{channel.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {channel.channelCount.toLocaleString()}+ · {channel.region}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-8 flex justify-center sm:mt-10 lg:mt-12">
          <Button asChild variant="outline">
            <Link href="/channels">
              {t("viewAll")}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}
