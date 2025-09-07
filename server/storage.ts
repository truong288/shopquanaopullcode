
import { db } from "./db";
import { users, products, categories, cartItems, orders, orderItems } from "@shared/schema";
import { eq, desc, and, sql } from "drizzle-orm";

export const storage = {
  // User operations
  async upsertUser(userData: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    profileImageUrl?: string;
  }) {
    try {
      const [existingUser] = await db
        .select()
        .from(users)
        .where(eq(users.id, userData.id));

      if (existingUser) {
        const [updatedUser] = await db
          .update(users)
          .set({
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
            profileImageUrl: userData.profileImageUrl,
            updatedAt: new Date(),
          })
          .where(eq(users.id, userData.id))
          .returning();
        return updatedUser;
      } else {
        const [newUser] = await db
          .insert(users)
          .values({
            id: userData.id,
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
            profileImageUrl: userData.profileImageUrl,
            role: "customer",
          })
          .returning();
        return newUser;
      }
    } catch (error) {
      console.error("Error upserting user:", error);
      throw error;
    }
  },

  async getUserById(id: string) {
    try {
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, id));
      return user;
    } catch (error) {
      console.error("Error getting user by ID:", error);
      throw error;
    }
  },

  // Product operations
  async getProducts() {
    try {
      return await db
        .select()
        .from(products)
        .where(eq(products.isActive, true))
        .orderBy(desc(products.createdAt));
    } catch (error) {
      console.error("Error getting products:", error);
      throw error;
    }
  },

  async getProductById(id: string) {
    try {
      const [product] = await db
        .select()
        .from(products)
        .where(and(eq(products.id, id), eq(products.isActive, true)));
      return product;
    } catch (error) {
      console.error("Error getting product by ID:", error);
      throw error;
    }
  },

  // Cart operations
  async getCartItems(userId: string) {
    try {
      return await db
        .select({
          id: cartItems.id,
          userId: cartItems.userId,
          productId: cartItems.productId,
          quantity: cartItems.quantity,
          size: cartItems.size,
          color: cartItems.color,
          createdAt: cartItems.createdAt,
          product: products,
        })
        .from(cartItems)
        .innerJoin(products, eq(cartItems.productId, products.id))
        .where(eq(cartItems.userId, userId));
    } catch (error) {
      console.error("Error getting cart items:", error);
      throw error;
    }
  },

  async addToCart(data: {
    userId: string;
    productId: string;
    quantity: number;
    size?: string;
    color?: string;
  }) {
    try {
      // Check if item already exists in cart
      const [existingItem] = await db
        .select()
        .from(cartItems)
        .where(
          and(
            eq(cartItems.userId, data.userId),
            eq(cartItems.productId, data.productId),
            data.size ? eq(cartItems.size, data.size) : sql`${cartItems.size} IS NULL`,
            data.color ? eq(cartItems.color, data.color) : sql`${cartItems.color} IS NULL`
          )
        );

      if (existingItem) {
        // Update quantity
        const [updatedItem] = await db
          .update(cartItems)
          .set({ quantity: existingItem.quantity + data.quantity })
          .where(eq(cartItems.id, existingItem.id))
          .returning();
        return updatedItem;
      } else {
        // Add new item
        const [newItem] = await db
          .insert(cartItems)
          .values(data)
          .returning();
        return newItem;
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      throw error;
    }
  },

  async updateCartItem(id: string, quantity: number) {
    try {
      const [updatedItem] = await db
        .update(cartItems)
        .set({ quantity })
        .where(eq(cartItems.id, id))
        .returning();
      return updatedItem;
    } catch (error) {
      console.error("Error updating cart item:", error);
      throw error;
    }
  },

  async removeFromCart(id: string) {
    try {
      await db.delete(cartItems).where(eq(cartItems.id, id));
    } catch (error) {
      console.error("Error removing from cart:", error);
      throw error;
    }
  },

  async clearCart(userId: string) {
    try {
      await db.delete(cartItems).where(eq(cartItems.userId, userId));
    } catch (error) {
      console.error("Error clearing cart:", error);
      throw error;
    }
  },
};
