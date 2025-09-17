import { Order } from "@/types/order";

export const mockOrders: Order[] = [
    {
        id: 'ORD-001',
        customerName: 'John Doe',
        customerEmail: 'john.doe@email.com',
        customerPhone: '+233 24 123 4567',
        orderDate: '2024-12-15T10:30:00Z',
        status: 'pending',
        total: 285.50,
        items: [
            { id: 1, name: 'Frozen Chicken Wings', quantity: 2, unitPrice: 45.00, total: 90.00 },
            { id: 2, name: 'Frozen Tilapia', quantity: 3, unitPrice: 65.00, total: 195.50 }
        ],
        shippingAddress: {
            street: '123 Accra Street',
            city: 'Accra',
            region: 'Greater Accra',
            zipCode: 'GA-123-4567'
        },
        paymentMethod: 'kowri',
        paymentStatus: 'pending',
        notes: 'Please deliver between 2-4 PM'
    },
    {
        id: 'ORD-002',
        customerName: 'Jane Smith',
        customerEmail: 'jane.smith@email.com',
        customerPhone: '+233 20 987 6543',
        orderDate: '2024-12-14T14:15:00Z',
        status: 'processing',
        total: 156.75,
        items: [
            { id: 3, name: 'Frozen Beef Steak', quantity: 1, unitPrice: 156.75, total: 156.75 }
        ],
        shippingAddress: {
            street: '456 Kumasi Avenue',
            city: 'Kumasi',
            region: 'Ashanti',
            zipCode: 'AS-456-7890'
        },
        paymentMethod: 'kowri',
        paymentStatus: 'completed',
        notes: ''
    },
    {
        id: 'ORD-003',
        customerName: 'Michael Johnson',
        customerEmail: 'michael.j@email.com',
        customerPhone: '+233 26 555 0123',
        orderDate: '2024-12-13T09:45:00Z',
        status: 'shipped',
        total: 234.25,
        items: [
            { id: 4, name: 'Frozen Salmon Fillet', quantity: 2, unitPrice: 89.50, total: 179.00 },
            { id: 5, name: 'Frozen Shrimp', quantity: 1, unitPrice: 55.25, total: 55.25 }
        ],
        shippingAddress: {
            street: '789 Takoradi Road',
            city: 'Takoradi',
            region: 'Western',
            zipCode: 'WR-789-0123'
        },
        paymentMethod: 'kowri',
        paymentStatus: 'completed',
        notes: 'Express delivery requested'
    },
    {
        id: 'ORD-004',
        customerName: 'Sarah Williams',
        customerEmail: 'sarah.w@email.com',
        customerPhone: '+233 23 444 5678',
        orderDate: '2024-12-12T16:20:00Z',
        status: 'delivered',
        total: 178.90,
        items: [
            { id: 6, name: 'Frozen Turkey Breast', quantity: 1, unitPrice: 123.40, total: 123.40 },
            { id: 7, name: 'Frozen Cod Fillet', quantity: 1, unitPrice: 55.50, total: 55.50 }
        ],
        shippingAddress: {
            street: '321 Tamale Boulevard',
            city: 'Tamale',
            region: 'Northern',
            zipCode: 'NR-321-4567'
        },
        paymentMethod: 'kowri',
        paymentStatus: 'completed',
        notes: 'Delivered successfully'
    },
    {
        id: 'ORD-005',
        customerName: 'David Brown',
        customerEmail: 'david.brown@email.com',
        customerPhone: '+233 27 333 2222',
        orderDate: '2024-12-11T11:10:00Z',
        status: 'cancelled',
        total: 95.75,
        items: [
            { id: 8, name: 'Frozen Pork Chops', quantity: 2, unitPrice: 47.875, total: 95.75 }
        ],
        shippingAddress: {
            street: '654 Cape Coast Street',
            city: 'Cape Coast',
            region: 'Central',
            zipCode: 'CR-654-8901'
        },
        paymentMethod: 'kowri',
        paymentStatus: 'refunded',
        notes: 'Customer requested cancellation'
    }
];
