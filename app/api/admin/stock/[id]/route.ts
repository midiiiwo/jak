import { NextRequest, NextResponse } from 'next/server';

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const { currentStock } = await request.json();

        // In a real application, you would update the database
        // For now, we'll just return a success response

        return NextResponse.json({
            success: true,
            message: 'Stock updated successfully',
            item: {
                id,
                currentStock: parseInt(currentStock),
                lastUpdated: new Date().toISOString()
            }
        });
    } catch (error) {
        console.error('Error updating stock item:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to update stock item' },
            { status: 500 }
        );
    }
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        // In a real application, you would fetch from database
        // For now, we'll return mock data

        return NextResponse.json({
            success: true,
            item: {
                id,
                name: 'Sample Product',
                sku: 'SKU-001',
                category: 'Sample Category',
                currentStock: 50,
                minStock: 10,
                maxStock: 100,
                unitPrice: 25.00,
                totalValue: 1250.00,
                status: 'in-stock',
                lastUpdated: new Date().toISOString(),
                supplier: 'Sample Supplier',
                location: 'Freezer A1'
            }
        });
    } catch (error) {
        console.error('Error fetching stock item:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch stock item' },
            { status: 500 }
        );
    }
}
