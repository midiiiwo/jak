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

// GET - Fetch single category
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const category = categories.find(cat => cat.id === id);

        if (!category) {
            return NextResponse.json(
                { success: false, error: 'Category not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            category,
        });
    } catch (error) {
        console.error('Error fetching category:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch category' },
            { status: 500 }
        );
    }
}

// PUT - Update category
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { name, description, isActive } = body;

        const categoryIndex = categories.findIndex(cat => cat.id === id);

        if (categoryIndex === -1) {
            return NextResponse.json(
                { success: false, error: 'Category not found' },
                { status: 404 }
            );
        }

        // Check if another category has the same name
        const existingCategory = categories.find(
            (cat, index) => index !== categoryIndex &&
                cat.name.toLowerCase() === name?.toLowerCase()
        );

        if (existingCategory) {
            return NextResponse.json(
                { success: false, error: 'Category with this name already exists' },
                { status: 400 }
            );
        }

        // Update category
        const updatedCategory = {
            ...categories[categoryIndex],
            ...(name && { name: name.trim() }),
            ...(description !== undefined && { description: description.trim() }),
            ...(isActive !== undefined && { isActive }),
            updatedAt: new Date().toISOString(),
        };

        // Update slug if name changed
        if (name && name !== categories[categoryIndex].name) {
            updatedCategory.slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        }

        categories[categoryIndex] = updatedCategory;

        return NextResponse.json({
            success: true,
            category: updatedCategory,
            message: 'Category updated successfully',
        });
    } catch (error) {
        console.error('Error updating category:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to update category' },
            { status: 500 }
        );
    }
}

// PATCH - Partial update (e.g., toggle status)
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();

        const categoryIndex = categories.findIndex(cat => cat.id === id);

        if (categoryIndex === -1) {
            return NextResponse.json(
                { success: false, error: 'Category not found' },
                { status: 404 }
            );
        }

        // Update only provided fields
        const updatedCategory = {
            ...categories[categoryIndex],
            ...body,
            updatedAt: new Date().toISOString(),
        };

        categories[categoryIndex] = updatedCategory;

        return NextResponse.json({
            success: true,
            category: updatedCategory,
            message: 'Category updated successfully',
        });
    } catch (error) {
        console.error('Error updating category:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to update category' },
            { status: 500 }
        );
    }
}

// DELETE - Delete category
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const categoryIndex = categories.findIndex(cat => cat.id === id);

        if (categoryIndex === -1) {
            return NextResponse.json(
                { success: false, error: 'Category not found' },
                { status: 404 }
            );
        }

        const category = categories[categoryIndex];

        // Check if category has products
        if (category.productCount > 0) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Cannot delete category with existing products. Please move or delete products first.'
                },
                { status: 400 }
            );
        }

        // Remove category
        categories.splice(categoryIndex, 1);

        return NextResponse.json({
            success: true,
            message: 'Category deleted successfully',
        });
    } catch (error) {
        console.error('Error deleting category:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to delete category' },
            { status: 500 }
        );
    }
}
