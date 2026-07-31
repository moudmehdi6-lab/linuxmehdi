"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { Bell, CheckCheck } from "lucide-react";
import type { Notification } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { markNotificationRead, markAllNotificationsRead } from "@/actions/dashboard";

export function NotificationList({
  notifications,
  locale,
}: {
  notifications: Notification[];
  locale: string;
}) {
  const t = useTranslations("dashboard.notifications");
  const [items, setItems] = React.useState(notifications);
  const [isPending, startTransition] = React.useTransition();

  const hasUnread = items.some((n) => !n.isRead);

  const handleMarkRead = (id: string) => {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
    startTransition(() => {
      void markNotificationRead(id);
    });
  };

  const handleMarkAllRead = () => {
    setItems((prev) => prev.map((n) => ({ ...n, isRead: true })));
    startTransition(() => {
      void markAllNotificationsRead();
    });
  };

  if (items.length === 0) {
    return (
      <div className="glass mt-8 rounded-2xl p-8 text-center text-sm text-muted-foreground">
        {t("empty")}
      </div>
    );
  }

  return (
    <div className="mt-8">
      {hasUnread && (
        <div className="mb-4 flex justify-end">
          <Button variant="outline" size="sm" onClick={handleMarkAllRead} disabled={isPending}>
            <CheckCheck className="h-4 w-4" />
            {t("markRead")}
          </Button>
        </div>
      )}
      <div className="space-y-3">
        {items.map((notification) => (
          <div
            key={notification.id}
            className={cn(
              "glass flex items-start gap-3 rounded-xl px-5 py-4",
              !notification.isRead && "border-gold/30",
            )}
          >
            <Bell
              className={cn(
                "mt-0.5 h-4 w-4 shrink-0",
                notification.isRead ? "text-muted-foreground" : "text-gold",
              )}
            />
            <div className="flex-1">
              <div className="font-medium">{notification.title}</div>
              <p className="mt-1 text-sm text-muted-foreground">{notification.message}</p>
              <div className="mt-2 text-xs text-muted-foreground">
                {notification.createdAt.toLocaleDateString(locale)}
              </div>
            </div>
            {!notification.isRead && (
              <button
                onClick={() => handleMarkRead(notification.id)}
                className="focus-ring shrink-0 text-xs text-gold hover:underline"
              >
                {t("markRead")}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
