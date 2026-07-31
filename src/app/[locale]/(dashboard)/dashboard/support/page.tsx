import { getTranslations, setRequestLocale } from "next-intl/server";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/i18n/navigation";
import { NewTicketForm } from "@/components/dashboard/new-ticket-form";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function SupportPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("dashboard.support");
  const session = await auth();

  const tickets = await prisma.supportTicket.findMany({
    where: { userId: session!.user.id },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold">{t("title")}</h1>
      <p className="mt-1 text-muted-foreground">{t("subtitle")}</p>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
        <div>
          {tickets.length === 0 ? (
            <div className="glass rounded-2xl p-8 text-center text-sm text-muted-foreground">
              {t("empty")}
            </div>
          ) : (
            <div className="space-y-3">
              {tickets.map((ticket) => (
                <Link
                  key={ticket.id}
                  href={`/dashboard/support/${ticket.id}`}
                  className="glass flex items-center justify-between rounded-xl px-5 py-4 transition-colors hover:border-white/25"
                >
                  <div>
                    <div className="font-medium">{ticket.subject}</div>
                    <div className="text-xs text-muted-foreground">
                      {ticket.updatedAt.toLocaleDateString(locale)}
                    </div>
                  </div>
                  <Badge variant="outline">{t(`status.${ticket.status}`)}</Badge>
                </Link>
              ))}
            </div>
          )}
        </div>

        <NewTicketForm />
      </div>
    </div>
  );
}
