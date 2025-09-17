import { NextRequest, NextResponse } from "next/server";
import { mockCustomers } from "@/lib/mock/customers";
import {
  filterCustomers,
  sortCustomers,
  calculateCustomerStats,
  findCustomerById,
  validateCustomerData,
} from "@/lib/services/customer-service";
import { Customer } from "@/types/customer";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.toLowerCase();
    const status = searchParams.get("status") || "";
    const customerType = searchParams.get("customerType") || "";
    const sortBy = searchParams.get("sortBy") || "registrationDate";
    const sortOrder = (searchParams.get("sortOrder") || "desc") as
      | "asc"
      | "desc";

    // Apply filters and sorting
    let filteredCustomers = filterCustomers(
      mockCustomers,
      search,
      status,
      customerType
    );
    filteredCustomers = sortCustomers(
      filteredCustomers,
      sortBy as keyof Customer,
      sortOrder
    );

    // Calculate statistics
    const stats = calculateCustomerStats(mockCustomers);

    return NextResponse.json({
      customers: filteredCustomers,
      stats,
      pagination: {
        page: 1,
        limit: 50,
        total: filteredCustomers.length,
        pages: Math.ceil(filteredCustomers.length / 50),
      },
    });
  } catch (error) {
    console.error("Error fetching customers:", error);
    return NextResponse.json(
      { error: "Failed to fetch customers" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const customerData = await request.json();
    const missingFields = validateCustomerData(customerData);

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(", ")}` },
        { status: 400 }
      );
    }

    const newCustomer = {
      id: `cust_${Date.now()}`,
      name: customerData.name,
      email: customerData.email,
      phone: customerData.phone,
      address: customerData.address || "",
      registrationDate: new Date().toISOString(),
      totalOrders: 0,
      totalSpent: 0,
      lastOrderDate: null,
      status: "active",
      customerType: customerData.customerType || "regular",
      notes: customerData.notes || "",
    };

    return NextResponse.json(
      {
        message: "Customer created successfully",
        customer: newCustomer,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating customer:", error);
    return NextResponse.json(
      { error: "Failed to create customer" },
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
        { error: "Customer ID is required" },
        { status: 400 }
      );
    }

    const customer = findCustomerById(customerId);
    if (!customer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }

    const updatedCustomer = {
      ...customer,
      ...updateData,
      id: customerId,
    };

    return NextResponse.json({
      message: "Customer updated successfully",
      customer: updatedCustomer,
    });
  } catch (error) {
    console.error("Error updating customer:", error);
    return NextResponse.json(
      { error: "Failed to update customer" },
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
        { error: "Customer ID is required" },
        { status: 400 }
      );
    }

    const customer = findCustomerById(customerId);
    if (!customer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }

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
