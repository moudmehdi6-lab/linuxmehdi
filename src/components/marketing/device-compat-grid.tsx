"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Tv, Smartphone, Laptop, Tablet, MonitorSmartphone, Cast } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";

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
    <section className="py-24">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="electric">{t("eyebrow")}</Badge>
          <h2 className="mt-6 text-balance font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-4 text-balance text-muted-foreground">{t("subtitle")}</p>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {devices.map((device, index) => {
            const Icon = device.icon;
            return (
              <motion.div
                key={device.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.4, delay: index * 0.04 }}
                className="glass flex flex-col items-center gap-3 rounded-2xl px-4 py-8 text-center"
              >
                <Icon className="h-8 w-8 text-electric-light" />
                <span className="text-sm font-medium">{device.name}</span>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
