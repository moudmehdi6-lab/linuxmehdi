"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Tv, Smartphone, Laptop, Tablet, MonitorSmartphone, Cast, ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/i18n/navigation";

const devices = [
  { name: "Android TV", icon: Tv },
  { name: "Google TV", icon: Cast },
  { name: "Fire TV", icon: MonitorSmartphone },
  { name: "Smart TV", icon: Tv },
  { name: "Apple TV", icon: Tv },
  { name: "Mobile", icon: Smartphone },
  { name: "Tablet", icon: Tablet },
  { name: "Desktop", icon: Laptop },
];

export function DeviceCompatGrid() {
  const t = useTranslations("home.devices");

  return (
    <section className="py-10 sm:py-16 lg:py-24">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="electric">{t("eyebrow")}</Badge>
          <h2 className="mt-6 text-balance font-display text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
            {t("title")}
          </h2>
          <p className="mt-5 text-balance text-lg text-muted-foreground">{t("subtitle")}</p>
        </div>

        <div className="mt-10 sm:mt-12 lg:mt-14 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {devices.map((device, index) => {
            const Icon = device.icon;
            return (
              <motion.div
                key={device.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.4, delay: index * 0.04 }}
              >
                <Link
                  href="/devices"
                  className="group focus-ring relative flex flex-col items-center gap-3.5 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-9 text-center transition-all duration-300 hover:-translate-y-1 hover:border-electric/40 hover:bg-white/[0.06] hover:shadow-[0_20px_50px_-20px_rgba(37,99,235,0.35)]"
                >
                  <ArrowUpRight className="absolute end-3 top-3 h-3.5 w-3.5 text-muted-foreground opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-electric/20 to-gold/10 ring-1 ring-inset ring-white/10 transition-transform duration-300 group-hover:scale-110">
                    <Icon className="h-6 w-6 text-electric-light" />
                  </div>
                  <span className="text-sm font-medium">{device.name}</span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
