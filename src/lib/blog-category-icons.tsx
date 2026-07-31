import {
  Tv,
  Smartphone,
  ShieldCheck,
  Wrench,
  GitCompare,
  Sparkles,
  Cast,
  Flame,
  Newspaper,
  GraduationCap,
  type LucideIcon,
} from "lucide-react";

const rules: [RegExp, LucideIcon][] = [
  [/android tv|google tv|fire tv|apple tv|smart tv/i, Tv],
  [/vpn/i, ShieldCheck],
  [/troubleshoot/i, Wrench],
  [/compariso/i, GitCompare],
  [/entertainment/i, Sparkles],
  [/technology/i, Cast],
  [/streaming tips/i, Flame],
  [/tutorial/i, GraduationCap],
  [/mobile|phone/i, Smartphone],
];

export function getBlogCategoryIcon(categoryName: string): LucideIcon {
  const match = rules.find(([pattern]) => pattern.test(categoryName));
  return match ? match[1] : Newspaper;
}
