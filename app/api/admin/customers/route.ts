import { NextRequest, NextResponse } from "next/server";
import { customerService } from "@/lib/services/database-service";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.toLowerCase();
    const status = searchParams.get("status") as
      | "active"
      | "inactive"
      | undefined;
    const customerType = searchParams.get("customerType") as
      | "regular"
      | "premium"
      | "vip"
      | undefined;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");

    // Fetch customers from Firebase
    const result = await customerService.getCustomers({
      page,
      limit,
      status,
      customerType,
      search,
    });

    // Calculate basic statistics from the total customer base
    const allCustomers = await customerService.getCustomers({ limit: 10000 });
    const totalCustomers = allCustomers.customers;

    const stats = {
      total: totalCustomers.length,
      active: totalCustomers.filter((c) => c.status === "active").length,
      inactive: totalCustomers.filter((c) => c.status === "inactive").length,
      regular: totalCustomers.filter((c) => c.customerType === "regular")
        .length,
      premium: totalCustomers.filter((c) => c.customerType === "premium")
        .length,
      vip: totalCustomers.filter((c) => c.customerType === "vip").length,
      totalSpent: totalCustomers.reduce((sum, c) => sum + c.totalSpent, 0),
      averageOrderValue:
        totalCustomers.length > 0
          ? totalCustomers.reduce((sum, c) => sum + c.totalSpent, 0) /
              totalCustomers.reduce((sum, c) => sum + c.totalOrders, 0) || 0
          : 0,
    };

    return NextResponse.json({
      success: true,
      customers: result.customers,
      stats,
      pagination: {
        page,
        limit,
        total: result.total,
        pages: Math.ceil(result.total / limit),
        hasMore: result.hasMore,
      },
    });
  } catch (error) {
    console.error("Error fetching customers:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch customers" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const customerData = await request.json();

    // Validate required fields
    const requiredFields = ["name", "email", "phone"];
    const missingFields = requiredFields.filter(
      (field) => !customerData[field]
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

    // Create customer using Firebase service
    const newCustomer = await customerService.createCustomer({
      name: customerData.name,
      email: customerData.email,
      phone: customerData.phone,
      address: customerData.address || "",
      customerType: customerData.customerType || "regular",
      notes: customerData.notes || "",
    });

    return NextResponse.json(
      {
        success: true,
        message: "Customer created successfully",
        customer: newCustomer,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating customer:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create customer" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get("id");
    const updateData = await request.json();

    if (!customerId) {
      return NextResponse.json(
        { success: false, error: "Customer ID is required" },
        { status: 400 }
      );
    }

    // Update customer using Firebase service
    const updatedCustomer = await customerService.updateCustomer(
      customerId,
      updateData
    );

    return NextResponse.json({
      success: true,
      message: "Customer updated successfully",
      customer: updatedCustomer,
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

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get("id");

    if (!customerId) {
      return NextResponse.json(
        { success: false, error: "Customer ID is required" },
        { status: 400 }
      );
    }

    // Check if customer exists
    const customer = await customerService.getCustomer(customerId);
    if (!customer) {
      return NextResponse.json(
        { success: false, error: "Customer not found" },
        { status: 404 }
      );
    }

    // Soft delete by setting status to inactive
    await customerService.updateCustomer(customerId, { status: "inactive" });

    return NextResponse.json({
      success: true,
      message: "Customer deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting customer:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete customer" },
      { status: 500 }
    );
  }
}
