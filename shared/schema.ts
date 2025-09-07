import { pgTable, text, integer, timestamp, boolean, varchar, numeric, pgEnum } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Define enums to match database
export const orderStatus = pgEnum("order_status", ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']);
export const paymentMethod = pgEnum("payment_method", ['cod', 'bank_transfer']);

export const users = pgTable("users", {
  id: varchar().default(sql`gen_random_uuid()`).primaryKey().notNull(),
  email: varchar(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar().default('customer'),
  createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
});

export const categories = pgTable("categories", {
  id: varchar().default(sql`gen_random_uuid()`).primaryKey().notNull(),
  name: varchar().notNull(),
  slug: varchar().notNull(),
  description: text(),
  imageUrl: varchar("image_url"),
  createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
});

export const products = pgTable("products", {
  id: varchar().default(sql`gen_random_uuid()`).primaryKey().notNull(),
  name: varchar().notNull(),
  slug: varchar().notNull(),
  description: text(),
  price: numeric({ precision: 10, scale: 2 }).notNull(),
  originalPrice: numeric("original_price", { precision: 10, scale: 2 }),
  categoryId: varchar("category_id").references(() => categories.id),
  imageUrls: text("image_urls").array().default([""]),
  sizes: varchar().array().default([""]),
  colors: varchar().array().default([""]),
  stock: integer().default(0),
  isActive: boolean("is_active").default(true),
  isFeatured: boolean("is_featured").default(false),
  isNew: boolean("is_new").default(false),
  isOnSale: boolean("is_on_sale").default(false),
  isComingSoon: boolean("is_coming_soon").default(false),
  rating: numeric({ precision: 2, scale: 1 }).default('0'),
  reviewCount: integer("review_count").default(0),
  createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
});

export const cartItems = pgTable("cart_items", {
  id: varchar().default(sql`gen_random_uuid()`).primaryKey().notNull(),
  userId: varchar("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  productId: varchar("product_id").references(() => products.id, { onDelete: "cascade" }).notNull(),
  quantity: integer().notNull(),
  size: varchar(),
  color: varchar(),
  createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
});

export const orders = pgTable("orders", {
  id: varchar().default(sql`gen_random_uuid()`).primaryKey().notNull(),
  userId: varchar("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  status: orderStatus().default('pending'),
  paymentMethod: paymentMethod("payment_method").notNull(),
  paymentStatus: varchar("payment_status").default('pending'),
  subtotal: numeric({ precision: 10, scale: 2 }).notNull(),
  shippingFee: numeric("shipping_fee", { precision: 10, scale: 2 }).default('30000'),
  total: numeric({ precision: 10, scale: 2 }).notNull(),
  customerName: varchar("customer_name").notNull(),
  customerPhone: varchar("customer_phone").notNull(),
  customerEmail: varchar("customer_email"),
  shippingAddress: text("shipping_address").notNull(),
  shippingProvince: varchar("shipping_province").notNull(),
  shippingDistrict: varchar("shipping_district").notNull(),
  shippingWard: varchar("shipping_ward").notNull(),
  notes: text(),
  createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
});

export const orderItems = pgTable("order_items", {
  id: varchar().default(sql`gen_random_uuid()`).primaryKey().notNull(),
  orderId: varchar("order_id").references(() => orders.id, { onDelete: "cascade" }).notNull(),
  productId: varchar("product_id").references(() => products.id, { onDelete: "cascade" }).notNull(),
  quantity: integer().notNull(),
  price: numeric({ precision: 10, scale: 2 }).notNull(),
  size: varchar(),
  color: varchar(),
  createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
});

export const reviews = pgTable("reviews", {
  id: varchar().default(sql`gen_random_uuid()`).primaryKey().notNull(),
  productId: varchar("product_id").references(() => products.id, { onDelete: "cascade" }).notNull(),
  userId: varchar("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  orderId: varchar("order_id").references(() => orders.id),
  rating: integer().notNull(),
  comment: text(),
  isVerified: boolean("is_verified").default(false),
  createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
});

export const sessions = pgTable("sessions", {
  sid: varchar().primaryKey().notNull(),
  sess: text().notNull(), // Changed from jsonb to text to match actual schema
  expire: timestamp({ mode: 'string' }).notNull(),
});

// Type exports
export type User = typeof users.$inferSelect;
export type Product = typeof products.$inferSelect;
export type Category = typeof categories.$inferSelect;
export type CartItem = typeof cartItems.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type OrderItem = typeof orderItems.$inferSelect;
export type Review = typeof reviews.$inferSelect;

// Insert type exports
export type InsertUser = typeof users.$inferInsert;
export type InsertProduct = typeof products.$inferInsert;
export type InsertCategory = typeof categories.$inferInsert;
export type InsertCartItem = typeof cartItems.$inferInsert;
export type InsertOrder = typeof orders.$inferInsert;
export type InsertOrderItem = typeof orderItems.$inferInsert;
export type InsertReview = typeof reviews.$inferInsert;

// Zod validation schemas
export const insertUserSchema = createInsertSchema(users);
export const insertProductSchema = createInsertSchema(products, {
  price: z.string().min(1, "Price is required"),
  name: z.string().min(1, "Name is required"),
  stock: z.number().min(0, "Stock must be non-negative"),
  isNew: z.boolean().optional(),
  isOnSale: z.boolean().optional(),
  isComingSoon: z.boolean().optional(),
});
export const insertCategorySchema = createInsertSchema(categories);
export const insertCartItemSchema = createInsertSchema(cartItems);
export const insertOrderSchema = createInsertSchema(orders);
export const insertOrderItemSchema = createInsertSchema(orderItems);
export const insertReviewSchema = createInsertSchema(reviews);

export const selectUserSchema = createSelectSchema(users);
export const selectProductSchema = createSelectSchema(products);
export const selectCategorySchema = createSelectSchema(categories);
export const selectCartItemSchema = createSelectSchema(cartItems);
export const selectOrderSchema = createSelectSchema(orders);
export const selectOrderItemSchema = createSelectSchema(orderItems);
export const selectReviewSchema = createSelectSchema(reviews);