import { db } from "@/lib/firebase/admin";
import {
  Product,
  Category,
  Order,
  OrderItem,
  StockMovement,
} from "@/types/admin";
import { Customer } from "@/types/customer";

// Collections
const COLLECTIONS = {
  PRODUCTS: "products",
  CATEGORIES: "categories",
  ORDERS: "orders",
  CUSTOMERS: "customers",
  STOCK_MOVEMENTS: "stock_movements",
  ADMIN_USERS: "admin_users",
  SETTINGS: "settings",
} as const;

// Product Service
export class ProductService {
  private collection = db.collection(COLLECTIONS.PRODUCTS);

  async createProduct(
    productData: Omit<Product, "id" | "createdAt" | "updatedAt">
  ): Promise<Product> {
    const now = new Date();
    const newProduct = {
      ...productData,
      createdAt: now,
      updatedAt: now,
      inStock: productData.stock > 0,
    };

    const docRef = await this.collection.add(newProduct);
    const product = { ...newProduct, id: docRef.id } as Product;

    // Update document with the generated ID
    await docRef.update({ id: docRef.id });

    return product;
  }

  async getProduct(id: string): Promise<Product | null> {
    const doc = await this.collection.doc(id).get();
    if (!doc.exists) return null;

    return { id: doc.id, ...doc.data() } as Product;
  }

  async getProducts(
    options: {
      page?: number;
      limit?: number;
      category?: string;
      search?: string;
      inStock?: boolean;
      isActive?: boolean;
    } = {}
  ): Promise<{ products: Product[]; total: number; hasMore: boolean }> {
    const {
      page = 1,
      limit = 10,
      category,
      search,
      inStock,
      isActive = true,
    } = options;

    let q = this.collection.where("isActive", "==", isActive);

    if (category) {
      q = q.where("category", "==", category);
    }

    if (inStock !== undefined) {
      q = q.where("inStock", "==", inStock);
    }

    // For search, we'll need to implement client-side filtering for now
    // In production, consider using Algolia or Elasticsearch
    q = q.orderBy("createdAt", "desc");

    const snapshot = await q.get();
    const products: Product[] = [];

    snapshot.forEach((doc) => {
      const data = doc.data() as Product;
      products.push({ ...data, id: doc.id });
    });

    // Apply search filter client-side if needed
    let filteredProducts = products;
    if (search) {
      const searchLower = search.toLowerCase();
      filteredProducts = products.filter(
        (product) =>
          product.title.toLowerCase().includes(searchLower) ||
          product.description.toLowerCase().includes(searchLower) ||
          product.sku.toLowerCase().includes(searchLower) ||
          product.tags.some((tag) => tag.toLowerCase().includes(searchLower))
      );
    }

    // Apply pagination after filtering
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
    const hasMore = endIndex < filteredProducts.length;

    return {
      products: paginatedProducts,
      total: filteredProducts.length,
      hasMore,
    };
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    const updatedData = {
      ...updates,
      updatedAt: new Date(),
      inStock: updates.stock !== undefined ? updates.stock > 0 : undefined,
    };

    // Remove undefined values
    Object.keys(updatedData).forEach((key) => {
      if (updatedData[key as keyof typeof updatedData] === undefined) {
        delete updatedData[key as keyof typeof updatedData];
      }
    });

    await this.collection.doc(id).update(updatedData);

    const updated = await this.getProduct(id);
    if (!updated) throw new Error("Product not found after update");

    return updated;
  }

  async deleteProduct(id: string): Promise<void> {
    // Soft delete by setting isActive to false
    await this.updateProduct(id, { isActive: false });
  }

  async updateStock(
    id: string,
    newStock: number,
    reason: string,
    reference?: string
  ): Promise<void> {
    const product = await this.getProduct(id);
    if (!product) throw new Error("Product not found");

    const stockMovement: Omit<StockMovement, "id"> = {
      productId: id,
      type:
        newStock > product.stock
          ? "in"
          : newStock < product.stock
          ? "out"
          : "adjustment",
      quantity: Math.abs(newStock - product.stock),
      previousStock: product.stock,
      newStock,
      reason,
      reference,
      createdBy: "system", // TODO: Get from auth context
      createdAt: new Date(),
    };

    // Use batch write for atomicity
    const batch = db.batch();

    // Update product stock
    const productRef = this.collection.doc(id);
    batch.update(productRef, {
      stock: newStock,
      inStock: newStock > 0,
      updatedAt: new Date(),
    });

    // Log stock movement
    const stockMovementRef = db.collection(COLLECTIONS.STOCK_MOVEMENTS).doc();
    batch.set(stockMovementRef, { ...stockMovement, id: stockMovementRef.id });

    await batch.commit();
  }

