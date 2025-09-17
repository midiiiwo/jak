import { NextRequest, NextResponse } from 'next/server';
import { Product } from '@/types/admin';

// Mock database - In production, use Prisma with PostgreSQL/MongoDB
// eslint-disable-next-line prefer-const
let products: Product[] = [
    {
        id: '1',
        title: 'Full Chicken',
        description: 'Fresh whole chicken, perfect for roasting or grilling.',
        price: 200,
        category: 'Poultry',
        image: '/img-1.jpeg',
        stock: 50,
        inStock: true,
        sku: 'FC001',
        unit: 'piece',
        minStockLevel: 10,
        cost: 150,
        isActive: true,
        isFeatured: true,
        tags: ['chicken', 'poultry', 'fresh'],
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'admin',
        updatedBy: 'admin'
    },
    // Add more mock products...
];

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const inStock = searchParams.get('inStock');

    let filteredProducts = [...products];

    // Apply filters
    if (category) {
        filteredProducts = filteredProducts.filter(p => p.category === category);
    }

    if (search) {
        filteredProducts = filteredProducts.filter(p =>
            p.title.toLowerCase().includes(search.toLowerCase()) ||
            p.description.toLowerCase().includes(search.toLowerCase()) ||
            p.sku.toLowerCase().includes(search.toLowerCase())
        );
    }

    if (inStock === 'true') {
        filteredProducts = filteredProducts.filter(p => p.inStock);
    } else if (inStock === 'false') {
        filteredProducts = filteredProducts.filter(p => !p.inStock);
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    return NextResponse.json({
        products: paginatedProducts,
        pagination: {
            page,
            limit,
            total: filteredProducts.length,
            totalPages: Math.ceil(filteredProducts.length / limit)
        }
    });
}

export async function POST(request: NextRequest) {
    try {
        const productData = await request.json();

        const newProduct: Product = {
            ...productData,
            id: Date.now().toString(),
            inStock: productData.stock > 0,
            createdAt: new Date(),
            updatedAt: new Date(),
            createdBy: 'admin', // In production, get from JWT token
            updatedBy: 'admin'
        };

        products.push(newProduct);

        return NextResponse.json({
            success: true,
            product: newProduct
        }, { status: 201 });
    } catch (error) {
        console.error('Create product error:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to create product'
        }, { status: 500 });
    }
}
