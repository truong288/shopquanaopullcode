import {
  users,
  categories,
  products,
  orders,
  orderItems,
  cartItems,
  reviews,
  type User,
  type UpsertUser,
  type Category,
  type InsertCategory,
  type Product,
  type InsertProduct,
  type Order,
  type InsertOrder,
  type OrderItem,
  type InsertOrderItem,
  type CartItem,
  type InsertCartItem,
  type Review,
  type InsertReview,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, sql, asc } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Category operations
  getCategories(): Promise<Category[]>;
  getCategory(id: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: string, category: Partial<InsertCategory>): Promise<Category>;
  deleteCategory(id: string): Promise<void>;

  // Product operations
  getProducts(categoryId?: string, limit?: number, offset?: number): Promise<Product[]>;
  getFeaturedProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  getProductBySlug(slug: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product>;
  deleteProduct(id: string): Promise<void>;
  searchProducts(query: string): Promise<Product[]>;

  // Cart operations
  getCartItems(userId: string): Promise<(CartItem & { product: Product })[]>;
  addToCart(cartItem: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: string, quantity: number): Promise<CartItem>;
  removeFromCart(id: string): Promise<void>;
  clearCart(userId: string): Promise<void>;

  // Order operations
  getOrders(userId?: string): Promise<(Order & { items: (OrderItem & { product: Product })[] })[]>;
  getOrder(id: string): Promise<(Order & { items: (OrderItem & { product: Product })[] }) | undefined>;
  createOrder(order: InsertOrder, items: InsertOrderItem[]): Promise<Order>;
  updateOrderStatus(id: string, status: string): Promise<Order>;

  // Review operations
  getProductReviews(productId: string): Promise<(Review & { user: Pick<User, 'id' | 'firstName' | 'lastName'> })[]>;
  createReview(review: InsertReview): Promise<Review>;
  updateProductRating(productId: string): Promise<void>;
  canUserReview(userId: string, productId: string): Promise<boolean>;

  // Admin operations
  getOrdersAdmin(): Promise<(Order & { items: (OrderItem & { product: Product })[] })[]>;
  getUsersAdmin(): Promise<User[]>;
  getDashboardStats(): Promise<{
    totalOrders: number;
    totalRevenue: number;
    totalCustomers: number;
    totalProducts: number;
  }>;
  updateUserRole(userId: string, role: string): Promise<User>;
  deleteUser(userId: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Category operations
  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories).orderBy(asc(categories.name));
  }

  async getCategory(id: string): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.id, id));
    return category;
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const [newCategory] = await db.insert(categories).values(category).returning();
    return newCategory;
  }

  async updateCategory(id: string, category: Partial<InsertCategory>): Promise<Category> {
    const [updatedCategory] = await db
      .update(categories)
      .set(category)
      .where(eq(categories.id, id))
      .returning();
    return updatedCategory;
  }

  async deleteCategory(id: string): Promise<void> {
    await db.delete(categories).where(eq(categories.id, id));
  }

  // Product operations
  async getProducts(categoryId?: string, limit = 50, offset = 0): Promise<Product[]> {
    let query = db.select().from(products).where(eq(products.isActive, true));

    if (categoryId) {
      query = query.where(eq(products.categoryId, categoryId));
    }

    return await query.limit(limit).offset(offset).orderBy(desc(products.createdAt));
  }

  async getFeaturedProducts(): Promise<Product[]> {
    return await db
      .select()
      .from(products)
      .where(and(eq(products.isActive, true), eq(products.isFeatured, true)))
      .limit(8)
      .orderBy(desc(products.createdAt));
  }

  async getProduct(id: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async getProductBySlug(slug: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.slug, slug));
    return product;
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [newProduct] = await db.insert(products).values(product).returning();
    return newProduct;
  }

  async updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product> {
    const [updatedProduct] = await db
      .update(products)
      .set({ ...product, updatedAt: new Date() })
      .where(eq(products.id, id))
      .returning();
    return updatedProduct;
  }

  async deleteProduct(id: string): Promise<void> {
    await db.delete(products).where(eq(products.id, id));
  }

  async searchProducts(query: string): Promise<Product[]> {
    return await db
      .select()
      .from(products)
      .where(
        and(
          eq(products.isActive, true),
          sql`${products.name} ILIKE ${'%' + query + '%'} OR ${products.description} ILIKE ${'%' + query + '%'}`
        )
      )
      .limit(20)
      .orderBy(desc(products.createdAt));
  }

  // Cart operations
  async getCartItems(userId: string): Promise<(CartItem & { product: Product })[]> {
    return await db
      .select()
      .from(cartItems)
      .innerJoin(products, eq(cartItems.productId, products.id))
      .where(eq(cartItems.userId, userId))
      .then(rows => rows.map(row => ({ ...row.cart_items, product: row.products })));
  }

  async addToCart(cartItem: InsertCartItem): Promise<CartItem> {
    // Check if item already exists in cart
    const [existing] = await db
      .select()
      .from(cartItems)
      .where(
        and(
          eq(cartItems.userId, cartItem.userId),
          eq(cartItems.productId, cartItem.productId),
          eq(cartItems.size, cartItem.size || ''),
          eq(cartItems.color, cartItem.color || '')
        )
      );

    if (existing) {
      // Update quantity
      const [updated] = await db
        .update(cartItems)
        .set({
          quantity: existing.quantity + cartItem.quantity,
          updatedAt: new Date()
        })
        .where(eq(cartItems.id, existing.id))
        .returning();
      return updated;
    } else {
      // Insert new item
      const [newItem] = await db.insert(cartItems).values(cartItem).returning();
      return newItem;
    }
  }

  async updateCartItem(id: string, quantity: number): Promise<CartItem> {
    const [updated] = await db
      .update(cartItems)
      .set({ quantity, updatedAt: new Date() })
      .where(eq(cartItems.id, id))
      .returning();
    return updated;
  }

  async removeFromCart(id: string): Promise<void> {
    await db.delete(cartItems).where(eq(cartItems.id, id));
  }

  async clearCart(userId: string): Promise<void> {
    await db.delete(cartItems).where(eq(cartItems.userId, userId));
  }

  // Order operations
  async getOrders(userId?: string): Promise<(Order & { items: (OrderItem & { product: Product })[] })[]> {
    let orderQuery = db.select().from(orders);

    if (userId) {
      orderQuery = orderQuery.where(eq(orders.userId, userId));
    }

    const ordersList = await orderQuery.orderBy(desc(orders.createdAt));

    const ordersWithItems = await Promise.all(
      ordersList.map(async (order) => {
        const items = await db
          .select()
          .from(orderItems)
          .innerJoin(products, eq(orderItems.productId, products.id))
          .where(eq(orderItems.orderId, order.id))
          .then(rows => rows.map(row => ({ ...row.order_items, product: row.products })));

        return { ...order, items };
      })
    );

    return ordersWithItems;
  }

  async getOrder(id: string): Promise<(Order & { items: (OrderItem & { product: Product })[] }) | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));

    if (!order) return undefined;

    const items = await db
      .select()
      .from(orderItems)
      .innerJoin(products, eq(orderItems.productId, products.id))
      .where(eq(orderItems.orderId, order.id))
      .then(rows => rows.map(row => ({ ...row.order_items, product: row.products })));

    return { ...order, items };
  }

  async createOrder(order: InsertOrder, items: InsertOrderItem[]): Promise<Order> {
    const [newOrder] = await db.insert(orders).values(order).returning();

    const orderItemsWithOrderId = items.map(item => ({ ...item, orderId: newOrder.id }));
    await db.insert(orderItems).values(orderItemsWithOrderId);

    // Update product stock after creating order
    for (const item of items) {
      await db
        .update(products)
        .set({ 
          stock: sql`${products.stock} - ${item.quantity}`,
          updatedAt: new Date()
        })
        .where(eq(products.id, item.productId));
    }

    return newOrder;
  }

  async updateOrderStatus(id: string, status: string): Promise<Order> {
    // If order is being cancelled, restore stock
    if (status === 'cancelled') {
      const order = await this.getOrder(id);
      if (order) {
        for (const item of order.items) {
          await db
            .update(products)
            .set({ 
              stock: sql`${products.stock} + ${item.quantity}`,
              updatedAt: new Date()
            })
            .where(eq(products.id, item.productId));
        }
      }
    }

    const [updated] = await db
      .update(orders)
      .set({ status: status as any, updatedAt: new Date() })
      .where(eq(orders.id, id))
      .returning();
    return updated;
  }

  // Review operations
  async getProductReviews(productId: string): Promise<(Review & { user: Pick<User, 'id' | 'firstName' | 'lastName'> })[]> {
    return await db
      .select({
        id: reviews.id,
        productId: reviews.productId,
        userId: reviews.userId,
        orderId: reviews.orderId,
        rating: reviews.rating,
        comment: reviews.comment,
        isVerified: reviews.isVerified,
        createdAt: reviews.createdAt,
        updatedAt: reviews.updatedAt,
        user: {
          id: users.id,
          firstName: users.firstName,
          lastName: users.lastName,
        }
      })
      .from(reviews)
      .leftJoin(users, eq(reviews.userId, users.id))
      .where(eq(reviews.productId, productId))
      .orderBy(desc(reviews.createdAt));
  }

  async createReview(review: InsertReview): Promise<Review> {
    const [newReview] = await db
      .insert(reviews)
      .values(review)
      .returning();

    // Update product rating after creating review
    await this.updateProductRating(review.productId);

    return newReview;
  }

  async updateProductRating(productId: string): Promise<void> {
    const [stats] = await db
      .select({
        averageRating: sql<number>`AVG(CAST(${reviews.rating} AS NUMERIC))`,
        reviewCount: sql<number>`COUNT(*)`,
      })
      .from(reviews)
      .where(eq(reviews.productId, productId));

    const avgRating = stats?.averageRating ? Number(stats.averageRating) : 0;

    await db
      .update(products)
      .set({
        rating: avgRating > 0 ? avgRating.toFixed(1) : "0",
        reviewCount: stats?.reviewCount || 0,
      })
      .where(eq(products.id, productId));
  }

  async canUserReview(userId: string, productId: string): Promise<boolean> {
    // Check if user has purchased this product
    const [purchase] = await db
      .select({ orderId: orderItems.orderId })
      .from(orderItems)
      .leftJoin(orders, eq(orderItems.orderId, orders.id))
      .where(
        and(
          eq(orderItems.productId, productId),
          eq(orders.userId, userId),
          eq(orders.status, 'delivered')
        )
      )
      .limit(1);

    if (!purchase) return false;

    // Check if user already reviewed this product
    const [existingReview] = await db
      .select()
      .from(reviews)
      .where(
        and(
          eq(reviews.productId, productId),
          eq(reviews.userId, userId)
        )
      )
      .limit(1);

    return !existingReview;
  }

  // Admin operations
  async getOrdersAdmin(): Promise<(Order & { items: (OrderItem & { product: Product })[] })[]> {
    return this.getOrders();
  }

  async getUsersAdmin(): Promise<User[]> {
    return await db.select().from(users).orderBy(desc(users.createdAt));
  }

  async getDashboardStats(): Promise<{
    totalOrders: number;
    totalRevenue: number;
    totalCustomers: number;
    totalProducts: number;
  }> {
    const [orderStats] = await db
      .select({
        count: sql<number>`count(*)`,
        total: sql<number>`sum(CAST(${orders.total} as NUMERIC))`
      })
      .from(orders);

    const [customerStats] = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(eq(users.role, 'customer'));

    const [productStats] = await db
      .select({ count: sql<number>`count(*)` })
      .from(products)
      .where(eq(products.isActive, true));

    return {
      totalOrders: orderStats?.count || 0,
      totalRevenue: orderStats?.total || 0,
      totalCustomers: customerStats?.count || 0,
      totalProducts: productStats?.count || 0,
    };
  }

  async updateUserRole(userId: string, role: string): Promise<User> {
    const [updatedUser] = await db
      .update(users)
      .set({ role, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();

    if (!updatedUser) {
      throw new Error("User not found");
    }

    return updatedUser;
  }

  async deleteUser(userId: string): Promise<void> {
    // Delete user's related data first
    await db.delete(cartItems).where(eq(cartItems.userId, userId));
    await db.delete(reviews).where(eq(reviews.userId, userId));

    // Update orders to keep them but remove user reference
    await db
      .update(orders)
      .set({ userId: null })
      .where(eq(orders.userId, userId));

    // Finally delete the user
    await db.delete(users).where(eq(users.id, userId));
  }
}

export const storage = new DatabaseStorage();