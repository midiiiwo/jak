import { NextRequest, NextResponse } from 'next/server';

// Mock data for categories - In a real app, this would come from a database
// eslint-disable-next-line prefer-const
let categories = [
    {
        id: '1',
        name: 'Poultry',
        description: 'Fresh chicken, turkey, and other poultry products',
        slug: 'poultry',
        isActive: true,
        productCount: 15,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
    },
    {
        id: '2',
        name: 'Seafood',
        description: 'Fresh fish, prawns, crab and other seafood',
        slug: 'seafood',
        isActive: true,
        productCount: 12,
        createdAt: '2024-01-02T00:00:00Z',
        updatedAt: '2024-01-02T00:00:00Z',
    },
    {
        id: '3',
        name: 'Meat',
        description: 'Beef, goat, lamb and other meat products',
        slug: 'meat',
        isActive: true,
        productCount: 18,
        createdAt: '2024-01-03T00:00:00Z',
        updatedAt: '2024-01-03T00:00:00Z',
    },
    {
        id: '4',
        name: 'Processed Foods',
        description: 'Sausages, bacon and other processed meat products',
        slug: 'processed-foods',
        isActive: false,
        productCount: 8,
        createdAt: '2024-01-04T00:00:00Z',
        updatedAt: '2024-01-04T00:00:00Z',
    },
];

// GET - Fetch all categories
export async function GET() {
    try {
        return NextResponse.json({
            success: true,
            categories: categories.sort((a, b) => a.name.localeCompare(b.name)),
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch categories' },
            { status: 500 }
        );
    }
}

// POST - Create new category
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, description, isActive = true } = body;

        if (!name || !description) {
            return NextResponse.json(
                { success: false, error: 'Name and description are required' },
                { status: 400 }
            );
        }

        // Create slug from name
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

        // Check if category with same name or slug exists
        const existingCategory = categories.find(
            cat => cat.name.toLowerCase() === name.toLowerCase() || cat.slug === slug
        );

        if (existingCategory) {
            return NextResponse.json(
                { success: false, error: 'Category with this name already exists' },
                { status: 400 }
            );
        }

        const newCategory = {
            id: Date.now().toString(),
            name: name.trim(),
            description: description.trim(),
            slug,
            isActive,
            productCount: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        categories.push(newCategory);

        return NextResponse.json({
            success: true,
            category: newCategory,
            message: 'Category created successfully',
        });
    } catch (error) {
        console.error('Error creating category:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to create category' },
            { status: 500 }
        );
    }
}
