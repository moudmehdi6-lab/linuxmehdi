"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { Search } from "lucide-react";
import type { FAQ } from "@/lib/fallback-data";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function FaqBrowser({ faqs }: { faqs: FAQ[] }) {
  const t = useTranslations("faqPage");
  const [query, setQuery] = React.useState("");

  const categories = Array.from(new Set(faqs.map((f) => f.category)));

  const filtered = faqs.filter((faq) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      faq.question.toLowerCase().includes(q) || faq.answer.toLowerCase().includes(q)
    );
  });

  return (
    <div>
      <div className="relative mx-auto max-w-xl">
        <Search className="absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("searchPlaceholder")}
          className="ps-11"
          aria-label={t("searchPlaceholder")}
        />
      </div>

      {filtered.length === 0 ? (
        <p className="mt-12 text-center text-muted-foreground">{t("noResults")}</p>
      ) : (
        <div className="mt-12 space-y-10">
          {categories.map((category) => {
            const items = filtered.filter((f) => f.category === category);
            if (items.length === 0) return null;
            return (
              <div key={category}>
                <h2 className="text-lg font-semibold">
                  {t.has(`categories.${category}`)
                    ? t(`categories.${category}`)
                    : category}
                </h2>
                <Accordion type="single" collapsible className="mt-3">
                  {items.map((faq) => (
                    <AccordionItem key={faq.id} value={faq.id}>
                      <AccordionTrigger>{faq.question}</AccordionTrigger>
                      <AccordionContent>{faq.answer}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
