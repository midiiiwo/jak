import { NextRequest, NextResponse } from "next/server";
import { Product } from "@/types/admin";
import { productService } from "@/lib/services/database-service";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const category = searchParams.get("category") || undefined;
    const search = searchParams.get("search") || undefined;
    const inStockParam = searchParams.get("inStock");

    let inStock: boolean | undefined;
    if (inStockParam === "true") {
      inStock = true;
    } else if (inStockParam === "false") {
      inStock = false;
    }

    const result = await productService.getProducts({
      page,
      limit,
      category,
      search,
      inStock,
    });

    return NextResponse.json({
      success: true,
      products: result.products,
      pagination: {
        page,
        limit,
        total: result.total,
        totalPages: Math.ceil(result.total / limit),
        hasMore: result.hasMore,
      },
    });
  } catch (error) {
    console.error("Get products error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch products",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const productData = await request.json();

    // Validate required fields
    const requiredFields = [
      "title",
      "description",
      "price",
      "category",
      "stock",
      "sku",
      "unit",
      "cost",
    ];
    const missingFields = requiredFields.filter(
      (field) => !productData[field] && productData[field] !== 0
    );

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Missing required fields: ${missingFields.join(", ")}`,
        },
        { status: 400 }
      );
    }

    // TODO: Get admin user from JWT token
    const adminUser = "admin"; // This should come from authentication middleware

    const newProductData = {
      ...productData,
      isActive: true,
      isFeatured: productData.isFeatured || false,
      tags: productData.tags || [],
      minStockLevel: productData.minStockLevel || 10,
      createdBy: adminUser,
      updatedBy: adminUser,
    };

    const newProduct = await productService.createProduct(newProductData);

    return NextResponse.json(
      {
        success: true,
        product: newProduct,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create product error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create product",
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, ...updateData } = await request.json();

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "Product ID is required",
        },
        { status: 400 }
      );
    }

    // TODO: Get admin user from JWT token
    const adminUser = "admin";

    const updatedProduct = await productService.updateProduct(id, {
      ...updateData,
      updatedBy: adminUser,
    });

    return NextResponse.json({
      success: true,
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Update product error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update product",
      },
      { status: 500 }
    );
  }
}
