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
  {
    slug: "choosing-the-right-plan",
    title: "Choosing the right plan for your household",
    category: "Getting Started",
    summary: "How to pick a plan duration and stream count that actually fits your household.",
    content:
      "Start by counting how many devices will realistically stream at the same time, not just how many devices exist in your home. If you're unsure how long a subscription to commit to, a shorter plan is a low-risk way to try the service before switching to a longer, better-value duration. See the Pricing page for the full breakdown of what each plan includes.",
  },
  {
    slug: "setting-up-on-a-smart-tv",
    title: "Setting up IPTV on a Smart TV without a separate box",
    category: "Device Setup",
    summary: "Using your TV's built-in app store instead of buying extra streaming hardware.",
    content:
      "Most Samsung, LG, and Android TV-based Smart TVs can run a compatible IPTV player app directly from their built-in app store, with no separate streaming box required. Search your TV's app store for a well-reviewed IPTV player, install it, and enter the credentials from your welcome message — see our Smart TV guides on the blog for brand-specific steps.",
  },
  {
    slug: "device-not-listed",
    title: "What to do if your device isn't listed anywhere",
    category: "Device Setup",
    summary: "IPTVLinux works on far more hardware than any single list can cover.",
    content:
      "If your specific device model isn't mentioned in our guides, it very likely still works — any device that can install a standard IPTV player app accepting an M3U playlist or Xtream-style login is compatible. Message us on WhatsApp with your device model and we'll confirm compatibility and point you to a suitable app.",
  },
  {
    slug: "accepted-payment-methods",
    title: "Accepted payment methods",
    category: "Billing",
    summary: "What payment options are available when you order.",
    content:
      "Payment details are confirmed directly during your WhatsApp order conversation, since accepted methods can vary by region. Our team will walk you through the available options for your location before finalizing your order — nothing is charged automatically without your confirmation.",
  },
  {
    slug: "app-crashes-or-wont-open",
    title: "An app won't open or keeps crashing",
    category: "Troubleshooting",
    summary: "The quickest fix for a player app that crashes on launch or freezes.",
    content:
      "Clear the app's cache first — this resolves the majority of crash-on-launch issues without losing your saved playlist. If clearing cache doesn't help, uninstall and reinstall the app, then re-enter your credentials. Persistent crashes across multiple reinstalls are worth reporting to us with your device model.",
  },
  {
    slug: "picture-but-no-sound",
    title: "Picture plays but there's no sound",
    category: "Troubleshooting",
    summary: "What to check when video works but audio doesn't.",
    content:
      "First, confirm your device or TV isn't muted and that the correct audio output is selected in your player app's settings. If you're using an external soundbar or receiver, check that it supports the channel's audio format — some budget sound systems only decode basic stereo audio, not full surround sound.",
  },
];

export function getKnowledgeBaseCategories() {
  return Array.from(new Set(knowledgeBaseArticles.map((a) => a.category)));
}
