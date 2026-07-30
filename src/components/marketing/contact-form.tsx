"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { contactFormSchema, type ContactFormValues } from "@/lib/validations/contact";
import { buildContactWhatsAppLink } from "@/lib/whatsapp";

export function ContactForm() {
  const t = useTranslations("contact");
  const [submitted, setSubmitted] = React.useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit = (values: ContactFormValues) => {
    const link = buildContactWhatsAppLink(values);
    window.open(link, "_blank", "noopener,noreferrer");
    setSubmitted(true);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div>
        <Label htmlFor="name">{t("formName")}</Label>
        <Input id="name" className="mt-2" {...register("name")} />
        {errors.name && (
          <p className="mt-1.5 text-xs text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="email">{t("formEmail")}</Label>
        <Input id="email" type="email" className="mt-2" {...register("email")} />
        {errors.email && (
          <p className="mt-1.5 text-xs text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="message">{t("formMessage")}</Label>
        <Textarea id="message" className="mt-2" {...register("message")} />
        {errors.message && (
          <p className="mt-1.5 text-xs text-destructive">{errors.message.message}</p>
        )}
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
        {t("formSubmit")}
      </Button>

      {submitted && (
        <p className="flex items-center justify-center gap-2 text-sm text-emerald-400">
          <CheckCircle2 className="h-4 w-4" />
          {t("formSuccess")}
        </p>
      )}
    </form>
  );
}
