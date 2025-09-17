import { NextRequest, NextResponse } from 'next/server';
import { mockOrders } from '@/lib/mock/orders';
import {
    filterOrders,
    calculateOrderStats,
    validateOrderData,
    calculateOrderTotal,
    generateOrderId,
    findOrderById
} from '@/lib/services/order-service';
import { Order, OrderItem } from '@/types/order';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const filters = {
            status: searchParams.get('status') || '',
            startDate: searchParams.get('startDate') || '',
            endDate: searchParams.get('endDate') || '',
            search: searchParams.get('search') || ''
        };

        const filteredOrders = filterOrders(mockOrders, filters);
        const stats = calculateOrderStats(mockOrders);

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

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const missingFields = validateOrderData(body);

        if (missingFields.length > 0) {
            return NextResponse.json(
                { success: false, error: `Missing required fields: ${missingFields.join(', ')}` },
                { status: 400 }
            );
        }

        const total = calculateOrderTotal(body.items);
        const newOrderId = generateOrderId(mockOrders.length);

        const newOrder: Order = {
            id: newOrderId,
            customerName: body.customerName,
            customerEmail: body.customerEmail,
            customerPhone: body.customerPhone || '',
            orderDate: new Date().toISOString(),
            status: 'pending',
            total,
            items: body.items.map((item: { id: number; name: string; quantity: number; unitPrice: number; }) => ({
                id: item.id,
                name: item.name,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                total: item.quantity * item.unitPrice
            })),
            shippingAddress: body.shippingAddress || {
                street: '',
                city: '',
                region: '',
                zipCode: ''
            },
            paymentMethod: body.paymentMethod || 'kowri',
            paymentStatus: 'pending',
            notes: body.notes || ''
        };

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

        const order = findOrderById(id);
        if (!order) {
            return NextResponse.json(
                { success: false, error: 'Order not found' },
                { status: 404 }
            );
        }

        const updatedOrder = {
            ...order,
            ...updateData
        };

        // In a real app, you would update in database
        const orderIndex = mockOrders.findIndex(o => o.id === id);
        mockOrders[orderIndex] = updatedOrder;

        return NextResponse.json({
            success: true,
            data: updatedOrder
        });
    } catch (error) {
        console.error('Error updating order:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to update order' },
            { status: 500 }
        );
    }
}
