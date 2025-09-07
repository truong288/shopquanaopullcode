import express, { type Express } from "express";
import { db } from "./db";
import {
  users,
  products,
  categories,
  cartItems,
  orders,
  orderItems,
  reviews,
  shippingRates,
  settings,
  type User,
  type Product,
  type Category,
  type CartItem,
  type Order,
  type OrderItem,
  type Review,
  type ShippingRate,
  type Setting
} from "@shared/schema";
import { eq, and, sql, desc, asc, ilike, inArray, or } from "drizzle-orm";
import multer from "multer";
import path from "path";
import fs from "fs";
import { createServer } from "http";

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), "attached_assets", "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'product-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

export function registerRoutes(app: Express) {
  const server = createServer(app);

  // Auth middleware
  const requireAuth = (req: any, res: any, next: any) => {
    if (!req.user || !req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Ensure session user is set from authenticated user
    if (!req.session.user) {
      req.session.user = {
        id: req.user.claims.sub,
        role: 'user' // default role, will be updated from database if needed
      };
    }

    next();
  };

  const requireAdmin = async (req: any, res: any, next: any) => {
    if (!req.user || !req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      // Get user from database to check role
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, req.user.claims.sub));

      if (!user || user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }

      // Update session with user info
      req.session.user = {
        id: user.id,
        role: user.role
      };

      next();
    } catch (error) {
      console.error("Error checking admin role:", error);
      res.status(500).json({ message: "Failed to verify admin access" });
    }
  };

  // Categories
  app.get("/api/categories", async (req, res) => {
    try {
      const allCategories = await db.select().from(categories);
      res.json(allCategories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  app.post("/api/categories", requireAdmin, async (req, res) => {
    try {
      const { name, description } = req.body;
      const [category] = await db
        .insert(categories)
        .values({ name, description })
        .returning();
      res.json(category);
    } catch (error) {
      console.error("Error creating category:", error);
      res.status(500).json({ message: "Failed to create category" });
    }
  });

  // Products
  // Get featured products
  app.get("/api/products/featured", async (req, res) => {
    try {
      const result = await db.select({
        product: products,
        category: categories
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(and(eq(products.isActive, true), eq(products.isFeatured, true)))
      .orderBy(desc(products.createdAt))
      .limit(8);

      const featuredProducts = result.map(row => ({
        ...row.product,
        category: row.category
      }));

      res.json(featuredProducts);
    } catch (error) {
      console.error('Error fetching featured products:', error);
      res.status(500).json({ message: "Failed to fetch featured products" });
    }
  });

  // Get all products with optional filtering
  app.get("/api/products", async (req, res) => {
    try {
      const { category, search, sortBy = "createdAt", sortOrder = "desc" } = req.query;

      let query = db.select({
        product: products,
        category: categories
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(eq(products.isActive, true));

      // Apply search filter
      if (search && typeof search === 'string') {
        query = query.where(
          or(
            ilike(products.name, `%${search}%`),
            ilike(products.description, `%${search}%`)
          )
        );
      }

      // Apply category filter
      if (category && typeof category === 'string') {
        query = query.where(eq(products.categoryId, category));
      }

      // Apply sorting
      const orderColumn = sortBy === 'name' ? products.name :
                         sortBy === 'price' ? products.price :
                         sortBy === 'rating' ? products.rating :
                         products.createdAt;

      if (sortOrder === 'asc') {
        query = query.orderBy(asc(orderColumn));
      } else {
        query = query.orderBy(desc(orderColumn));
      }

      const result = await query;

      const productsWithCategories = result.map(row => ({
        ...row.product,
        category: row.category
      }));

      res.json(productsWithCategories);
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const [product] = await db
        .select()
        .from(products)
        .where(eq(products.id, req.params.id));

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      // Get reviews for this product
      const productReviews = await db
        .select({
          id: reviews.id,
          rating: reviews.rating,
          comment: reviews.comment,
          createdAt: reviews.createdAt,
          userName: users.firstName
        })
        .from(reviews)
        .leftJoin(users, eq(reviews.userId, users.id))
        .where(eq(reviews.productId, req.params.id))
        .orderBy(desc(reviews.createdAt));

      res.json({ ...product, reviews: productReviews });
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  app.post("/api/products", requireAdmin, upload.array('images', 5), async (req, res) => {
    try {
      const { name, description, price, originalPrice, categoryId, stock, sizes, colors, isFeatured } = req.body;

      const imageUrls = (req.files as Express.Multer.File[])?.map(file =>
        `/api/uploads/${file.filename}`
      ) || [];

      const [product] = await db
        .insert(products)
        .values({
          name,
          description,
          price,
          originalPrice: originalPrice || null,
          categoryId,
          stock: parseInt(stock),
          sizes: sizes ? JSON.parse(sizes) : [],
          colors: colors ? JSON.parse(colors) : [],
          imageUrls,
          isFeatured: isFeatured === 'true',
          rating: "0",
          reviewCount: 0
        })
        .returning();

      res.json(product);
    } catch (error) {
      console.error("Error creating product:", error);
      res.status(500).json({ message: "Failed to create product" });
    }
  });

  app.put("/api/products/:id", requireAdmin, upload.array('images', 5), async (req, res) => {
    try {
      const { name, description, price, originalPrice, categoryId, stock, sizes, colors, isFeatured } = req.body;

      const updateData: any = {
        name,
        description,
        price,
        originalPrice: originalPrice || null,
        categoryId,
        stock: parseInt(stock),
        sizes: sizes ? JSON.parse(sizes) : [],
        colors: colors ? JSON.parse(colors) : [],
        isFeatured: isFeatured === 'true'
      };

      if (req.files && (req.files as Express.Multer.File[]).length > 0) {
        updateData.imageUrls = (req.files as Express.Multer.File[]).map(file =>
          `/api/uploads/${file.filename}`
        );
      }

      const [product] = await db
        .update(products)
        .set(updateData)
        .where(eq(products.id, req.params.id))
        .returning();

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.json(product);
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({ message: "Failed to update product" });
    }
  });

  app.delete("/api/products/:id", requireAdmin, async (req, res) => {
    try {
      const [product] = await db
        .delete(products)
        .where(eq(products.id, req.params.id))
        .returning();

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ message: "Failed to delete product" });
    }
  });

  // Cart
  app.get("/api/cart", requireAuth, async (req, res) => {
    try {
      const cartData = await db
        .select({
          id: cartItems.id,
          quantity: cartItems.quantity,
          size: cartItems.size,
          color: cartItems.color,
          product: products
        })
        .from(cartItems)
        .leftJoin(products, eq(cartItems.productId, products.id))
        .where(eq(cartItems.userId, req.session.user.id));

      res.json(cartData);
    } catch (error) {
      console.error("Error fetching cart:", error);
      res.status(500).json({ message: "Failed to fetch cart" });
    }
  });

  app.post("/api/cart", requireAuth, async (req, res) => {
    try {
      const { productId, quantity, size, color } = req.body;
      const userId = req.session.user.id;

      // Check if item already exists in cart
      const [existingItem] = await db
        .select()
        .from(cartItems)
        .where(
          and(
            eq(cartItems.userId, userId),
            eq(cartItems.productId, productId),
            size ? eq(cartItems.size, size) : sql`${cartItems.size} IS NULL`,
            color ? eq(cartItems.color, color) : sql`${cartItems.color} IS NULL`
          )
        );

      let cartItem;
      if (existingItem) {
        [cartItem] = await db
          .update(cartItems)
          .set({ quantity: existingItem.quantity + quantity })
          .where(eq(cartItems.id, existingItem.id))
          .returning();
      } else {
        [cartItem] = await db
          .insert(cartItems)
          .values({ userId, productId, quantity, size, color })
          .returning();
      }

      res.json(cartItem);
    } catch (error) {
      console.error("Error adding to cart:", error);
      res.status(500).json({ message: "Failed to add to cart" });
    }
  });

  app.put("/api/cart/:id", requireAuth, async (req, res) => {
    try {
      const { quantity } = req.body;
      const [cartItem] = await db
        .update(cartItems)
        .set({ quantity })
        .where(
          and(
            eq(cartItems.id, req.params.id),
            eq(cartItems.userId, req.session.user.id)
          )
        )
        .returning();

      if (!cartItem) {
        return res.status(404).json({ message: "Cart item not found" });
      }

      res.json(cartItem);
    } catch (error) {
      console.error("Error updating cart:", error);
      res.status(500).json({ message: "Failed to update cart" });
    }
  });

  app.delete("/api/cart/:id", requireAuth, async (req, res) => {
    try {
      const [cartItem] = await db
        .delete(cartItems)
        .where(
          and(
            eq(cartItems.id, req.params.id),
            eq(cartItems.userId, req.session.user.id)
          )
        )
        .returning();

      if (!cartItem) {
        return res.status(404).json({ message: "Cart item not found" });
      }

      res.json({ message: "Item removed from cart" });
    } catch (error) {
      console.error("Error removing from cart:", error);
      res.status(500).json({ message: "Failed to remove from cart" });
    }
  });

  // Orders
  app.get("/api/orders", requireAuth, async (req, res) => {
    try {
      const userOrders = await db
        .select()
        .from(orders)
        .where(eq(orders.userId, req.session.user.id))
        .orderBy(desc(orders.createdAt));

      const ordersWithItems = await Promise.all(
        userOrders.map(async (order) => {
          const items = await db
            .select({
              id: orderItems.id,
              quantity: orderItems.quantity,
              price: orderItems.price,
              size: orderItems.size,
              color: orderItems.color,
              product: products
            })
            .from(orderItems)
            .leftJoin(products, eq(orderItems.productId, products.id))
            .where(eq(orderItems.orderId, order.id));

          return { ...order, items };
        })
      );

      res.json(ordersWithItems);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.post("/api/orders", requireAuth, async (req, res) => {
    const userId = req.session.user.id;
    const user = await db.query.users.findFirst({ where: eq(users.id, userId) });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const cartItems = await db
      .select({
        cartItem: cartItems,
        product: products
      })
      .from(cartItems)
      .leftJoin(products, eq(cartItems.productId, products.id))
      .where(eq(cartItems.userId, userId));

    if (cartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }
    try {
      const {
        shippingAddress,
        customerPhone,
        notes,
        shippingProvince,
        shippingDistrict,
        shippingWard,
        paymentMethod = "cod"
      } = req.body;

      if (!shippingAddress || !customerPhone) {
        return res.status(400).json({
          message: "Địa chỉ giao hàng và số điện thoại là bắt buộc"
        });
      }

      const subtotal = cartItems.reduce((sum, item) => sum + (parseFloat(item.product!.price) * item.cartItem.quantity), 0);
      const shippingFee = 30000; // Default shipping fee
      const total = subtotal + shippingFee;

      // Create order
      const [newOrder] = await db.insert(orders).values({
        userId: user.id,
        subtotal: subtotal.toString(),
        shippingFee: shippingFee.toString(),
        total: total.toString(),
        status: "pending",
        shippingAddress,
        customerPhone,
        notes,
        shippingProvince: shippingProvince || "",
        shippingDistrict: shippingDistrict || "",
        shippingWard: shippingWard || "",
        paymentMethod: paymentMethod as "cod" | "bank_transfer",
        paymentStatus: "pending",
        customerName: `${user.firstName} ${user.lastName}`,
        customerEmail: user.email,
      }).returning();


      // Create order items
      const orderItemsData = cartItems.map(item => ({
        orderId: newOrder.id,
        productId: item.cartItem.productId,
        quantity: item.cartItem.quantity,
        price: item.product!.price,
        size: item.cartItem.size,
        color: item.cartItem.color
      }));

      await db.insert(orderItems).values(orderItemsData);

      // Clear cart
      await db.delete(cartItems).where(eq(cartItems.userId, userId));

      res.json(newOrder);
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ message: "Failed to create order" });
    }
  });

  // Reviews
  app.post("/api/products/:id/reviews", requireAuth, async (req, res) => {
    try {
      const { rating, comment } = req.body;
      const productId = req.params.id;
      const userId = req.session.user.id;

      // Check if user already reviewed this product
      const [existingReview] = await db
        .select()
        .from(reviews)
        .where(
          and(
            eq(reviews.productId, productId),
            eq(reviews.userId, userId)
          )
        );

      if (existingReview) {
        return res.status(400).json({ message: "You have already reviewed this product" });
      }

      const [review] = await db
        .insert(reviews)
        .values({
          productId,
          userId,
          rating: parseInt(rating),
          comment
        })
        .returning();

      // Update product rating and review count
      const allReviews = await db
        .select()
        .from(reviews)
        .where(eq(reviews.productId, productId));

      const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

      await db
        .update(products)
        .set({
          rating: avgRating.toFixed(1),
          reviewCount: allReviews.length
        })
        .where(eq(products.id, productId));

      res.json(review);
    } catch (error) {
      console.error("Error creating review:", error);
      res.status(500).json({ message: "Failed to create review" });
    }
  });

  // Auth routes
  app.get("/api/auth/user", async (req, res) => {
    if (!req.user || !req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      // Get user from database
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, (req.user as any).claims.sub));

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Users (Admin)
  app.get("/api/users", requireAdmin, async (req, res) => {
    try {
      const allUsers = await db.select().from(users).orderBy(desc(users.createdAt));
      res.json(allUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.put("/api/users/:id/role", requireAdmin, async (req, res) => {
    try {
      const { role } = req.body;
      const [user] = await db
        .update(users)
        .set({ role })
        .where(eq(users.id, req.params.id))
        .returning();

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(user);
    } catch (error) {
      console.error("Error updating user role:", error);
      res.status(500).json({ message: "Failed to update user role" });
    }
  });

  // Admin Orders
  app.get("/api/admin/orders", requireAdmin, async (req, res) => {
    try {
      const allOrders = await db
        .select({
          order: orders,
          user: {
            id: users.id,
            firstName: users.firstName,
            lastName: users.lastName,
            email: users.email
          }
        })
        .from(orders)
        .leftJoin(users, eq(orders.userId, users.id))
        .orderBy(desc(orders.createdAt));

      const ordersWithItems = await Promise.all(
        allOrders.map(async ({ order, user }) => {
          const items = await db
            .select({
              id: orderItems.id,
              quantity: orderItems.quantity,
              price: orderItems.price,
              size: orderItems.size,
              color: orderItems.color,
              product: products
            })
            .from(orderItems)
            .leftJoin(products, eq(orderItems.productId, products.id))
            .where(eq(orderItems.orderId, order.id));

          return { ...order, user, items };
        })
      );

      res.json(ordersWithItems);
    } catch (error) {
      console.error("Error fetching admin orders:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.put("/api/admin/orders/:id/status", requireAdmin, async (req, res) => {
    try {
      const { status } = req.body;
      const [order] = await db
        .update(orders)
        .set({ status })
        .where(eq(orders.id, req.params.id))
        .returning();

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      res.json(order);
    } catch (error) {
      console.error("Error updating order status:", error);
      res.status(500).json({ message: "Failed to update order status" });
    }
  });

  // Settings - Shipping fee
  // Get shipping fee setting
  app.get("/api/settings/shipping-fee", async (req, res) => {
    try {
      // Return default shipping fee since settings table doesn't exist
      res.json({
        shippingFee: "30000"
      });
    } catch (error) {
      console.error("Error fetching shipping fee:", error);
      res.status(500).json({
        message: "Failed to fetch shipping fee"
      });
    }
  });

  app.put("/api/admin/settings/shipping-fee", requireAdmin, async (req, res) => {
    try {
      const { shippingFee } = req.body;

      // No longer updating settings table, just respond with the new fee
      res.json({ shippingFee });
    } catch (error) {
      console.error("Error updating shipping fee:", error);
      res.status(500).json({ message: "Failed to update shipping fee" });
    }
  });

  // Shipping rates
  app.get("/api/shipping-rates", async (req, res) => {
    try {
      const rates = await db.select().from(shippingRates);
      res.json(rates);
    } catch (error) {
      console.error("Error fetching shipping rates:", error);
      res.status(500).json({ message: "Failed to fetch shipping rates" });
    }
  });

  app.put("/api/shipping-rates", requireAdmin, async (req, res) => {
    try {
      const { rates } = req.body;

      // Clear existing rates
      await db.delete(shippingRates);

      // Insert new rates
      if (rates && rates.length > 0) {
        await db.insert(shippingRates).values(rates);
      }

      const updatedRates = await db.select().from(shippingRates);
      res.json(updatedRates);
    } catch (error) {
      console.error("Error updating shipping rates:", error);
      res.status(500).json({ message: "Failed to update shipping rates" });
    }
  });

  // Serve uploaded files
  app.use("/attached_assets", express.static(path.join(process.cwd(), "attached_assets")));
  app.use("/api/uploads", express.static(path.join(process.cwd(), "attached_assets", "uploads")));

  return server;
}