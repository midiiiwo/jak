import { NextResponse } from "next/server";
import { db } from "@/lib/firebase/admin";

export async function GET() {
  try {
    // Fetch only active categories with product counts
    const categoriesSnapshot = await db
      .collection("categories")
      .where("status", "==", "active")
      .orderBy("name")
      .get();

    const categories = await Promise.all(
      categoriesSnapshot.docs.map(async (doc) => {
        const categoryData = doc.data();

        // Get product count for this category
        const productsSnapshot = await db
          .collection("products")
          .where("category", "==", categoryData.name.toLowerCase())
          .where("status", "==", "active")
          .get();

        return {
          id: doc.id,
          name: categoryData.name,
          description: categoryData.description,
          slug: categoryData.name.toLowerCase().replace(/\s+/g, "-"),
          productCount: productsSnapshot.size,
          createdAt: categoryData.createdAt?.toDate?.()?.toISOString() || null,
        };
      })
    );

    // Add an "All" category option
    const allProductsSnapshot = await db
      .collection("products")
      .where("status", "==", "active")
      .get();

    const categoriesWithAll = [
      {
        id: "all",
        name: "All Products",
        description: "Browse all available products",
        slug: "all",
        productCount: allProductsSnapshot.size,
        createdAt: null,
      },
      ...categories,
    ];

    return NextResponse.json({
      success: true,
      categories: categoriesWithAll,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch categories",
      },
      { status: 500 }
    );
  }
}
