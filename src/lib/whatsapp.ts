import { siteConfig, type SitePlan } from "@/lib/site-config";

function sanitizeNumber(number: string) {
  return number.replace(/[^0-9]/g, "");
}

export function buildWhatsAppLink(message: string) {
  const number = sanitizeNumber(siteConfig.whatsappNumber);
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function buildPlanWhatsAppMessage(plan: SitePlan, locale = "en") {
  const messages: Record<string, string> = {
    en: `Hi ${siteConfig.name}! I'd like to subscribe to the ${plan.name} plan (€${plan.price}). Please send me the payment and setup details.`,
    fr: `Bonjour ${siteConfig.name} ! Je souhaite m'abonner au forfait ${plan.name} (€${plan.price}). Merci de m'envoyer les détails de paiement et de configuration.`,
    de: `Hallo ${siteConfig.name}! Ich möchte den ${plan.name}-Plan (€${plan.price}) abonnieren. Bitte sende mir die Zahlungs- und Einrichtungsdetails.`,
    es: `¡Hola ${siteConfig.name}! Quiero suscribirme al plan ${plan.name} (€${plan.price}). Envíame los detalles de pago y configuración, por favor.`,
    ar: `مرحباً ${siteConfig.name}! أرغب في الاشتراك في باقة ${plan.name} (€${plan.price}). يرجى إرسال تفاصيل الدفع والإعداد.`,
  };
  return messages[locale] ?? messages.en!;
}

export function buildGeneralWhatsAppMessage(locale = "en") {
  const messages: Record<string, string> = {
    en: `Hi ${siteConfig.name}! I have a question about your streaming plans.`,
    fr: `Bonjour ${siteConfig.name} ! J'ai une question sur vos forfaits de streaming.`,
    de: `Hallo ${siteConfig.name}! Ich habe eine Frage zu euren Streaming-Plänen.`,
    es: `¡Hola ${siteConfig.name}! Tengo una pregunta sobre sus planes de streaming.`,
    ar: `مرحباً ${siteConfig.name}! لدي سؤال حول باقات البث لديكم.`,
  };
  return messages[locale] ?? messages.en!;
}

export function buildPlanWhatsAppLink(plan: SitePlan, locale = "en") {
  return buildWhatsAppLink(buildPlanWhatsAppMessage(plan, locale));
}

export function buildGeneralWhatsAppLink(locale = "en") {
  return buildWhatsAppLink(buildGeneralWhatsAppMessage(locale));
}

export function buildContactWhatsAppMessage(input: {
  name: string;
  email: string;
  message: string;
}) {
  return `Hi ${siteConfig.name}! My name is ${input.name} (${input.email}).\n\n${input.message}`;
}

export function buildContactWhatsAppLink(input: {
  name: string;
  email: string;
  message: string;
}) {
  return buildWhatsAppLink(buildContactWhatsAppMessage(input));
}
