import { NextRequest, NextResponse } from "next/server";
import { productService } from "@/lib/services/database-service";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { currentStock, reason } = await request.json();

    // Validate inputs
    if (currentStock === undefined || currentStock < 0) {
      return NextResponse.json(
        { success: false, error: "Invalid stock value" },
        { status: 400 }
      );
    }

    // Update stock using the database service
    await productService.updateStock(
      id,
      parseInt(currentStock),
      reason || "Manual stock adjustment",
      "admin-update"
    );

    // Get updated product to return current data
    const updatedProduct = await productService.getProduct(id);

    if (!updatedProduct) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Stock updated successfully",
      item: {
        id: updatedProduct.id,
        name: updatedProduct.title,
        sku: updatedProduct.sku,
        category: updatedProduct.category,
        currentStock: updatedProduct.stock,
        minStock: updatedProduct.minStockLevel || 0,
        maxStock: updatedProduct.maxStockLevel || 1000,
        unitPrice: updatedProduct.price,
        totalValue: updatedProduct.stock * updatedProduct.price,
        status: updatedProduct.inStock ? "in-stock" : "out-of-stock",
        lastUpdated: updatedProduct.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("Error updating stock item:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update stock item" },
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

    // Fetch product from Firebase
    const product = await productService.getProduct(id);

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      item: {
        id: product.id,
        name: product.title,
        sku: product.sku,
        category: product.category,
        currentStock: product.stock,
        minStock: product.minStockLevel || 0,
        maxStock: product.maxStockLevel || 1000,
        unitPrice: product.price,
        totalValue: product.stock * product.price,
        status: product.inStock ? "in-stock" : "out-of-stock",
        lastUpdated: product.updatedAt.toISOString(),
        supplier: product.supplier || "N/A",
        location: product.location || "N/A",
      },
    });
  } catch (error) {
    console.error("Error fetching stock item:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch stock item" },
      { status: 500 }
    );
  }
}
