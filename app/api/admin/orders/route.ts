import { NextRequest, NextResponse } from "next/server";
import { orderService } from "@/lib/services/database-service";
import {
  validateOrderData,
  calculateOrderTotal,
} from "@/lib/services/order-service";
import { Order, OrderItem } from "@/types/order";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status") || undefined;
    const customerId = searchParams.get("customerId") || undefined;

    let startDate: Date | undefined;
    let endDate: Date | undefined;

    if (searchParams.get("startDate")) {
      startDate = new Date(searchParams.get("startDate")!);
    }
    if (searchParams.get("endDate")) {
      endDate = new Date(searchParams.get("endDate")!);
    }

    const result = await orderService.getOrders({
      page,
      limit,
      status,
      customerId,
      startDate,
      endDate,
    });

    return NextResponse.json({
      success: true,
      data: {
        orders: result.orders,
        pagination: {
          page,
          limit,
          total: result.total,
          hasMore: result.hasMore,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const requiredFields = ["customerInfo", "items"];
    const missingFields = requiredFields.filter((field) => !body[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Missing required fields: ${missingFields.join(", ")}`,
        },
        { status: 400 }
      );
    }

    // Validate customer info
    const { name, email, phone, address } = body.customerInfo;
    if (!name || !email || !phone || !address) {
      return NextResponse.json(
        { success: false, error: "Customer information is incomplete" },
        { status: 400 }
      );
    }

    // Calculate totals
    const subtotal = body.items.reduce(
      (sum: number, item: any) => sum + item.quantity * item.unitPrice,
      0
    );
    const tax = body.tax || 0;
    const deliveryFee = body.deliveryFee || 0;
    const total = subtotal + tax + deliveryFee;

    // Prepare order data for database service
    const orderData = {
      customerId: body.customerId || null,
      customerInfo: {
        name,
        email,
        phone,
        address,
      },
      items: body.items.map((item: any) => ({
        productId: item.productId,
        product: item.product, // Should include product details
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: item.quantity * item.unitPrice,
      })),
      subtotal,
      tax,
      deliveryFee,
      total,
      status: "pending" as const,
      paymentStatus: "pending" as const,
      paymentReference: body.paymentReference,
      deliveryDate: body.deliveryDate ? new Date(body.deliveryDate) : undefined,
      notes: body.notes || "",
    };

    const newOrder = await orderService.createOrder(orderData);

    return NextResponse.json(
      {
        success: true,
        data: newOrder,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create order" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, notes } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Order ID is required" },
        { status: 400 }
      );
    }

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
