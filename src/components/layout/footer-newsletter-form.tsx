"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations, useLocale } from "next-intl";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { newsletterSchema, type NewsletterValues } from "@/lib/validations/newsletter";
import { subscribeToNewsletter } from "@/actions/newsletter";

export function FooterNewsletterForm() {
  const t = useTranslations("home.newsletter");
  const locale = useLocale();
  const [success, setSuccess] = React.useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NewsletterValues>({ resolver: zodResolver(newsletterSchema) });

  const onSubmit = async (values: NewsletterValues) => {
    const result = await subscribeToNewsletter(values, locale);
    if (result.success) {
      setSuccess(true);
      reset();
    }
  };

  if (success) {
    return (
      <p className="flex items-center gap-2 text-sm text-emerald-400">
        <CheckCircle2 className="h-4 w-4 shrink-0" />
        {t("success")}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          type="email"
          placeholder={t("placeholder")}
          aria-label={t("placeholder")}
          className="sm:w-56"
          {...register("email")}
        />
        <Button type="submit" variant="outline" size="sm" disabled={isSubmitting} className="shrink-0">
          {t("submit")}
          <ArrowRight className="h-3.5 w-3.5" />
        </Button>
      </div>
      {errors.email && <p className="mt-1.5 text-xs text-destructive">{errors.email.message}</p>}
    </form>
  );
}
