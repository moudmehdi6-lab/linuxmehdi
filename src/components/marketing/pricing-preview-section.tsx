import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PricingGrid } from "@/components/marketing/pricing-grid";
import { ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { toSitePlan } from "@/lib/mappers";

export async function PricingPreviewSection() {
  const t = await getTranslations("home.pricingPreview");
  const dbPlans = await prisma.plan.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });
  const plans = dbPlans.map(toSitePlan);

  return (
    <section className="py-10 sm:py-16 lg:py-24">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="electric">{t("eyebrow")}</Badge>
          <h2 className="mt-6 text-balance font-display text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
            {t("title")}
          </h2>
          <p className="mt-5 text-balance text-lg text-muted-foreground">{t("subtitle")}</p>
        </div>

        <div className="mt-10 sm:mt-12 lg:mt-14">
          <PricingGrid plans={plans} />
        </div>

        <div className="mt-8 flex justify-center sm:mt-10 lg:mt-12">
          <Button asChild variant="outline">
            <Link href="/pricing">
              {t("viewAll")}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}
