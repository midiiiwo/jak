import { Order, OrderStats, OrderFilters, CreateOrderData } from "@/types/order";
import { mockOrders } from "@/lib/mock/orders";

export const filterOrders = (orders: Order[], filters: OrderFilters): Order[] => {
    let filtered = [...orders];

    if (filters.status && filters.status !== 'all') {
        filtered = filtered.filter(order => order.status === filters.status);
    }

    if (filters.startDate) {
        filtered = filtered.filter(order =>
            new Date(order.orderDate) >= new Date(filters.startDate!)
        );
    }

    if (filters.endDate) {
        filtered = filtered.filter(order =>
            new Date(order.orderDate) <= new Date(filters.endDate!)
        );
    }

    if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filtered = filtered.filter(order =>
            order.id.toLowerCase().includes(searchLower) ||
            order.customerName.toLowerCase().includes(searchLower) ||
            order.customerEmail.toLowerCase().includes(searchLower)
        );
    }

    return filtered;
};

export const calculateOrderStats = (orders: Order[]): OrderStats => {
    const activeOrders = orders.filter(o => o.status !== 'cancelled');

    return {
        totalOrders: orders.length,
        pendingOrders: orders.filter(o => o.status === 'pending').length,
        processingOrders: orders.filter(o => o.status === 'processing').length,
        shippedOrders: orders.filter(o => o.status === 'shipped').length,
        deliveredOrders: orders.filter(o => o.status === 'delivered').length,
        cancelledOrders: orders.filter(o => o.status === 'cancelled').length,
        totalRevenue: activeOrders.reduce((sum, order) => sum + order.total, 0),
        averageOrderValue: activeOrders.reduce((sum, order) => sum + order.total, 0) /
            (activeOrders.length || 1)
    };
};

export const findOrderById = (id: string): Order | undefined => {
    return mockOrders.find(order => order.id === id);
};

export const validateOrderData = (data: CreateOrderData): string[] => {
    const missingFields: string[] = [];

    if (!data.customerName) missingFields.push('customerName');
    if (!data.customerEmail) missingFields.push('customerEmail');
    if (!data.items || data.items.length === 0) missingFields.push('items');

    return missingFields;
};

export const calculateOrderTotal = (items: Array<{ quantity: number; unitPrice: number }>): number => {
    return items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
};

export const generateOrderId = (currentOrderCount: number): string => {
    return `ORD-${String(currentOrderCount + 1).padStart(3, '0')}`;
};
