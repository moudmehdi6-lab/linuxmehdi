"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createTicketSchema, type CreateTicketValues } from "@/lib/validations/dashboard";
import { createSupportTicket } from "@/actions/dashboard";

export function NewTicketForm() {
  const t = useTranslations("dashboard.support");
  const router = useRouter();
  const [error, setError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateTicketValues>({ resolver: zodResolver(createTicketSchema) });

  const onSubmit = async (values: CreateTicketValues) => {
    setError(null);
    const result = await createSupportTicket(values);
    if (!result.success) {
      setError(result.error);
      return;
    }
    router.push(`/dashboard/support/${result.ticketId}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t("newTicket")}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div>
            <Label htmlFor="subject">{t("subject")}</Label>
            <Input id="subject" className="mt-2" {...register("subject")} />
            {errors.subject && (
              <p className="mt-1.5 text-xs text-destructive">{errors.subject.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="message">{t("message")}</Label>
            <Textarea id="message" className="mt-2" {...register("message")} />
            {errors.message && (
              <p className="mt-1.5 text-xs text-destructive">{errors.message.message}</p>
            )}
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" disabled={isSubmitting}>
            {t("submit")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
