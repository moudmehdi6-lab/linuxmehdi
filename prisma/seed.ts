import {
  PrismaClient,
  PlanBadge,
  ContentStatus,
  ChannelQuality,
  IncidentStatus,
  IncidentSeverity,
} from "@prisma/client";
import { plans } from "../src/lib/site-config";
import {
  fullFaqs,
  moreTestimonials,
  statusIncidents,
  channels,
  devices,
  blogAuthors,
  blogPosts,
} from "./seed-data";

const prisma = new PrismaClient();

function wordsPerMinute(html: string) {
  const text = html.replace(/<[^>]+>/g, " ");
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

async function main() {
  // Plans
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

  // Testimonials
  for (const testimonial of moreTestimonials) {
    const existing = await prisma.testimonial.findFirst({
      where: { name: testimonial.name, content: testimonial.content },
    });
    if (!existing) {
      await prisma.testimonial.create({
        data: {
          name: testimonial.name,
          role: testimonial.role,
          rating: testimonial.rating,
          content: testimonial.content,
          isFeatured: true,
        },
      });
    }
  }

  // FAQs
  for (const [index, faq] of fullFaqs.entries()) {
    const existing = await prisma.fAQ.findFirst({ where: { question: faq.question } });
    if (!existing) {
      await prisma.fAQ.create({
        data: {
          question: faq.question,
          answer: faq.answer,
          category: faq.category,
          sortOrder: index,
        },
      });
    }
  }

  // Status incidents
  for (const incident of statusIncidents) {
    const existing = await prisma.statusIncident.findFirst({
      where: { title: incident.title },
    });
    if (!existing) {
      await prisma.statusIncident.create({
        data: {
          ...incident,
          status: incident.status as IncidentStatus,
          severity: incident.severity as IncidentSeverity,
        },
      });
    }
  }

  // Channels
  for (const [index, channel] of channels.entries()) {
    const existing = await prisma.channel.findFirst({ where: { name: channel.name } });
    if (!existing) {
      await prisma.channel.create({
        data: { ...channel, quality: channel.quality as ChannelQuality, sortOrder: index },
      });
    }
  }

  // Devices
  for (const device of devices) {
    const existing = await prisma.device.findFirst({ where: { platform: device.platform } });
    if (!existing) {
      await prisma.device.create({ data: device });
    }
  }

  // Blog authors
  const authorIdBySlug = new Map<string, string>();
  for (const author of blogAuthors) {
    const record = await prisma.author.upsert({
      where: { slug: author.slug },
      update: { name: author.name, bio: author.bio, socialLinks: author.socialLinks },
      create: {
        slug: author.slug,
        name: author.name,
        bio: author.bio,
        socialLinks: author.socialLinks,
      },
    });
    authorIdBySlug.set(author.slug, record.id);
  }

  // Blog categories + tags + posts
  const categoryIdBySlug = new Map<string, string>();
  const now = Date.now();

  for (const post of blogPosts) {
    let categoryId = categoryIdBySlug.get(post.categorySlug);
    if (!categoryId) {
      const category = await prisma.blogCategory.upsert({
        where: { slug: post.categorySlug },
        update: { name: post.categoryName },
        create: { slug: post.categorySlug, name: post.categoryName },
      });
      categoryId = category.id;
      categoryIdBySlug.set(post.categorySlug, categoryId);
    }

    const tagIds: string[] = [];
    for (const tagName of post.tags) {
      const slug = tagName.toLowerCase().replace(/\s+/g, "-");
      const tag = await prisma.blogTag.upsert({
        where: { slug },
        update: { name: tagName },
        create: { slug, name: tagName },
      });
      tagIds.push(tag.id);
    }

    const publishedAt = new Date(now - post.publishedDaysAgo * 24 * 60 * 60 * 1000);

    const existingPost = await prisma.blogPost.findUnique({ where: { slug: post.slug } });
    const data = {
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      authorId: authorIdBySlug.get(post.authorSlug)!,
      categoryId,
      status: ContentStatus.PUBLISHED,
      publishedAt,
      readingTimeMins: wordsPerMinute(post.content),
      seoTitle: post.title,
      seoDescription: post.excerpt,
    };

    if (existingPost) {
      await prisma.blogPost.update({ where: { id: existingPost.id }, data });
      await prisma.blogPostTag.deleteMany({ where: { postId: existingPost.id } });
      await prisma.blogPostTag.createMany({
        data: tagIds.map((tagId) => ({ postId: existingPost.id, tagId })),
      });
    } else {
      const created = await prisma.blogPost.create({ data: { ...data, slug: post.slug } });
      await prisma.blogPostTag.createMany({
        data: tagIds.map((tagId) => ({ postId: created.id, tagId })),
      });
    }
  }

  // Site settings
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
