import { Tv, Cast, MonitorSmartphone, Smartphone, Laptop, type LucideIcon } from "lucide-react";

const deviceIconMap: Record<string, LucideIcon> = {
  tv: Tv,
  cast: Cast,
  "monitor-smartphone": MonitorSmartphone,
  smartphone: Smartphone,
  laptop: Laptop,
};

export function getDeviceIcon(key: string): LucideIcon {
  return deviceIconMap[key] ?? Tv;
}
