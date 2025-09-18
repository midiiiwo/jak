import { NextResponse } from "next/server";
import { db } from "@/lib/firebase/admin";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    let query = db.collection("products").where("status", "==", "active");

    // Filter by category if specified
    if (category && category !== "all") {
      query = query.where("category", "==", category.toLowerCase());
    }

    // Add ordering
    query = query.orderBy(sortBy, sortOrder as "asc" | "desc");

    const snapshot = await query.get();
    let products = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      inStock: doc.data().stock > 0,
      // Format price for client display
      formattedPrice: `GHC ${doc.data().price}`,
      // Use first image if available, otherwise fallback
      image: doc.data().images?.[0] || "img-1.jpeg",
    }));

    // Apply search filter on the client side (for simplicity)
    if (search) {
      const searchLower = search.toLowerCase();
      products = products.filter(
        (product) =>
          product.title.toLowerCase().includes(searchLower) ||
          product.description.toLowerCase().includes(searchLower)
      );
    }

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProducts = products.slice(startIndex, endIndex);

    // Get categories for filter dropdown
    const categoriesSnapshot = await db
      .collection("categories")
      .where("status", "==", "active")
      .orderBy("name")
      .get();

    const categories = categoriesSnapshot.docs.map((doc) => ({
      id: doc.id,
      name: doc.data().name,
      slug: doc.data().name.toLowerCase(),
    }));

    return NextResponse.json({
      success: true,
      products: paginatedProducts,
      pagination: {
        page,
        limit,
        total: products.length,
        totalPages: Math.ceil(products.length / limit),
        hasNext: endIndex < products.length,
        hasPrev: page > 1,
      },
      categories,
      filters: {
        category,
        search,
        sortBy,
        sortOrder,
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch products",
      },
      { status: 500 }
    );
  }
}
