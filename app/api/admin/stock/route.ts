import { NextRequest, NextResponse } from 'next/server';

// Mock data for stock items with comprehensive details
const mockStockItems = [
    {
        id: 'item-1',
        name: 'Full Chicken',
        sku: 'FC-001',
        category: 'Poultry',
        currentStock: 45,
        minStock: 10,
        maxStock: 100,
        unitPrice: 25.00,
        totalValue: 1125.00,
        status: 'in-stock',
        lastUpdated: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        supplier: 'Fresh Farms Ltd',
        location: 'Freezer A1',
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    },
    {
        id: 'item-2',
        name: 'Salmon Fillet',
        sku: 'SF-002',
        category: 'Seafood',
        currentStock: 8,
        minStock: 15,
        maxStock: 50,
        unitPrice: 45.00,
        totalValue: 360.00,
        status: 'low-stock',
        lastUpdated: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        supplier: 'Ocean Fresh Co',
        location: 'Freezer B2',
        expiryDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    },
    {
        id: 'item-3',
        name: 'Goat Meat',
        sku: 'GM-003',
        category: 'Meat',
        currentStock: 0,
        minStock: 5,
        maxStock: 30,
        unitPrice: 35.00,
        totalValue: 0.00,
        status: 'out-of-stock',
        lastUpdated: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        supplier: 'Local Butchers',
        location: 'Freezer C1',
        expiryDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    },
    {
        id: 'item-4',
        name: 'Chicken Gizzard',
        sku: 'CG-004',
        category: 'Poultry',
        currentStock: 22,
        minStock: 8,
        maxStock: 40,
        unitPrice: 15.00,
        totalValue: 330.00,
        status: 'in-stock',
        lastUpdated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        supplier: 'Fresh Farms Ltd',
        location: 'Freezer A2',
        expiryDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    },
    {
        id: 'item-5',
        name: 'Beef Steak',
        sku: 'BS-005',
        category: 'Beef',
        currentStock: 85,
        minStock: 20,
        maxStock: 60,
        unitPrice: 55.00,
        totalValue: 4675.00,
        status: 'overstocked',
        lastUpdated: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        supplier: 'Premium Meats',
        location: 'Freezer D1',
        expiryDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    },
    {
        id: 'item-6',
        name: 'Prawns',
        sku: 'PR-006',
        category: 'Seafood',
        currentStock: 4,
        minStock: 10,
        maxStock: 25,
        unitPrice: 65.00,
        totalValue: 260.00,
        status: 'low-stock',
        lastUpdated: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        supplier: 'Ocean Fresh Co',
        location: 'Freezer B1',
        expiryDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
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
            } else if (item.currentStock > item.maxStock) {
                status = 'overstocked';
            }

            return {
                ...item,
                status,
                totalValue: item.currentStock * item.unitPrice
            };
        });

        // Apply filters
        if (filter !== 'all') {
            itemsWithStatus = itemsWithStatus.filter(item => item.status === filter);
        }

        if (category) {
            itemsWithStatus = itemsWithStatus.filter(item =>
                item.category.toLowerCase() === category.toLowerCase()
            );
        }

        // Calculate summary statistics
        const summary = {
            totalItems: mockStockItems.length,
            totalValue: mockStockItems.reduce((sum, item) => sum + (item.currentStock * item.unitPrice), 0),
            lowStockItems: mockStockItems.filter(item => item.currentStock <= item.minStock && item.currentStock > 0).length,
            outOfStockItems: mockStockItems.filter(item => item.currentStock === 0).length,
            overstockedItems: mockStockItems.filter(item => item.currentStock > item.maxStock).length,
            categories: [...new Set(mockStockItems.map(item => item.category))],
            recentMovements: stockMovements.slice(0, 5)
        };

        return NextResponse.json({
            success: true,
            items: itemsWithStatus,
            summary
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

        // Apply stock movement
        switch (type) {
            case 'in':
                newStock += qty;
                break;
            case 'out':
                if (qty > previousStock) {
                    return NextResponse.json(
                        { success: false, error: 'Insufficient stock for this operation' },
                        { status: 400 }
                    );
                }
                newStock = previousStock - qty;
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
        const { itemId, minStock, maxStock, supplier, location } = await request.json();

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
        if (supplier !== undefined) updates.supplier = supplier;
        if (location !== undefined) updates.location = location;

        mockStockItems[itemIndex] = {
            ...mockStockItems[itemIndex],
            ...updates,
            lastUpdated: new Date().toISOString()
        };

        return NextResponse.json({
            success: true,
            message: 'Stock item settings updated successfully',
            item: mockStockItems[itemIndex]
        });
    } catch (error) {
        console.error('Error updating stock item settings:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to update stock item settings' },
            { status: 500 }
        );
    }
}
