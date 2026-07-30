"use client";

import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { WhatsAppIcon } from "@/components/whatsapp/whatsapp-icon";
import { buildGeneralWhatsAppLink } from "@/lib/whatsapp";

export function FloatingWhatsAppButton() {
  const t = useTranslations("common");
  const locale = useLocale();

  return (
    <motion.a
      href={buildGeneralWhatsAppLink(locale)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t("whatsappFloatingLabel")}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.6, type: "spring", stiffness: 260, damping: 20 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      className="focus-ring fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_8px_30px_rgba(37,211,102,0.45)] md:bottom-8 md:right-8"
    >
      <WhatsAppIcon className="h-7 w-7" />
      <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-[#25D366]/40" />
    </motion.a>
  );
}