  async getLowStockProducts(threshold?: number): Promise<Product[]> {
    const products = await this.getProducts({ inStock: true });

    return products.products.filter((product) => {
      const minLevel = threshold || product.minStockLevel || 10;
      return product.stock <= minLevel;
    });
  }

  async getFeaturedProducts(limit = 6): Promise<Product[]> {
    const q = this.collection
      .where("isActive", "==", true)
      .where("isFeatured", "==", true)
      .where("inStock", "==", true)
      .orderBy("createdAt", "desc")
      .limit(limit);

    const snapshot = await q.get();
    const products: Product[] = [];

    snapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() } as Product);
    });

    return products;
  }
}

// Category Service
export class CategoryService {
  private collection = db.collection(COLLECTIONS.CATEGORIES);

  async createCategory(
    categoryData: Omit<Category, "id" | "createdAt" | "updatedAt">
  ): Promise<Category> {
    const now = new Date();
    const newCategory = {
      ...categoryData,
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await this.collection.add(newCategory);
    await docRef.update({ id: docRef.id });

    return { ...newCategory, id: docRef.id } as Category;
  }

  async getCategories(activeOnly = true): Promise<Category[]> {
    let q = this.collection.orderBy("sortOrder");

    if (activeOnly) {
      q = q.where("isActive", "==", true);
    }

    const snapshot = await q.get();
    const categories: Category[] = [];

    snapshot.forEach((doc) => {
      categories.push({ id: doc.id, ...doc.data() } as Category);
    });

    return categories;
  }

  async updateCategory(
    id: string,
    updates: Partial<Category>
  ): Promise<Category> {
    const updatedData = {
      ...updates,
      updatedAt: new Date(),
    };

    await this.collection.doc(id).update(updatedData);

    const doc = await this.collection.doc(id).get();
    return { id: doc.id, ...doc.data() } as Category;
  }

  async deleteCategory(id: string): Promise<void> {
    await this.updateCategory(id, { isActive: false });
  }
}

// Order Service
export class OrderService {
  private collection = db.collection(COLLECTIONS.ORDERS);

  async createOrder(
    orderData: Omit<Order, "id" | "orderNumber" | "createdAt" | "updatedAt">
  ): Promise<Order> {
    const now = new Date();
    const orderNumber = this.generateOrderNumber();

    const newOrder = {
      ...orderData,
      orderNumber,
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await this.collection.add(newOrder);
    await docRef.update({ id: docRef.id });

    // Update product stock for each item using admin SDK approach
    const batch = db.batch();
    for (const item of orderData.items) {
      const productRef = db
        .collection(COLLECTIONS.PRODUCTS)
        .doc(item.productId);
      // We need to get current stock first since admin SDK doesn't have FieldValue.increment
      const productDoc = await productRef.get();
      if (productDoc.exists) {
        const currentStock = productDoc.data()?.stock || 0;
        batch.update(productRef, {
          stock: currentStock - item.quantity,
          inStock: currentStock - item.quantity > 0,
          updatedAt: new Date(),
        });
      }
    }
    await batch.commit();

    return { ...newOrder, id: docRef.id } as Order;
  }

  async getOrder(id: string): Promise<Order | null> {
    const doc = await this.collection.doc(id).get();
    if (!doc.exists) return null;

    return { id: doc.id, ...doc.data() } as Order;
  }

  async getOrders(
    options: {
      page?: number;
      limit?: number;
      status?: string;
      customerId?: string;
      startDate?: Date;
      endDate?: Date;
    } = {}
  ): Promise<{ orders: Order[]; total: number; hasMore: boolean }> {
    const {
      page = 1,
      limit = 10,
      status,
      customerId,
      startDate,
      endDate,
    } = options;

    let q = this.collection.orderBy("createdAt", "desc");

    if (status) {
      q = q.where("status", "==", status);
    }

    if (customerId) {
      q = q.where("customerId", "==", customerId);
    }

    if (startDate) {
      q = q.where("createdAt", ">=", startDate);
    }

    if (endDate) {
      q = q.where("createdAt", "<=", endDate);
    }

    const snapshot = await q.get();
    const orders: Order[] = [];

    snapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() } as Order);
    });

    // Apply pagination after getting all results
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedOrders = orders.slice(startIndex, endIndex);
    const hasMore = endIndex < orders.length;

    return {
      orders: paginatedOrders,
      total: orders.length,
      hasMore,
    };
  }

  async updateOrderStatus(
    id: string,
    status: Order["status"],
    notes?: string
  ): Promise<Order> {
    const updatedData = {
      status,
      updatedAt: new Date(),
      ...(notes && { notes }),
    };

    await this.collection.doc(id).update(updatedData);

    const updated = await this.getOrder(id);
    if (!updated) throw new Error("Order not found after update");

    return updated;
  }

  private generateOrderNumber(): string {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    return `ORD-${timestamp.slice(-6)}${random}`;
  }
}

