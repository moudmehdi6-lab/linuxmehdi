import { z } from "zod";

export const planFormSchema = z.object({
  id: z.string().optional(),
  slug: z.string().trim().min(1),
  name: z.string().trim().min(1),
  durationMonths: z.coerce.number().int().min(1),
  price: z.coerce.number().min(0),
  discountPercent: z.coerce.number().int().min(0).max(100),
  badge: z.enum(["NONE", "MOST_POPULAR", "BEST_VALUE"]),
  features: z.string().trim().min(1),
  isActive: z.coerce.boolean(),
});

export const couponFormSchema = z.object({
  id: z.string().optional(),
  code: z.string().trim().min(2),
  discountType: z.enum(["PERCENT", "FIXED"]),
  discountValue: z.coerce.number().min(0),
  maxUses: z.coerce.number().int().min(0).optional(),
  expiresAt: z.string().optional(),
  isActive: z.coerce.boolean(),
});

export const blogPostFormSchema = z.object({
  id: z.string().optional(),
  title: z.string().trim().min(3),
  slug: z.string().trim().min(3),
  excerpt: z.string().trim().min(10),
  content: z.string().trim().min(20),
  categoryName: z.string().trim().min(2),
  tags: z.string().trim().optional(),
  authorId: z.string().trim().min(1),
  status: z.enum(["DRAFT", "PUBLISHED"]),
});

export const mediaAssetFormSchema = z.object({
  url: z.string().trim().url(),
  alt: z.string().trim().optional(),
  type: z.enum(["IMAGE", "SVG", "DOCUMENT"]),
});

export const seoSettingsSchema = z.object({
  defaultTitle: z.string().trim().min(1),
  titleTemplate: z.string().trim().min(1),
  defaultDescription: z.string().trim().min(1),
  ogImage: z.string().trim().optional(),
});

export const generalSettingsSchema = z.object({
  whatsappNumber: z.string().trim().min(6),
  contactEmail: z.string().trim().email(),
  twitter: z.string().trim().optional(),
  facebook: z.string().trim().optional(),
  instagram: z.string().trim().optional(),
  telegram: z.string().trim().optional(),
});

export type PlanFormValues = z.infer<typeof planFormSchema>;
export type CouponFormValues = z.infer<typeof couponFormSchema>;
export type BlogPostFormValues = z.infer<typeof blogPostFormSchema>;
export type MediaAssetFormValues = z.infer<typeof mediaAssetFormSchema>;
export type SeoSettingsValues = z.infer<typeof seoSettingsSchema>;
export type GeneralSettingsValues = z.infer<typeof generalSettingsSchema>;
