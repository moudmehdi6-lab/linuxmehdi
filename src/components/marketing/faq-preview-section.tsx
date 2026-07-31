import { getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Link } from "@/i18n/navigation";
import { prisma } from "@/lib/prisma";

export async function FaqPreviewSection() {
  const t = await getTranslations("home.faqPreview");
  const faqs = await prisma.fAQ.findMany({
    orderBy: { sortOrder: "asc" },
    take: 6,
  });

  if (faqs.length === 0) return null;

  return (
    <section className="py-10 sm:py-16 lg:py-24">
      <Container className="max-w-3xl">
        <div className="mx-auto max-w-2xl text-center">
          <Badge>{t("eyebrow")}</Badge>
          <h2 className="mt-6 text-balance font-display text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
            {t("title")}
          </h2>
          <p className="mt-5 text-balance text-lg text-muted-foreground">{t("subtitle")}</p>
        </div>

        <div className="glass mt-8 rounded-3xl sm:mt-10 lg:mt-14 px-6 py-2 sm:px-10">
          <Accordion type="single" collapsible>
            {faqs.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="mt-6 flex justify-center sm:mt-8 lg:mt-10">
          <Button asChild variant="outline">
            <Link href="/faq">
              {t("viewAll")}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}
