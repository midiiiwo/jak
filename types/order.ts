export interface OrderItem {
    id: number;
    name: string;
    quantity: number;
    unitPrice: number;
    total: number;
}

export interface ShippingAddress {
    street: string;
    city: string;
    region: string;
    zipCode: string;
}

export interface Order {
    id: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    orderDate: string;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    total: number;
    items: OrderItem[];
    shippingAddress: ShippingAddress;
    paymentMethod: string;
    paymentStatus: 'pending' | 'completed' | 'refunded';
    notes: string;
}

export interface OrderStats {
    totalOrders: number;
    pendingOrders: number;
    processingOrders: number;
    shippedOrders: number;
    deliveredOrders: number;
    cancelledOrders: number;
    totalRevenue: number;
    averageOrderValue: number;
}

export interface OrderFilters {
    status?: string;
    startDate?: string;
    endDate?: string;
    search?: string;
}

export interface CreateOrderData {
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
    items: Omit<OrderItem, 'total'>[];
    shippingAddress?: ShippingAddress;
    paymentMethod?: string;
    notes?: string;
}
