import { z } from "zod";

export const productCategorySchema = z.enum([
  "smartphones",
  "laptops",
  "tablets",
  "mobile-accessories",
]);

export const productSchema = z.object({
  id: z.number().int().positive(),
  title: z.string().min(1),
  description: z.string(),
  category: productCategorySchema,
  price: z.number().nonnegative(),
  discountPercentage: z.number().nonnegative().optional(),
  rating: z.number().min(0).max(5).optional(),
  stock: z.number().int().nonnegative(),
  brand: z.string().optional(),
  thumbnail: z.string().url(),
  images: z.array(z.string().url()).default([]),
  warrantyInformation: z.string().optional(),
  shippingInformation: z.string().optional(),
  availabilityStatus: z.string().optional(),
  dimensions: z.object({
    width: z.number(),
    height: z.number(),
    depth: z.number(),
  }).optional(),
});

export const productListSchema = z.object({
  products: z.array(productSchema),
  total: z.number().int().nonnegative(),
  skip: z.number().int().nonnegative(),
  limit: z.number().int().nonnegative(),
});

export const providerProductListSchema = z.object({
  products: z.array(productSchema.extend({ category: z.string().min(1) })),
  total: z.number().int().nonnegative(),
  skip: z.number().int().nonnegative(),
  limit: z.number().int().nonnegative(),
});

export const productQuerySchema = z.object({
  q: z.string().trim().max(100).optional(),
  category: productCategorySchema.optional(),
  limit: z.coerce.number().int().min(1).max(50).default(12),
  skip: z.coerce.number().int().min(0).max(10000).default(0),
  sortBy: z.enum(["price", "rating", "title"]).optional(),
  order: z.enum(["asc", "desc"]).default("asc"),
});
