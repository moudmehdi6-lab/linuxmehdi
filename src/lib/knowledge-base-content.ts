export type KnowledgeBaseArticle = {
  slug: string;
  title: string;
  category: "Getting Started" | "Device Setup" | "Billing" | "Troubleshooting" | "Account";
  summary: string;
  content: string;
};

export const knowledgeBaseArticles: KnowledgeBaseArticle[] = [
  {
    slug: "how-to-order-your-first-plan",
    title: "How to order your first plan",
    category: "Getting Started",
    summary: "The full walkthrough from picking a plan to receiving your credentials.",
    content:
      "Visit the Pricing page and choose a plan. Tap the WhatsApp order button — it pre-fills a message with your plan selection so you don't have to type anything. Send it, and our team confirms your order and sends setup credentials, usually within minutes during business hours.",
  },
  {
    slug: "what-happens-after-i-order",
    title: "What happens after I order",
    category: "Getting Started",
    summary: "What to expect in the minutes and hours after you send your order.",
    content:
      "After you message us, a team member confirms your plan and payment details, then activates your subscription. You'll receive a playlist URL, login credentials, and a short setup guide matched to the device you mentioned. If you don't specify a device, we'll ask.",
  },
  {
    slug: "installing-a-player-app",
    title: "Installing a compatible player app",
    category: "Device Setup",
    summary: "General guidance that applies across Android TV, Fire TV, iOS, and more.",
    content:
      "IPTVLinux doesn't require a proprietary app — any standard IPTV player that accepts an M3U playlist URL or Xtream-style login will work. Search your device's app store for a well-reviewed IPTV player, install it, and enter the credentials from your welcome message. See our Devices page for platform-specific steps.",
  },
  {
    slug: "using-multiple-devices",
    title: "Using IPTVLinux on multiple devices",
    category: "Device Setup",
    summary: "How simultaneous streams work and what to do if a device gets disconnected.",
    content:
      "Each plan supports a set number of simultaneous streams. You can install the same credentials on as many devices as you like, but only that number can stream at the same time. If a device suddenly disconnects, check whether another device in your household is also streaming.",
  },
  {
    slug: "understanding-your-invoice",
    title: "Understanding your invoice",
    category: "Billing",
    summary: "Where to find invoices and what each line item means.",
    content:
      "Once your customer dashboard account is set up, invoices for each order appear under Dashboard > Invoices. Each invoice lists the plan, duration, and total charged. If anything looks off, message us on WhatsApp with the invoice number.",
  },
  {
    slug: "renewing-your-subscription",
    title: "Renewing your subscription",
    category: "Billing",
    summary: "Subscriptions don't auto-renew — here's how renewal actually works.",
    content:
      "We don't charge automatically. A few days before your plan ends, we'll reach out on WhatsApp to ask if you'd like to renew and for how long. You choose the plan each time, with no surprise charges.",
  },
  {
    slug: "fixing-buffering-issues",
    title: "Fixing buffering issues",
    category: "Troubleshooting",
    summary: "The five-step checklist support uses internally.",
    content:
      "Restart your router, confirm your speed test shows at least 15 Mbps (25+ for 4K), switch to Ethernet or 5GHz Wi-Fi, close other bandwidth-heavy apps, and if it's still happening, message us with your device model and a speed test screenshot.",
  },
  {
    slug: "channel-not-loading",
    title: "A specific channel won't load",
    category: "Troubleshooting",
    summary: "What to check before contacting support about a single channel.",
    content:
      "First, try a different channel to confirm it's not a broader connectivity issue. Refresh your player app's channel list, since some apps cache outdated data. If only one specific channel is affected, message us the channel name — occasional individual stream issues are usually resolved within the hour.",
  },
  {
    slug: "updating-account-details",
    title: "Updating your account details",
    category: "Account",
    summary: "How to change your name, email, or password.",
    content:
      "Log in to your customer dashboard and go to Settings. You can update your name and email there, and change your password from the same page. For anything else, our support team is available on WhatsApp.",
  },
];

export function getKnowledgeBaseCategories() {
  return Array.from(new Set(knowledgeBaseArticles.map((a) => a.category)));
}
