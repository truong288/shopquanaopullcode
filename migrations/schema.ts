import { pgTable, foreignKey, varchar, integer, text, boolean, timestamp, index, jsonb, unique, numeric, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const orderStatus = pgEnum("order_status", ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'])
export const paymentMethod = pgEnum("payment_method", ['cod', 'bank_transfer'])


export const reviews = pgTable("reviews", {
	id: varchar().default(gen_random_uuid()).primaryKey().notNull(),
	productId: varchar("product_id").notNull(),
	userId: varchar("user_id").notNull(),
	orderId: varchar("order_id"),
	rating: integer().notNull(),
	comment: text(),
	isVerified: boolean("is_verified").default(false),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.productId],
			foreignColumns: [products.id],
			name: "reviews_product_id_products_id_fk"
		}),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "reviews_user_id_users_id_fk"
		}),
	foreignKey({
			columns: [table.orderId],
			foreignColumns: [orders.id],
			name: "reviews_order_id_orders_id_fk"
		}),
]);

export const sessions = pgTable("sessions", {
	sid: varchar().primaryKey().notNull(),
	sess: jsonb().notNull(),
	expire: timestamp({ mode: 'string' }).notNull(),
}, (table) => [
	index("IDX_session_expire").using("btree", table.expire.asc().nullsLast().op("timestamp_ops")),
]);

export const users = pgTable("users", {
	id: varchar().default(gen_random_uuid()).primaryKey().notNull(),
	email: varchar(),
	firstName: varchar("first_name"),
	lastName: varchar("last_name"),
	profileImageUrl: varchar("profile_image_url"),
	role: varchar().default('customer'),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	unique("users_email_unique").on(table.email),
]);

export const cartItems = pgTable("cart_items", {
	id: varchar().default(gen_random_uuid()).primaryKey().notNull(),
	userId: varchar("user_id").notNull(),
	productId: varchar("product_id").notNull(),
	quantity: integer().notNull(),
	size: varchar(),
	color: varchar(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "cart_items_user_id_users_id_fk"
		}),
	foreignKey({
			columns: [table.productId],
			foreignColumns: [products.id],
			name: "cart_items_product_id_products_id_fk"
		}),
]);

export const products = pgTable("products", {
	id: varchar().default(gen_random_uuid()).primaryKey().notNull(),
	name: varchar().notNull(),
	slug: varchar().notNull(),
	description: text(),
	price: numeric({ precision: 10, scale:  2 }).notNull(),
	originalPrice: numeric("original_price", { precision: 10, scale:  2 }),
	categoryId: varchar("category_id"),
	imageUrls: text("image_urls").array().default([""]),
	sizes: varchar().array().default([""]),
	colors: varchar().array().default([""]),
	stock: integer().default(0),
	isActive: boolean("is_active").default(true),
	isFeatured: boolean("is_featured").default(false),
	rating: numeric({ precision: 2, scale:  1 }).default('0'),
	reviewCount: integer("review_count").default(0),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.categoryId],
			foreignColumns: [categories.id],
			name: "products_category_id_categories_id_fk"
		}),
	unique("products_slug_unique").on(table.slug),
]);

export const orders = pgTable("orders", {
	id: varchar().default(gen_random_uuid()).primaryKey().notNull(),
	userId: varchar("user_id").notNull(),
	status: orderStatus().default('pending'),
	paymentMethod: paymentMethod("payment_method").notNull(),
	paymentStatus: varchar("payment_status").default('pending'),
	subtotal: numeric({ precision: 10, scale:  2 }).notNull(),
	shippingFee: numeric("shipping_fee", { precision: 10, scale:  2 }).default('30000'),
	total: numeric({ precision: 10, scale:  2 }).notNull(),
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
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "orders_user_id_users_id_fk"
		}),
]);

export const orderItems = pgTable("order_items", {
	id: varchar().default(gen_random_uuid()).primaryKey().notNull(),
	orderId: varchar("order_id").notNull(),
	productId: varchar("product_id").notNull(),
	quantity: integer().notNull(),
	price: numeric({ precision: 10, scale:  2 }).notNull(),
	size: varchar(),
	color: varchar(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.orderId],
			foreignColumns: [orders.id],
			name: "order_items_order_id_orders_id_fk"
		}),
	foreignKey({
			columns: [table.productId],
			foreignColumns: [products.id],
			name: "order_items_product_id_products_id_fk"
		}),
]);

export const categories = pgTable("categories", {
	id: varchar().default(gen_random_uuid()).primaryKey().notNull(),
	name: varchar().notNull(),
	slug: varchar().notNull(),
	description: text(),
	imageUrl: varchar("image_url"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	unique("categories_slug_unique").on(table.slug),
]);
