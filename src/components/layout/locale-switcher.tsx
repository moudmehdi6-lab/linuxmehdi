"use client";

import { useLocale } from "next-intl";
import { Check, ChevronDown } from "lucide-react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { locales, localeNames, localeFlags, type Locale } from "@/i18n/routing";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export function LocaleSwitcher({ compact = false }: { compact?: boolean }) {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          aria-label="Change language"
          className={cn(
            "focus-ring flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] text-sm font-medium text-foreground/80 transition-colors hover:border-white/20 hover:bg-white/5 hover:text-foreground",
            compact ? "h-10 w-10 justify-center px-0" : "h-10 px-3",
          )}
        >
          <span className="text-base leading-none">{localeFlags[locale]}</span>
          {!compact && <span className="hidden sm:inline">{localeNames[locale]}</span>}
          {!compact && <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-56">
        {locales.map((l) => (
          <DropdownMenuItem
            key={l}
            onClick={() => router.replace(pathname, { locale: l })}
            className="justify-between"
          >
            <span className="flex items-center gap-3">
              <span className="text-base leading-none">{localeFlags[l]}</span>
              <span>{localeNames[l]}</span>
            </span>
            {l === locale && <Check className="h-4 w-4 text-gold" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
