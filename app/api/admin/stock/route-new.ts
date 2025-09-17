import { NextRequest, NextResponse } from 'next/server';

// Mock data for stock items
const mockStockItems = [
    {
        id: 'item-1',
        productId: 'prod-1',
        name: 'Full Chicken',
        category: 'Poultry',
        sku: 'FC-001',
        currentStock: 45,
        minStock: 10,
        maxStock: 100,
        unitPrice: 200,
        totalValue: 9000,
        location: 'Freezer A',
        supplier: 'Fresh Farms Ltd',
        lastUpdated: new Date().toISOString()
    },
    {
        id: 'item-2',
        productId: 'prod-2',
        name: 'Gizzard',
        category: 'Meat',
        sku: 'GZ-001',
        currentStock: 8,
        minStock: 15,
        maxStock: 50,
        unitPrice: 350,
        totalValue: 2800,
        location: 'Freezer B',
        supplier: 'Meat Masters',
        lastUpdated: new Date().toISOString()
    },
    {
        id: 'item-3',
        productId: 'prod-3',
        name: 'Salmon',
        category: 'SeaFood',
        sku: 'SM-001',
        currentStock: 22,
        minStock: 10,
        maxStock: 40,
        unitPrice: 200,
        totalValue: 4400,
        location: 'Freezer C',
        supplier: 'Ocean Fresh',
        lastUpdated: new Date().toISOString()
    },
    {
        id: 'item-4',
        productId: 'prod-4',
        name: 'Goat Meat',
        category: 'Meat',
        sku: 'GM-001',
        currentStock: 0,
        minStock: 5,
        maxStock: 30,
        unitPrice: 150,
        totalValue: 0,
        location: 'Freezer A',
        supplier: 'Local Farms',
        lastUpdated: new Date().toISOString()
    }
];

// Mock stock movements history
const stockMovements = [
    {
        id: 'mov-1',
        itemId: 'item-1',
        type: 'in',
        quantity: 20,
        previousStock: 25,
        newStock: 45,
        reason: 'New shipment received',
        reference: 'PO-2024-001',
        createdBy: 'admin',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    },
    {
        id: 'mov-2',
        itemId: 'item-2',
        type: 'out',
        quantity: 7,
        previousStock: 15,
        newStock: 8,
        reason: 'Customer order',
        reference: 'ORD-2024-015',
        createdBy: 'admin',
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
    }
];

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const filter = searchParams.get('filter') || 'all';
        const category = searchParams.get('category');

        // Calculate dynamic status based on current stock levels
        let itemsWithStatus = mockStockItems.map(item => {
            let status = 'in-stock';

            if (item.currentStock === 0) {
                status = 'out-of-stock';
            } else if (item.currentStock <= item.minStock) {
                status = 'low-stock';
            } else if (item.currentStock >= item.maxStock) {
                status = 'overstocked';
            }

            return { ...item, status };
        });

        // Filter by category if specified
        if (category && category !== 'all') {
            itemsWithStatus = itemsWithStatus.filter(item =>
                item.category.toLowerCase() === category.toLowerCase()
            );
        }

        // Filter by stock status
        if (filter !== 'all') {
            itemsWithStatus = itemsWithStatus.filter(item => {
                switch (filter) {
                    case 'low-stock':
                        return item.status === 'low-stock';
                    case 'out-of-stock':
                        return item.status === 'out-of-stock';
                    case 'overstocked':
                        return item.status === 'overstocked';
                    default:
                        return true;
                }
            });
        }

        // Calculate summary statistics
        const totalItems = mockStockItems.length;
        const lowStockItems = mockStockItems.filter(item =>
            item.currentStock <= item.minStock && item.currentStock > 0
        ).length;
        const outOfStockItems = mockStockItems.filter(item =>
            item.currentStock === 0
        ).length;
        const totalValue = mockStockItems.reduce((sum, item) => sum + item.totalValue, 0);

        return NextResponse.json({
            success: true,
            data: {
                items: itemsWithStatus,
                summary: {
                    totalItems,
                    lowStockItems,
                    outOfStockItems,
                    totalValue,
                    inStockItems: totalItems - outOfStockItems
                },
                recentMovements: stockMovements.slice(0, 5)
            }
        });
    } catch (error) {
        console.error('Error fetching stock data:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch stock data' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const { itemId, type, quantity, reason, reference } = await request.json();

        // Validate required fields
        if (!itemId || !type || !quantity) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields: itemId, type, and quantity are required' },
                { status: 400 }
            );
        }

        // Validate movement type
        if (!['in', 'out', 'adjustment'].includes(type)) {
            return NextResponse.json(
                { success: false, error: 'Invalid movement type. Must be: in, out, or adjustment' },
                { status: 400 }
            );
        }

        // Validate quantity
        const qty = parseInt(quantity);
        if (isNaN(qty) || qty <= 0) {
            return NextResponse.json(
                { success: false, error: 'Quantity must be a positive number' },
                { status: 400 }
            );
        }

        // Find the item
        const itemIndex = mockStockItems.findIndex(item => item.id === itemId);
        if (itemIndex === -1) {
            return NextResponse.json(
                { success: false, error: 'Stock item not found' },
                { status: 404 }
            );
        }

        const item = mockStockItems[itemIndex];
        const previousStock = item.currentStock;
        let newStock = previousStock;

        // Calculate new stock based on movement type
        switch (type) {
            case 'in':
                newStock = previousStock + qty;
                break;
            case 'out':
                newStock = Math.max(0, previousStock - qty);
                break;
            case 'adjustment':
                newStock = qty;
                break;
        }

        // Update the item
        mockStockItems[itemIndex] = {
            ...item,
            currentStock: newStock,
            totalValue: newStock * item.unitPrice,
            lastUpdated: new Date().toISOString()
        };

        // Create movement record
        const movement = {
            id: `mov-${Date.now()}`,
            itemId,
            type,
            quantity: qty,
            previousStock,
            newStock,
            reason: reason || `Stock ${type}`,
            reference: reference || `REF-${Date.now()}`,
            createdBy: 'admin',
            createdAt: new Date().toISOString()
        };

        stockMovements.unshift(movement);

        return NextResponse.json({
            success: true,
            message: 'Stock updated successfully',
            item: mockStockItems[itemIndex],
            movement
        });
    } catch (error) {
        console.error('Error updating stock:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to update stock' },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest) {
    try {
        const { itemId, minStock, maxStock, location, supplier } = await request.json();

        if (!itemId) {
            return NextResponse.json(
                { success: false, error: 'Item ID is required' },
                { status: 400 }
            );
        }

        const itemIndex = mockStockItems.findIndex(item => item.id === itemId);
        if (itemIndex === -1) {
            return NextResponse.json(
                { success: false, error: 'Stock item not found' },
                { status: 404 }
            );
        }

        // Update item settings
        const updates: Record<string, string | number> = {};
        if (minStock !== undefined) updates.minStock = parseInt(minStock);
        if (maxStock !== undefined) updates.maxStock = parseInt(maxStock);
        if (location !== undefined) updates.location = location;
        if (supplier !== undefined) updates.supplier = supplier;
        updates.lastUpdated = new Date().toISOString();

        mockStockItems[itemIndex] = {
            ...mockStockItems[itemIndex],
            ...updates
        };

        return NextResponse.json({
            success: true,
            message: 'Stock item updated successfully',
            item: mockStockItems[itemIndex]
        });
    } catch (error) {
        console.error('Error updating stock item:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to update stock item' },
            { status: 500 }
        );
    }
}
