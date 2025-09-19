import { NextRequest, NextResponse } from "next/server";
import {
  stockMovementService,
  productService,
} from "@/lib/services/database-service";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");
    const type = searchParams.get("type") as
      | "in"
      | "out"
      | "adjustment"
      | undefined;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    // Fetch stock movements from Firebase
    const result = await stockMovementService.getStockMovements({
      productId: productId || undefined,
      type,
      page,
      limit,
    });

    // Format movements to include product names and user-friendly data
    const formattedMovements = await Promise.all(
      result.movements.map(async (movement) => {
        // Get product details for each movement
        const product = await productService.getProduct(movement.productId);

        return {
          id: movement.id,
          itemId: movement.productId,
          itemName: product?.title || "Unknown Product",
          type: movement.type,
          quantity: movement.quantity,
          previousStock: movement.previousStock,
          newStock: movement.newStock,
          reason: movement.reason,
          reference: movement.reference,
          timestamp: movement.createdAt.toISOString(),
          user: movement.createdBy || "System",
        };
      })
    );

    return NextResponse.json({
      success: true,
      movements: formattedMovements,
      total: result.total,
      hasMore: result.hasMore,
    });
  } catch (error) {
    console.error("Error fetching stock movements:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch stock movements" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { itemId, productId, type, quantity, reason, reference } = body;

    // Use productId if provided, otherwise use itemId for backward compatibility
    const targetProductId = productId || itemId;

    // Validate required fields
    if (!targetProductId || !type || !quantity || !reason) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Missing required fields: productId/itemId, type, quantity, reason",
        },
        { status: 400 }
      );
    }

    // Validate type
    if (!["in", "out", "adjustment"].includes(type)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid movement type. Must be: in, out, or adjustment",
        },
        { status: 400 }
      );
    }

    // Get current product to calculate new stock
    const product = await productService.getProduct(targetProductId);
    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    // Calculate new stock based on movement type
    let newStock = product.stock;
    const movementQuantity = parseInt(quantity);

    switch (type) {
      case "in":
        newStock += movementQuantity;
        break;
      case "out":
        newStock -= movementQuantity;
        break;
      case "adjustment":
        // For adjustments, quantity can be positive or negative
        newStock = movementQuantity;
        break;
    }

    // Ensure stock doesn't go negative
    if (newStock < 0) {
      return NextResponse.json(
        { success: false, error: "Insufficient stock for this operation" },
        { status: 400 }
      );
    }

    // Update product stock - this will automatically create a stock movement record
    await productService.updateStock(
      targetProductId,
      newStock,
      reason,
      reference || "manual-entry"
    );

    // Get the most recent movement for this product to return
    const recentMovements = await stockMovementService.getStockMovements({
      productId: targetProductId,
      limit: 1,
    });

    const newMovement = recentMovements.movements[0];

    return NextResponse.json({
      success: true,
      movement: {
        id: newMovement.id,
        itemId: targetProductId,
        itemName: product.title,
        type: newMovement.type,
        quantity: newMovement.quantity,
        previousStock: newMovement.previousStock,
        newStock: newMovement.newStock,
        reason: newMovement.reason,
        reference: newMovement.reference,
        timestamp: newMovement.createdAt.toISOString(),
        user: newMovement.createdBy,
      },
      message: "Stock movement recorded successfully",
    });
  } catch (error) {
    console.error("Error recording stock movement:", error);
    return NextResponse.json(
      { success: false, error: "Failed to record stock movement" },
      { status: 500 }
    );
  }
}
