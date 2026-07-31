"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "@/i18n/navigation";
import { forgotPasswordSchema, type ForgotPasswordValues } from "@/lib/validations/auth";
import { requestPasswordReset } from "@/actions/auth";

export function ForgotPasswordForm() {
  const t = useTranslations("auth.forgotPassword");
  const [success, setSuccess] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordValues>({ resolver: zodResolver(forgotPasswordSchema) });

  const onSubmit = async (values: ForgotPasswordValues) => {
    await requestPasswordReset(values);
    setSuccess(true);
  };

  if (success) {
    return (
      <div>
        <p className="flex items-center gap-2 text-sm text-emerald-400">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          {t("success")}
        </p>
        <Link href="/login" className="mt-4 inline-block text-sm text-gold hover:underline">
          {t("backToLogin")}
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div>
        <Label htmlFor="email">{t("email")}</Label>
        <Input id="email" type="email" className="mt-2" {...register("email")} />
        {errors.email && (
          <p className="mt-1.5 text-xs text-destructive">{errors.email.message}</p>
        )}
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
        {t("submit")}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        <Link href="/login" className="hover:text-foreground">
          {t("backToLogin")}
        </Link>
      </p>
    </form>
  );
}
