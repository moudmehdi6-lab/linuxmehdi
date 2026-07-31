import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/i18n/navigation";
import { TicketReplyForm } from "@/components/dashboard/ticket-reply-form";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";
import { safeQuery } from "@/lib/db";

export default async function TicketDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("dashboard.support");
  const session = await auth();

  const ticket = await safeQuery(
    () =>
      prisma.supportTicket.findFirst({
        where: { id, userId: session!.user.id },
        include: { messages: { orderBy: { createdAt: "asc" } } },
      }),
    null,
  );

  if (!ticket) notFound();

  return (
    <div>
      <Link
        href="/dashboard/support"
        className="focus-ring inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        {t("backToTickets")}
      </Link>

      <div className="mt-4 flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold">{ticket.subject}</h1>
        <Badge variant="outline">{t(`status.${ticket.status}`)}</Badge>
      </div>

      <div className="mt-8 space-y-4">
        {ticket.messages.map((message) => {
          const isMine = message.senderId === session!.user.id;
          return (
            <div
              key={message.id}
              className={cn("flex", isMine ? "justify-end" : "justify-start")}
            >
              <div
                className={cn(
                  "max-w-md rounded-2xl px-4 py-3 text-sm",
                  isMine ? "bg-gold text-obsidian" : "glass",
                )}
              >
                <p>{message.message}</p>
                <div
                  className={cn(
                    "mt-1.5 text-xs",
                    isMine ? "text-obsidian/60" : "text-muted-foreground",
                  )}
                >
                  {message.createdAt.toLocaleString(locale)}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <TicketReplyForm ticketId={ticket.id} />
    </div>
  );
}
