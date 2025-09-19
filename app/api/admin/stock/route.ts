import { NextRequest, NextResponse } from "next/server";
import {
  productService,
  stockMovementService,
} from "@/lib/services/database-service";
import { StockMovementRequest, StockUpdateRequest } from "@/types/stock";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get("filter") || "all";
    const category = searchParams.get("category") || undefined;

    // Get products from Firebase
    const { products } = await productService.getProducts({
      category,
      isActive: true,
      limit: 1000, // Get all products for stock management
    });

    // Filter based on stock levels
    let filteredProducts = products;
    if (filter === "low") {
      filteredProducts = products.filter(
        (p) => p.stock <= (p.minStockLevel || 10)
      );
    } else if (filter === "out") {
      filteredProducts = products.filter((p) => p.stock === 0);
    } else if (filter === "in") {
      filteredProducts = products.filter((p) => p.stock > 0);
    }

    // Transform to stock items format
    const stockItems = filteredProducts.map((product) => ({
      id: product.id,
      productName: product.title,
      sku: product.sku,
      category: product.category,
      currentStock: product.stock,
      minStock: product.minStockLevel || 10,
      maxStock: product.maxStockLevel || 1000,
      unitPrice: product.price,
      totalValue: product.stock * product.price,
      supplier: product.supplier || "Default Supplier",
      location: product.location || "Main Warehouse",
      lastUpdated: product.updatedAt?.toISOString() || new Date().toISOString(),
    }));

    // Calculate summary
    const summary = {
      totalItems: stockItems.length,
      totalValue: stockItems.reduce((sum, item) => sum + item.totalValue, 0),
      lowStockItems: stockItems.filter(
        (item) => item.currentStock <= item.minStock
      ).length,
      outOfStockItems: stockItems.filter((item) => item.currentStock === 0)
        .length,
    };

    return NextResponse.json({
      success: true,
      items: stockItems,
      summary,
    });
  } catch (error) {
    console.error("Error fetching stock data:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch stock data" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { itemId, productId, type, quantity, reason, reference } =
      (await request.json()) as StockMovementRequest;
    const actualProductId = itemId || productId; // Support both parameter names

    // Validate required fields
    if (!actualProductId || !type || !quantity) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Missing required fields: itemId/productId, type, and quantity are required",
        },
        { status: 400 }
      );
    }

    // Get the product from Firebase
    const product = await productService.getProduct(actualProductId);
    if (!product) {
      return NextResponse.json(
        { success: false, error: "Stock item not found" },
        { status: 404 }
      );
    }

    // Validate movement
    if (type === "out" && quantity > product.stock) {
      return NextResponse.json(
        { success: false, error: "Insufficient stock for out movement" },
        { status: 400 }
      );
    }

    const previousStock = product.stock;
    let newStock: number;

    switch (type) {
      case "in":
        newStock = previousStock + quantity;
        break;
      case "out":
        newStock = Math.max(0, previousStock - quantity);
        break;
      case "adjustment":
        newStock = quantity; // For adjustments, quantity is the new total
        break;
      default:
        return NextResponse.json(
          { success: false, error: "Invalid movement type" },
          { status: 400 }
        );
    }

    // Update stock using the database service
    await productService.updateStock(
      actualProductId,
      newStock,
      reason,
      reference
    );

    // Get updated product
    const updatedProduct = await productService.getProduct(actualProductId);

    // Transform back to stock item format
    const stockItem = {
      id: updatedProduct!.id,
      productName: updatedProduct!.title,
      sku: updatedProduct!.sku,
      category: updatedProduct!.category,
      currentStock: updatedProduct!.stock,
      minStock: updatedProduct!.minStockLevel || 10,
      maxStock: updatedProduct!.maxStockLevel || 1000,
      unitPrice: updatedProduct!.price,
      totalValue: updatedProduct!.stock * updatedProduct!.price,
      supplier: updatedProduct!.supplier || "Default Supplier",
      location: updatedProduct!.location || "Main Warehouse",
      lastUpdated:
        updatedProduct!.updatedAt?.toISOString() || new Date().toISOString(),
    };

    // Get the stock movement that was created
    const recentMovements = await stockMovementService.getStockMovements({
      productId: actualProductId,
      limit: 1,
    });

    const movement = recentMovements.movements[0];

    return NextResponse.json({
      success: true,
      message: "Stock updated successfully",
      item: stockItem,
      movement,
    });
  } catch (error) {
    console.error("Error updating stock:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update stock" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { itemId, minStock, maxStock, supplier, location } =
      (await request.json()) as StockUpdateRequest;

    if (!itemId) {
      return NextResponse.json(
        { success: false, error: "Item ID is required" },
        { status: 400 }
      );
    }

    // Get the product first
    const product = await productService.getProduct(itemId);
    if (!product) {
      return NextResponse.json(
        { success: false, error: "Stock item not found" },
        { status: 404 }
      );
    }

    // Update product settings
    const updates: Record<string, any> = {};
    if (minStock !== undefined)
      updates.minStockLevel =
        typeof minStock === "string" ? parseInt(minStock) : minStock;
    if (maxStock !== undefined)
      updates.maxStockLevel =
        typeof maxStock === "string" ? parseInt(maxStock) : maxStock;
    if (supplier !== undefined) updates.supplier = supplier;
    if (location !== undefined) updates.location = location;

    const updatedProduct = await productService.updateProduct(itemId, updates);

    // Transform to stock item format
    const stockItem = {
      id: updatedProduct.id,
      productName: updatedProduct.title,
      sku: updatedProduct.sku,
      category: updatedProduct.category,
      currentStock: updatedProduct.stock,
      minStock: updatedProduct.minStockLevel || 10,
      maxStock: updatedProduct.maxStockLevel || 1000,
      unitPrice: updatedProduct.price,
      totalValue: updatedProduct.stock * updatedProduct.price,
      supplier: updatedProduct.supplier || "Default Supplier",
      location: updatedProduct.location || "Main Warehouse",
      lastUpdated:
        updatedProduct.updatedAt?.toISOString() || new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      message: "Stock item settings updated successfully",
      item: stockItem,
    });
  } catch (error) {
    console.error("Error updating stock item settings:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update stock item settings" },
      { status: 500 }
    );
  }
}
