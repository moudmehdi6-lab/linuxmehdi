"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { CheckCircle2, Mail, AlertCircle } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AuroraBackground } from "@/components/marketing/aurora-background";
import { newsletterSchema, type NewsletterValues } from "@/lib/validations/newsletter";
import { subscribeToNewsletter } from "@/actions/newsletter";

export function NewsletterSection() {
  const t = useTranslations("home.newsletter");
  const locale = useLocale();
  const [state, setState] = React.useState<"idle" | "success" | "error">("idle");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NewsletterValues>({ resolver: zodResolver(newsletterSchema) });

  const onSubmit = async (values: NewsletterValues) => {
    const result = await subscribeToNewsletter(values, locale);
    if (result.success) {
      setState("success");
      reset();
    } else {
      setState("error");
    }
  };

  return (
    <section className="relative overflow-hidden py-10 sm:py-16 lg:py-24">
      <AuroraBackground />
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass relative mx-auto max-w-3xl overflow-hidden rounded-3xl px-6 py-10 text-center sm:px-14 sm:py-14"
        >
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-gold/20 to-electric/20">
            <Mail className="h-5 w-5 text-gold" />
          </div>
          <h2 className="mt-6 text-balance font-display text-2xl font-semibold tracking-tight sm:text-3xl">
            {t("title")}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-balance text-muted-foreground">
            {t("subtitle")}
          </p>

          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
          >
            <div className="flex-1 text-start">
              <Input
                type="email"
                placeholder={t("placeholder")}
                aria-label={t("placeholder")}
                {...register("email")}
              />
              {errors.email && (
                <p className="mt-1.5 text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>
            <Button type="submit" disabled={isSubmitting} className="h-11 shrink-0 px-6">
              {t("submit")}
            </Button>
          </form>

          {state === "success" && (
            <p className="mt-4 flex items-center justify-center gap-2 text-sm text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
              {t("success")}
            </p>
          )}
          {state === "error" && (
            <p className="mt-4 flex items-center justify-center gap-2 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" />
              {t("error")}
            </p>
          )}
        </motion.div>
      </Container>
    </section>
  );
}
