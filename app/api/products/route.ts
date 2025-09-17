import { NextResponse } from 'next/server';

// This will serve as the bridge between admin-managed products and client-side display
// In production, this would fetch from your actual database

export async function GET() {
    try {
        // This would typically fetch from your database
        // For now, we'll return the current static data structure
        // that matches what the client components expect

        const products = [
            {
                image: "img-1.jpeg",
                title: "Full Chicken",
                category: "Poultry",
                description: "Fresh whole chicken, perfect for roasting or grilling.",
                price: "GHC 200",
                inStock: true,
                stock: 50
            },
            {
                image: "img-1.jpeg",
                title: "Gizzard",
                category: "Meat",
                description: "Fresh chicken gizzards, rich in protein and nutrients.",
                price: "GHC 350",
                inStock: true,
                stock: 25
            },
            {
                image: "img-1.jpeg",
                title: "Salmon",
                category: "SeaFood",
                description: "Premium quality salmon, rich in omega-3 fatty acids.",
                price: "GHC 200",
                inStock: true,
                stock: 30
            },
            {
                image: "img-1.jpeg",
                title: "Goat",
                category: "Meat",
                description: "Tender goat meat, perfect for traditional cooking.",
                price: "GHC 150",
                inStock: false,
                stock: 0
            }
        ];

        return NextResponse.json({
            success: true,
            products
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to fetch products'
        }, { status: 500 });
    }
}
