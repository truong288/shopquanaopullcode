import { pgTable, text, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").unique().notNull(),
  profileImageUrl: text("profile_image_url"),
  role: text("role").default("user").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const categories = pgTable("categories", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const products = pgTable("products", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  description: text("description"),
  price: text("price").notNull(),
  originalPrice: text("original_price"),
  categoryId: text("category_id").references(() => categories.id),
  imageUrls: text("image_urls").array(),
  sizes: text("sizes").array(),
  colors: text("colors").array(),
  stock: integer("stock").default(0).notNull(),
  rating: text("rating").default("0"),
  reviewCount: integer("review_count").default(0).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  isFeatured: boolean("is_featured").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const cartItems = pgTable("cart_items", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  productId: text("product_id").references(() => products.id, { onDelete: "cascade" }).notNull(),
  quantity: integer("quantity").default(1).notNull(),
  size: text("size"),
  color: text("color"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const orders = pgTable("orders", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  total: text("total").notNull(),
  status: text("status").default("pending").notNull(),
  shippingAddress: text("shipping_address").notNull(),
  phoneNumber: text("phone_number").notNull(),
  notes: text("notes"),
  province: text("province"),
  district: text("district"),
  ward: text("ward"),
  shippingFee: text("shipping_fee").default("0"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const orderItems = pgTable("order_items", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  orderId: text("order_id").references(() => orders.id, { onDelete: "cascade" }).notNull(),
  productId: text("product_id").references(() => products.id, { onDelete: "cascade" }).notNull(),
  quantity: integer("quantity").notNull(),
  price: text("price").notNull(),
  size: text("size"),
  color: text("color"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const reviews = pgTable("reviews", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  productId: text("product_id").references(() => products.id, { onDelete: "cascade" }).notNull(),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const shippingRates = pgTable("shipping_rates", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  province: text("province").notNull(),
  district: text("district").notNull(),
  ward: text("ward"),
  rate: text("rate").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Type exports
export type User = typeof users.$inferSelect;
export type Product = typeof products.$inferSelect;
export type Category = typeof categories.$inferSelect;
export type CartItem = typeof cartItems.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type OrderItem = typeof orderItems.$inferSelect;
export type Review = typeof reviews.$inferSelect;
export type ShippingRate = typeof shippingRates.$inferSelect;

// Insert type exports
export type InsertUser = typeof users.$inferInsert;
export type InsertProduct = typeof products.$inferInsert;
export type InsertCategory = typeof categories.$inferInsert;
export type InsertCartItem = typeof cartItems.$inferInsert;
export type InsertOrder = typeof orders.$inferInsert;
export type InsertOrderItem = typeof orderItems.$inferInsert;
export type InsertReview = typeof reviews.$inferInsert;
export type InsertShippingRate = typeof shippingRates.$inferInsert;

// Zod validation schemas
export const insertUserSchema = createInsertSchema(users);
export const insertProductSchema = createInsertSchema(products);
export const insertCategorySchema = createInsertSchema(categories);
export const insertCartItemSchema = createInsertSchema(cartItems);
export const insertOrderSchema = createInsertSchema(orders);
export const insertOrderItemSchema = createInsertSchema(orderItems);
export const insertReviewSchema = createInsertSchema(reviews);
export const insertShippingRateSchema = createInsertSchema(shippingRates);

export const selectUserSchema = createSelectSchema(users);
export const selectProductSchema = createSelectSchema(products);
export const selectCategorySchema = createSelectSchema(categories);
export const selectCartItemSchema = createSelectSchema(cartItems);
export const selectOrderSchema = createSelectSchema(orders);
export const selectOrderItemSchema = createSelectSchema(orderItems);
export const selectReviewSchema = createSelectSchema(reviews);
export const selectShippingRateSchema = createSelectSchema(shippingRates);