export interface StockItem {
    id: string;
    name: string;
    sku: string;
    category: string;
    currentStock: number;
    minStock: number;
    maxStock: number;
    unitPrice: number;
    totalValue: number;
    status: 'in-stock' | 'out-of-stock' | 'low-stock' | 'overstocked';
    lastUpdated: string;
    supplier: string;
    location: string;
    expiryDate: string;
}

export interface StockMovement {
    id: string;
    itemId: string;
    type: 'in' | 'out' | 'adjustment';
    quantity: number;
    previousStock: number;
    newStock: number;
    reason: string;
    reference: string;
    createdBy: string;
    createdAt: string;
}

export interface StockSummary {
    totalItems: number;
    totalValue: number;
    lowStockItems: number;
    outOfStockItems: number;
    overstockedItems: number;
    categories: string[];
    recentMovements: StockMovement[];
}

export interface StockFilters {
    filter?: string;
    category?: string;
}

export interface StockMovementRequest {
    itemId: string;
    type: 'in' | 'out' | 'adjustment';
    quantity: number;
    reason?: string;
    reference?: string;
}

export interface StockUpdateRequest {
    itemId: string;
    minStock?: number;
    maxStock?: number;
    supplier?: string;
    location?: string;
}
