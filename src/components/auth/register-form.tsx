"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "@/i18n/navigation";
import { registerSchema, type RegisterValues } from "@/lib/validations/auth";
import { registerUser } from "@/actions/auth";

export function RegisterForm() {
  const t = useTranslations("auth.register");
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (values: RegisterValues) => {
    setError(null);
    const result = await registerUser(values);
    if (!result.success) {
      setError(result.error);
      return;
    }
    setSuccess(true);
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div>
        <Label htmlFor="name">{t("name")}</Label>
        <Input id="name" className="mt-2" {...register("name")} />
        {errors.name && (
          <p className="mt-1.5 text-xs text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="email">{t("email")}</Label>
        <Input id="email" type="email" className="mt-2" {...register("email")} />
        {errors.email && (
          <p className="mt-1.5 text-xs text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="password">{t("password")}</Label>
        <Input id="password" type="password" className="mt-2" {...register("password")} />
        {errors.password && (
          <p className="mt-1.5 text-xs text-destructive">{errors.password.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="confirmPassword">{t("confirmPassword")}</Label>
        <Input
          id="confirmPassword"
          type="password"
          className="mt-2"
          {...register("confirmPassword")}
        />
        {errors.confirmPassword && (
          <p className="mt-1.5 text-xs text-destructive">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {error && (
        <p className="flex items-center gap-2 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          {error}
        </p>
      )}

      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
        {t("submit")}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        {t("hasAccount")}{" "}
        <Link href="/login" className="font-medium text-gold hover:underline">
          {t("login")}
        </Link>
      </p>
    </form>
  );
}
