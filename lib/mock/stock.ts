import { StockItem, StockMovement } from "@/types/stock";

export const mockStockItems: StockItem[] = [
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

export const mockStockMovements: StockMovement[] = [
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