// Stock Movement Service
export class StockMovementService {
  private collection = db.collection(COLLECTIONS.STOCK_MOVEMENTS);

  async createStockMovement(
    movementData: Omit<StockMovement, "id">
  ): Promise<StockMovement> {
    const docRef = await this.collection.add(movementData);
    await docRef.update({ id: docRef.id });

    return { ...movementData, id: docRef.id } as StockMovement;
  }

  async getStockMovements(
    options: {
      productId?: string;
      type?: "in" | "out" | "adjustment";
      page?: number;
      limit?: number;
      startDate?: Date;
      endDate?: Date;
    } = {}
  ): Promise<{ movements: StockMovement[]; total: number; hasMore: boolean }> {
    const {
      productId,
      type,
      page = 1,
      limit = 10,
      startDate,
      endDate,
    } = options;

    let q = this.collection.orderBy("createdAt", "desc");

    if (productId) {
      q = q.where("productId", "==", productId);
    }

    if (type) {
      q = q.where("type", "==", type);
    }

    if (startDate) {
      q = q.where("createdAt", ">=", startDate);
    }

    if (endDate) {
      q = q.where("createdAt", "<=", endDate);
    }

    const snapshot = await q.get();
    const movements: StockMovement[] = [];

    snapshot.forEach((doc) => {
      movements.push({ id: doc.id, ...doc.data() } as StockMovement);
    });

    // Apply pagination after getting all results
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedMovements = movements.slice(startIndex, endIndex);
    const hasMore = endIndex < movements.length;

    return {
      movements: paginatedMovements,
      total: movements.length,
      hasMore,
    };
  }

  async getRecentMovements(limit = 20): Promise<StockMovement[]> {
    const result = await this.getStockMovements({ limit });
    return result.movements;
  }
}

// Customer Service
export class CustomerService {
  private collection = db.collection(COLLECTIONS.CUSTOMERS);

  async createCustomer(
    customerData: Omit<
      Customer,
      "id" | "registrationDate" | "totalOrders" | "totalSpent" | "lastOrderDate"
    >
  ): Promise<Customer> {
    const now = new Date();
    const newCustomer = {
      ...customerData,
      registrationDate: now,
      totalOrders: 0,
      totalSpent: 0,
      lastOrderDate: null,
      status: "active" as const,
    };

    const docRef = await this.collection.add(newCustomer);
    await docRef.update({ id: docRef.id });

    return { ...newCustomer, id: docRef.id } as Customer;
  }

  async getCustomers(
    options: {
      page?: number;
      limit?: number;
      status?: "active" | "inactive";
      customerType?: "regular" | "premium" | "vip";
      search?: string;
    } = {}
  ): Promise<{ customers: Customer[]; total: number; hasMore: boolean }> {
    const { page = 1, limit = 10, status, customerType, search } = options;

    let q = this.collection.orderBy("registrationDate", "desc");

    if (status) {
      q = q.where("status", "==", status);
    }

    if (customerType) {
      q = q.where("customerType", "==", customerType);
    }

    const snapshot = await q.get();
    let customers: Customer[] = [];

    snapshot.forEach((doc) => {
      customers.push({ id: doc.id, ...doc.data() } as Customer);
    });

    // Apply search filter client-side if needed
    if (search) {
      const searchLower = search.toLowerCase();
      customers = customers.filter(
        (customer) =>
          customer.name.toLowerCase().includes(searchLower) ||
          customer.email.toLowerCase().includes(searchLower) ||
          customer.phone.toLowerCase().includes(searchLower)
      );
    }

    // Apply pagination after filtering
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedCustomers = customers.slice(startIndex, endIndex);
    const hasMore = endIndex < customers.length;

    return {
      customers: paginatedCustomers,
      total: customers.length,
      hasMore,
    };
  }

  async getCustomer(id: string): Promise<Customer | null> {
    const doc = await this.collection.doc(id).get();
    if (!doc.exists) return null;

    return { id: doc.id, ...doc.data() } as Customer;
  }

  async updateCustomer(
    id: string,
    updates: Partial<Customer>
  ): Promise<Customer> {
    await this.collection.doc(id).update(updates);

    const updated = await this.getCustomer(id);
    if (!updated) throw new Error("Customer not found after update");

    return updated;
  }

  async updateCustomerStats(
    customerId: string,
    orderTotal: number
  ): Promise<void> {
    const customer = await this.getCustomer(customerId);
    if (!customer) return;

    const updates = {
      totalOrders: customer.totalOrders + 1,
      totalSpent: customer.totalSpent + orderTotal,
      lastOrderDate: new Date(),
    };

    await this.updateCustomer(customerId, updates);
  }
}

// Export service instances
export const productService = new ProductService();
export const categoryService = new CategoryService();
export const orderService = new OrderService();
export const stockMovementService = new StockMovementService();
export const customerService = new CustomerService();
