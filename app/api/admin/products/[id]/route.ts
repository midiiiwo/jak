import { NextRequest, NextResponse } from 'next/server';
import { Product } from '@/types/admin';

// Mock database - same as in route.ts
// eslint-disable-next-line prefer-const
let products: Product[] = [];

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const product = products.find(p => p.id === id);

    if (!product) {
        return NextResponse.json({
            success: false,
            error: 'Product not found'
        }, { status: 404 });
    }

    return NextResponse.json({
        success: true,
        product
    });
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const productData = await request.json();
        const productIndex = products.findIndex(p => p.id === id);

        if (productIndex === -1) {
            return NextResponse.json({
                success: false,
                error: 'Product not found'
            }, { status: 404 });
        }

        const updatedProduct: Product = {
            ...products[productIndex],
            ...productData,
            inStock: productData.stock > 0,
            updatedAt: new Date(),
            updatedBy: 'admin' // In production, get from JWT token
        };

        products[productIndex] = updatedProduct;

        return NextResponse.json({
            success: true,
            product: updatedProduct
        });
    } catch (error) {
        console.error('Update product error:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to update product'
        }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const productIndex = products.findIndex(p => p.id === id);

    if (productIndex === -1) {
        return NextResponse.json({
            success: false,
            error: 'Product not found'
        }, { status: 404 });
    }

    products.splice(productIndex, 1);

    return NextResponse.json({
        success: true,
        message: 'Product deleted successfully'
    });
}
