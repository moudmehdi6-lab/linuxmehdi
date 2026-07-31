"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { replyTicketSchema, type ReplyTicketValues } from "@/lib/validations/dashboard";
import { replyToTicket } from "@/actions/dashboard";

export function TicketReplyForm({ ticketId }: { ticketId: string }) {
  const t = useTranslations("dashboard.support");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<ReplyTicketValues>({
    resolver: zodResolver(replyTicketSchema),
    defaultValues: { ticketId },
  });

  const onSubmit = async (values: ReplyTicketValues) => {
    await replyToTicket({ ...values, ticketId });
    reset({ ticketId, message: "" });
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex gap-3" noValidate>
      <Textarea
        placeholder={t("message")}
        className="min-h-20"
        {...register("message")}
      />
      <Button type="submit" disabled={isSubmitting} className="self-end">
        {t("send")}
      </Button>
    </form>
  );
}
