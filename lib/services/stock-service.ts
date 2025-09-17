import { StockItem, StockMovement, StockSummary, StockFilters } from "@/types/stock";
// import { StockItem, StockMovement } from '@/types/admin';
import { mockStockItems, mockStockMovements } from '@/lib/mock/stock';

export const calculateStockStatus = (item: StockItem): StockItem => {
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
        status: status as StockItem['status'],
        totalValue: item.currentStock * item.unitPrice
    };
};

export const filterStockItems = (items: StockItem[], filters: StockFilters): StockItem[] => {
    let filteredItems = items.map(calculateStockStatus);

    if (filters.filter && filters.filter !== 'all') {
        filteredItems = filteredItems.filter(item => item.status === filters.filter);
    }

    if (filters.category) {
        filteredItems = filteredItems.filter(item =>
            item.category.toLowerCase() === filters.category!.toLowerCase()
        );
    }

    return filteredItems;
};

export const calculateStockSummary = (items: StockItem[]): StockSummary => {
    const itemsWithStatus = items.map(calculateStockStatus);

    return {
        totalItems: items.length,
        totalValue: items.reduce((sum, item) => sum + (item.currentStock * item.unitPrice), 0),
        lowStockItems: itemsWithStatus.filter(item => item.status === 'low-stock').length,
        outOfStockItems: itemsWithStatus.filter(item => item.status === 'out-of-stock').length,
        overstockedItems: itemsWithStatus.filter(item => item.status === 'overstocked').length,
        categories: [...new Set(items.map(item => item.category))],
        recentMovements: mockStockMovements.slice(0, 5)
    };
};

export const findStockItemById = (id: string): StockItem | undefined => {
    return mockStockItems.find(item => item.id === id);
};

export const validateStockMovement = (
    type: string,
    quantity: number,
    currentStock: number
): { isValid: boolean; error?: string } => {
    if (!['in', 'out', 'adjustment'].includes(type)) {
        return { isValid: false, error: 'Invalid movement type. Must be: in, out, or adjustment' };
    }

    const qty = parseInt(quantity.toString());
    if (isNaN(qty) || qty <= 0) {
        return { isValid: false, error: 'Quantity must be a positive number' };
    }

    if (type === 'out' && qty > currentStock) {
        return { isValid: false, error: 'Insufficient stock for this operation' };
    }

    return { isValid: true };
};

export const calculateNewStock = (
    currentStock: number,
    quantity: number,
    type: 'in' | 'out' | 'adjustment'
): number => {
    switch (type) {
        case 'in':
            return currentStock + quantity;
        case 'out':
            return currentStock - quantity;
        case 'adjustment':
            return quantity;
        default:
            return currentStock;
    }
};

export const createStockMovement = (
    itemId: string,
    type: 'in' | 'out' | 'adjustment',
    quantity: number,
    previousStock: number,
    newStock: number,
    reason?: string,
    reference?: string
): StockMovement => {
    return {
        id: `mov-${Date.now()}`,
        itemId,
        type,
        quantity,
        previousStock,
        newStock,
        reason: reason || `Stock ${type}`,
        reference: reference || `REF-${Date.now()}`,
        createdBy: 'admin',
        createdAt: new Date().toISOString()
    };
};
