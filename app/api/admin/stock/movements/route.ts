import { NextRequest, NextResponse } from 'next/server';

// Mock data for stock movements
const mockStockMovements = [
    {
        id: '1',
        itemId: 'item-1',
        itemName: 'Full Chicken',
        type: 'in',
        quantity: 50,
        reason: 'New shipment received',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        user: 'Admin User'
    },
    {
        id: '2',
        itemId: 'item-2',
        itemName: 'Salmon Fillet',
        type: 'out',
        quantity: 15,
        reason: 'Customer order fulfillment',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        user: 'Admin User'
    },
    {
        id: '3',
        itemId: 'item-3',
        itemName: 'Goat Meat',
        type: 'adjustment',
        quantity: -3,
        reason: 'Inventory reconciliation - damaged goods',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        user: 'Admin User'
    },
    {
        id: '4',
        itemId: 'item-4',
        itemName: 'Chicken Gizzard',
        type: 'in',
        quantity: 25,
        reason: 'Restocking from supplier',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        user: 'Admin User'
    },
    {
        id: '5',
        itemId: 'item-1',
        itemName: 'Full Chicken',
        type: 'out',
        quantity: 20,
        reason: 'Bulk order shipment',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        user: 'Admin User'
    }
];

export async function GET() {
    try {
        return NextResponse.json({
            success: true,
            movements: mockStockMovements
        });
    } catch (error) {
        console.error('Error fetching stock movements:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch stock movements' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { itemId, type, quantity, reason } = body;

        // Validate required fields
        if (!itemId || !type || !quantity || !reason) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Create new stock movement
        const newMovement = {
            id: `movement-${Date.now()}`,
            itemId,
            itemName: 'Product Name', // In real app, fetch from products table
            type,
            quantity: parseInt(quantity),
            reason,
            timestamp: new Date().toISOString(),
            user: 'Admin User' // In real app, get from auth session
        };

        // In a real application, you would:
        // 1. Save the movement to database
        // 2. Update the product's current stock
        // 3. Check stock thresholds and create alerts

        mockStockMovements.unshift(newMovement);

        return NextResponse.json({
            success: true,
            movement: newMovement,
            message: 'Stock movement recorded successfully'
        });
    } catch (error) {
        console.error('Error recording stock movement:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to record stock movement' },
            { status: 500 }
        );
    }
}
