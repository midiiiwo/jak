import { NextRequest, NextResponse } from 'next/server';

// This would normally come from your database
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
    }
];

// GET - Fetch single order by ID
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const order = mockOrders.find(order => order.id === id);

        if (!order) {
            return NextResponse.json(
                { success: false, error: 'Order not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: order
        });
    } catch (error) {
        console.error('Error fetching order:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch order' },
            { status: 500 }
        );
    }
}

// PUT - Update order status
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();

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
            ...body
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

// DELETE - Cancel/Delete order
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const orderIndex = mockOrders.findIndex(order => order.id === id);

        if (orderIndex === -1) {
            return NextResponse.json(
                { success: false, error: 'Order not found' },
                { status: 404 }
            );
        }

        // Remove the order or mark as cancelled
        mockOrders[orderIndex].status = 'cancelled';

        return NextResponse.json({
            success: true,
            message: 'Order cancelled successfully'
        });
    } catch (error) {
        console.error('Error cancelling order:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to cancel order' },
            { status: 500 }
        );
    }
}
