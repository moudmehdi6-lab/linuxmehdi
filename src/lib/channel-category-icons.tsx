import { Tv2, Trophy, Newspaper, Baby, Compass, Film, Music2, Globe2, type LucideIcon } from "lucide-react";

export const channelCategoryIcons: Record<string, LucideIcon> = {
  Entertainment: Tv2,
  Sports: Trophy,
  News: Newspaper,
  Kids: Baby,
  Documentary: Compass,
  VOD: Film,
  Music: Music2,
  International: Globe2,
  Business: Newspaper,
  Religious: Compass,
  Lifestyle: Compass,
  Gaming: Tv2,
};

export function getChannelCategoryIcon(category: string): LucideIcon {
  return channelCategoryIcons[category] ?? Tv2;
}
