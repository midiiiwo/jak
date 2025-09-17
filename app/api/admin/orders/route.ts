import { NextRequest, NextResponse } from 'next/server';

// Mock orders data
const mockOrders = [
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

// GET - Fetch all orders
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');
        const search = searchParams.get('search');

        let filteredOrders = [...mockOrders];

        // Filter by status
        if (status && status !== 'all') {
            filteredOrders = filteredOrders.filter(order => order.status === status);
        }

        // Filter by date range
        if (startDate) {
            filteredOrders = filteredOrders.filter(order =>
                new Date(order.orderDate) >= new Date(startDate)
            );
        }
        if (endDate) {
            filteredOrders = filteredOrders.filter(order =>
                new Date(order.orderDate) <= new Date(endDate)
            );
        }

        // Search filter
        if (search) {
            const searchLower = search.toLowerCase();
            filteredOrders = filteredOrders.filter(order =>
                order.id.toLowerCase().includes(searchLower) ||
                order.customerName.toLowerCase().includes(searchLower) ||
                order.customerEmail.toLowerCase().includes(searchLower)
            );
        }

        // Calculate order statistics
        const stats = {
            totalOrders: mockOrders.length,
            pendingOrders: mockOrders.filter(o => o.status === 'pending').length,
            processingOrders: mockOrders.filter(o => o.status === 'processing').length,
            shippedOrders: mockOrders.filter(o => o.status === 'shipped').length,
            deliveredOrders: mockOrders.filter(o => o.status === 'delivered').length,
            cancelledOrders: mockOrders.filter(o => o.status === 'cancelled').length,
            totalRevenue: mockOrders
                .filter(o => o.status !== 'cancelled')
                .reduce((sum, order) => sum + order.total, 0),
            averageOrderValue: mockOrders
                .filter(o => o.status !== 'cancelled')
                .reduce((sum, order) => sum + order.total, 0) /
                mockOrders.filter(o => o.status !== 'cancelled').length
        };

        return NextResponse.json({
            success: true,
            data: {
                orders: filteredOrders,
                stats
            }
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch orders' },
            { status: 500 }
        );
    }
}

// POST - Create new order
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Basic validation
        if (!body.customerName || !body.customerEmail || !body.items || body.items.length === 0) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Generate new order ID
        const newOrderId = `ORD-${String(mockOrders.length + 1).padStart(3, '0')}`;

        // Calculate total
        const total = body.items.reduce((sum: number, item: { quantity: number; unitPrice: number }) =>
            sum + (item.quantity * item.unitPrice), 0
        );

        const newOrder = {
            id: newOrderId,
            customerName: body.customerName,
            customerEmail: body.customerEmail,
            customerPhone: body.customerPhone || '',
            orderDate: new Date().toISOString(),
            status: 'pending',
            total,
            items: body.items,
            shippingAddress: body.shippingAddress || {},
            paymentMethod: body.paymentMethod || 'kowri',
            paymentStatus: 'pending',
            notes: body.notes || ''
        };

        // In a real app, this would be saved to database
        mockOrders.unshift(newOrder);

        return NextResponse.json({
            success: true,
            data: newOrder
        }, { status: 201 });
    } catch (error) {
        console.error('Error creating order:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to create order' },
            { status: 500 }
        );
    }
}

// PUT - Update existing order
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, ...updateData } = body;

        if (!id) {
            return NextResponse.json(
                { success: false, error: 'Order ID is required' },
                { status: 400 }
            );
        }

        const orderIndex = mockOrders.findIndex(order => order.id === id);
        if (orderIndex === -1) {
            return NextResponse.json(
                { success: false, error: 'Order not found' },
                { status: 404 }
            );
        }

        // Update the order
        mockOrders[orderIndex] = {
            ...mockOrders[orderIndex],
            ...updateData
        };

        return NextResponse.json({
            success: true,
            data: mockOrders[orderIndex]
        });
    } catch (error) {
        console.error('Error updating order:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to update order' },
            { status: 500 }
        );
    }
}
