import { relations } from "drizzle-orm/relations";
import { products, reviews, users, orders, cartItems, categories, orderItems } from "./schema";

export const reviewsRelations = relations(reviews, ({one}) => ({
	product: one(products, {
		fields: [reviews.productId],
		references: [products.id]
	}),
	user: one(users, {
		fields: [reviews.userId],
		references: [users.id]
	}),
	order: one(orders, {
		fields: [reviews.orderId],
		references: [orders.id]
	}),
}));

export const productsRelations = relations(products, ({one, many}) => ({
	reviews: many(reviews),
	cartItems: many(cartItems),
	category: one(categories, {
		fields: [products.categoryId],
		references: [categories.id]
	}),
	orderItems: many(orderItems),
}));

export const usersRelations = relations(users, ({many}) => ({
	reviews: many(reviews),
	cartItems: many(cartItems),
	orders: many(orders),
}));

export const ordersRelations = relations(orders, ({one, many}) => ({
	reviews: many(reviews),
	user: one(users, {
		fields: [orders.userId],
		references: [users.id]
	}),
	orderItems: many(orderItems),
}));

export const cartItemsRelations = relations(cartItems, ({one}) => ({
	user: one(users, {
		fields: [cartItems.userId],
		references: [users.id]
	}),
	product: one(products, {
		fields: [cartItems.productId],
		references: [products.id]
	}),
}));

export const categoriesRelations = relations(categories, ({many}) => ({
	products: many(products),
}));

export const orderItemsRelations = relations(orderItems, ({one}) => ({
	order: one(orders, {
		fields: [orderItems.orderId],
		references: [orders.id]
	}),
	product: one(products, {
		fields: [orderItems.productId],
		references: [products.id]
	}),
}));