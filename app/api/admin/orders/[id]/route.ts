import { NextRequest, NextResponse } from "next/server";
import { orderService } from "@/lib/services/database-service";

// GET - Fetch single order by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const order = await orderService.getOrder(id);

    if (!order) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch order" },
      { status: 500 }
    );
  }
}

// PUT - Update order status
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, notes } = body;

    if (!status) {
      return NextResponse.json(
        { success: false, error: "Order status is required" },
        { status: 400 }
      );
    }

    // Validate status
    const validStatuses = [
      "pending",
      "confirmed",
      "preparing",
      "ready",
      "delivered",
      "cancelled",
    ];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: "Invalid order status" },
        { status: 400 }
      );
    }

    const updatedOrder = await orderService.updateOrderStatus(
      id,
      status,
      notes
    );

    return NextResponse.json({
      success: true,
      data: updatedOrder,
    });
  } catch (error) {
    console.error("Error updating order:", error);
    if (error instanceof Error && error.message.includes("not found")) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to update order" },
      { status: 500 }
    );
  }
}

// DELETE - Cancel order
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if order exists first
    const order = await orderService.getOrder(id);
    if (!order) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    // Check if order can be cancelled
    if (order.status === "delivered" || order.status === "cancelled") {
      return NextResponse.json(
        { success: false, error: "Cannot cancel this order" },
        { status: 400 }
      );
    }

    // Cancel the order
    await orderService.updateOrderStatus(
      id,
      "cancelled",
      "Order cancelled by admin"
    );

    return NextResponse.json({
      success: true,
      message: "Order cancelled successfully",
    });
  } catch (error) {
    console.error("Error cancelling order:", error);
    return NextResponse.json(
      { success: false, error: "Failed to cancel order" },
      { status: 500 }
    );
  }
}
