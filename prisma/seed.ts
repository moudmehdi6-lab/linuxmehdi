import { PrismaClient, PlanBadge } from "@prisma/client";
import { plans } from "../src/lib/site-config";
import { testimonials, pricingFaqs } from "../src/lib/marketing-content";

const prisma = new PrismaClient();

async function main() {
  for (const [index, plan] of plans.entries()) {
    await prisma.plan.upsert({
      where: { slug: plan.slug },
      update: {
        name: plan.name,
        durationMonths: plan.durationMonths,
        price: plan.price,
        currency: plan.currency,
        discountPercent: plan.discountPercent,
        badge: plan.badge as PlanBadge,
        features: plan.features,
        sortOrder: index,
      },
      create: {
        slug: plan.slug,
        name: plan.name,
        durationMonths: plan.durationMonths,
        price: plan.price,
        currency: plan.currency,
        discountPercent: plan.discountPercent,
        badge: plan.badge as PlanBadge,
        features: plan.features,
        sortOrder: index,
      },
    });
  }

  for (const testimonial of testimonials) {
    const existing = await prisma.testimonial.findFirst({
      where: { name: testimonial.name, content: testimonial.content },
    });
    if (!existing) {
      await prisma.testimonial.create({
        data: {
          name: testimonial.name,
          rating: testimonial.rating,
          content: testimonial.content,
          isFeatured: true,
        },
      });
    }
  }

  for (const [index, faq] of pricingFaqs.entries()) {
    const existing = await prisma.fAQ.findFirst({
      where: { question: faq.question },
    });
    if (!existing) {
      await prisma.fAQ.create({
        data: {
          question: faq.question,
          answer: faq.answer,
          category: "pricing",
          sortOrder: index,
        },
      });
    }
  }

  await prisma.siteSettings.upsert({
    where: { key: "general" },
    update: {},
    create: {
      key: "general",
      value: {
        whatsappNumber: "34603171403",
        contactEmail: "support@iptvlinux.com",
        socialLinks: {
          twitter: "https://twitter.com/iptvlinux",
          facebook: "https://facebook.com/iptvlinux",
          instagram: "https://instagram.com/iptvlinux",
          telegram: "https://t.me/iptvlinux",
        },
        enabledLocales: ["en"],
      },
    },
  });

  console.log("Seed complete.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
