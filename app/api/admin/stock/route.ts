import { NextRequest, NextResponse } from 'next/server';
import { mockStockItems, mockStockMovements } from '@/lib/mock/stock';
import {
    filterStockItems,
    calculateStockSummary,
    findStockItemById,
    validateStockMovement,
    calculateNewStock,
    createStockMovement
} from '@/lib/services/stock-service';
import { StockMovementRequest, StockUpdateRequest } from '@/types/stock';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const filters = {
            filter: searchParams.get('filter') || 'all',
            category: searchParams.get('category') || undefined
        };

        const filteredItems = filterStockItems(mockStockItems, filters);
        const summary = calculateStockSummary(mockStockItems);

        return NextResponse.json({
            success: true,
            items: filteredItems,
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
        const { itemId, type, quantity, reason, reference } = await request.json() as StockMovementRequest;

        // Validate required fields
        if (!itemId || !type || !quantity) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields: itemId, type, and quantity are required' },
                { status: 400 }
            );
        }

        const item = findStockItemById(itemId);
        if (!item) {
            return NextResponse.json(
                { success: false, error: 'Stock item not found' },
                { status: 404 }
            );
        }

        // Validate movement
        const validation = validateStockMovement(type, quantity, item.currentStock);
        if (!validation.isValid) {
            return NextResponse.json(
                { success: false, error: validation.error },
                { status: 400 }
            );
        }

        const previousStock = item.currentStock;
        const newStock = calculateNewStock(previousStock, quantity, type);

        // Update the item
        const itemIndex = mockStockItems.findIndex(i => i.id === itemId);
        mockStockItems[itemIndex] = {
            ...item,
            currentStock: newStock,
            totalValue: newStock * item.unitPrice,
            lastUpdated: new Date().toISOString()
        };

        // Create movement record
        const movement = createStockMovement(
            itemId,
            type,
            quantity,
            previousStock,
            newStock,
            reason,
            reference
        );

        mockStockMovements.unshift(movement);

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
        const { itemId, minStock, maxStock, supplier, location } = await request.json() as StockUpdateRequest;

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
        if (minStock !== undefined) updates.minStock = typeof minStock === 'string' ? parseInt(minStock) : minStock;
        if (maxStock !== undefined) updates.maxStock = typeof maxStock === 'string' ? parseInt(maxStock) : maxStock;
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
