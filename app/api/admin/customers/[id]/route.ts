import { NextRequest, NextResponse } from "next/server";
import { customerService, orderService } from "@/lib/services/database-service";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: customerId } = await params;

    // Find customer from Firebase
    const customer = await customerService.getCustomer(customerId);
    if (!customer) {
      return NextResponse.json(
        { success: false, error: "Customer not found" },
        { status: 404 }
      );
    }

    // Get customer's order history from Firebase
    const ordersResult = await orderService.getOrders({
      customerId,
      limit: 100, // Get recent orders
    });

    // Calculate additional customer metrics
    const metrics = {
      averageOrderValue:
        customer.totalOrders > 0
          ? customer.totalSpent / customer.totalOrders
          : 0,
      daysSinceLastOrder: customer.lastOrderDate
        ? Math.floor(
            (new Date().getTime() -
              new Date(customer.lastOrderDate).getTime()) /
              (1000 * 60 * 60 * 24)
          )
        : null,
      daysSinceRegistration: Math.floor(
        (new Date().getTime() - new Date(customer.registrationDate).getTime()) /
          (1000 * 60 * 60 * 24)
      ),
      monthlySpending:
        customer.totalSpent /
        Math.max(
          1,
          Math.ceil(
            (new Date().getTime() -
              new Date(customer.registrationDate).getTime()) /
              (1000 * 60 * 60 * 24 * 30)
          )
        ),
    };

    // Format order history for response
    const orderHistory = ordersResult.orders.map((order) => ({
      id: order.id,
      customerId: order.customerId,
      date: order.createdAt.toISOString(),
      status: order.status,
      total: order.total,
      items: order.items
        .map((item) => item.title || `Product ${item.productId}`)
        .slice(0, 3), // Show first 3 items
      itemCount: order.items.length,
    }));

    return NextResponse.json({
      success: true,
      customer: {
        ...customer,
        registrationDate: customer.registrationDate.toISOString(),
        lastOrderDate: customer.lastOrderDate?.toISOString() || null,
        metrics,
      },
      orderHistory,
    });
  } catch (error) {
    console.error("Error fetching customer details:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch customer details" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: customerId } = await params;
    const updateData = await request.json();

    // Update customer using Firebase service
    const updatedCustomer = await customerService.updateCustomer(
      customerId,
      updateData
    );

    return NextResponse.json({
      success: true,
      message: "Customer updated successfully",
      customer: {
        ...updatedCustomer,
        registrationDate: updatedCustomer.registrationDate.toISOString(),
        lastOrderDate: updatedCustomer.lastOrderDate?.toISOString() || null,
      },
    });
  } catch (error) {
    console.error("Error updating customer:", error);

    if (error instanceof Error && error.message.includes("not found")) {
      return NextResponse.json(
        { success: false, error: "Customer not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Failed to update customer" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: customerId } = await params;

    // Find customer
    const customerIndex = mockCustomers.findIndex((c) => c.id === customerId);
    if (customerIndex === -1) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }

    // Check if customer has pending orders
    const pendingOrders = mockOrderHistory.filter(
      (order) =>
        order.customerId === customerId && order.status === "processing"
    );

    if (pendingOrders.length > 0) {
      return NextResponse.json(
        { error: "Cannot delete customer with pending orders" },
        { status: 400 }
      );
    }

    // In a real app, you would delete from database
    console.log("Deleting customer:", customerId);

    return NextResponse.json({
      message: "Customer deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting customer:", error);
    return NextResponse.json(
      { error: "Failed to delete customer" },
      { status: 500 }
    );
  }
}
