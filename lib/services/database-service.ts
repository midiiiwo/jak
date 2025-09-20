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

    // Get all products and filter in memory to avoid index requirements
    const snapshot = await this.collection.get();
    let products: Product[] = [];

    snapshot.forEach((doc) => {
      const data = doc.data() as Product;
      products.push({ ...data, id: doc.id });
    });

    // Apply filters in memory
    let filteredProducts = products.filter(
      (product) => product.isActive === isActive
    );

    if (category) {
      filteredProducts = filteredProducts.filter(
        (product) => product.category === category
      );
    }

    if (inStock !== undefined) {
      filteredProducts = filteredProducts.filter(
        (product) => product.inStock === inStock
      );
    }

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.title.toLowerCase().includes(searchLower) ||
          product.description.toLowerCase().includes(searchLower) ||
          product.sku.toLowerCase().includes(searchLower) ||
          product.tags.some((tag) => tag.toLowerCase().includes(searchLower))
      );
    }

    // Sort by createdAt descending
    filteredProducts.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

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
    // Get all active products and filter in memory
    const { products } = await this.getProducts({ isActive: true });

    return products.filter((product) => {
      const minLevel = threshold || product.minStockLevel || 10;
      return product.stock <= minLevel;
    });
  }

  async getFeaturedProducts(limit = 6): Promise<Product[]> {
    // Get all active, in-stock products and filter in memory
    const { products } = await this.getProducts({
      isActive: true,
      inStock: true,
    });

    // Filter for featured products and sort by creation date
    const featuredProducts = products
      .filter((product) => product.isFeatured)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, limit);

    return featuredProducts;
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
    // Get all categories and filter/sort in memory
    const snapshot = await this.collection.get();
    let categories: Category[] = [];

    snapshot.forEach((doc) => {
      categories.push({ id: doc.id, ...doc.data() } as Category);
    });

    // Apply active filter if needed
    if (activeOnly) {
      categories = categories.filter((category) => category.isActive);
    }

    // Sort by sortOrder
    categories.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

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

    // Get all orders and filter in memory
    const snapshot = await this.collection.get();
    let orders: Order[] = [];

    snapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() } as Order);
    });

    // Sort by createdAt descending
    orders.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // Apply filters in memory
    if (status) {
      orders = orders.filter((order) => order.status === status);
    }

    if (customerId) {
      orders = orders.filter((order) => order.customerId === customerId);
    }

    if (startDate) {
      orders = orders.filter((order) => new Date(order.createdAt) >= startDate);
    }

    if (endDate) {
      orders = orders.filter((order) => new Date(order.createdAt) <= endDate);
    }

    // Apply pagination after filtering
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

    // Get all movements and filter in memory
    const snapshot = await this.collection.get();
    let movements: StockMovement[] = [];

    snapshot.forEach((doc) => {
      movements.push({ id: doc.id, ...doc.data() } as StockMovement);
    });

    // Sort by createdAt descending
    movements.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // Apply filters in memory
    if (productId) {
      movements = movements.filter(
        (movement) => movement.productId === productId
      );
    }

    if (type) {
      movements = movements.filter((movement) => movement.type === type);
    }

    if (startDate) {
      movements = movements.filter(
        (movement) => new Date(movement.createdAt) >= startDate
      );
    }

    if (endDate) {
      movements = movements.filter(
        (movement) => new Date(movement.createdAt) <= endDate
      );
    }

    // Apply pagination after filtering
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

    // Get all customers and filter in memory
    const snapshot = await this.collection.get();
    let customers: Customer[] = [];

    snapshot.forEach((doc) => {
      customers.push({ id: doc.id, ...doc.data() } as Customer);
    });

    // Sort by registrationDate descending
    customers.sort(
      (a, b) =>
        new Date(b.registrationDate).getTime() -
        new Date(a.registrationDate).getTime()
    );

    // Apply filters in memory
    if (status) {
      customers = customers.filter((customer) => customer.status === status);
    }

    if (customerType) {
      customers = customers.filter(
        (customer) => customer.customerType === customerType
      );
    }

    // Apply search filter
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
