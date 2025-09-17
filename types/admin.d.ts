// Database schema for full inventory management
export interface Product {
    id: string;
    title: string;
    description: string;
    price: number;
    category: string;
    image: string;
    images?: string[]; // Multiple product images
    stock: number;
    inStock: boolean;
    sku: string; // Stock Keeping Unit
    weight?: number; // in kg
    unit: 'kg' | 'piece' | 'pack';
    minStockLevel: number; // Alert when stock goes below this
    supplier?: string;
    cost: number; // Cost price for profit calculation
    isActive: boolean; // Can be disabled without deleting
    isFeatured: boolean;
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
    createdBy: string; // Admin user ID
    updatedBy: string;
}

export interface Category {
    id: string;
    name: string;
    description: string;
    image?: string;
    isActive: boolean;
    sortOrder: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface Order {
    id: string;
    orderNumber: string;
    customerId?: string;
    customerInfo: {
        name: string;
        email: string;
        phone: string;
        address: string;
    };
    items: OrderItem[];
    subtotal: number;
    tax: number;
    deliveryFee: number;
    total: number;
    status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
    paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
    paymentReference?: string;
    deliveryDate?: Date;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface OrderItem {
    productId: string;
    product: Product;
    quantity: number;
    unitPrice: number;
    total: number;
}

export interface StockMovement {
    id: string;
    productId: string;
    type: 'in' | 'out' | 'adjustment';
    quantity: number;
    previousStock: number;
    newStock: number;
    reason: string;
    reference?: string; // Order ID, supplier invoice, etc.
    createdBy: string;
    createdAt: Date;
}

export interface AdminUser {
    id: string;
    username: string;
    email: string;
    role: 'superadmin' | 'admin' | 'manager' | 'staff';
    permissions: string[];
    isActive: boolean;
    createdAt: Date;
    lastLogin?: Date;
}

export interface DashboardStats {
    totalProducts: number;
    lowStockProducts: number;
    outOfStockProducts: number;
    totalOrders: number;
    pendingOrders: number;
    todayRevenue: number;
    monthlyRevenue: number;
    topSellingProducts: Array<{
        product: Product;
        quantitySold: number;
        revenue: number;
    }>;
}
