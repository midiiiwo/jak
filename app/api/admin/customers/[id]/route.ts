import { NextRequest, NextResponse } from "next/server";

// Mock customer data (same as in main route for consistency)
const mockCustomers = [
  {
    id: "cust_001",
    name: "John Doe",
    email: "john.doe@email.com",
    phone: "+233 24 123 4567",
    address: "123 Main St, Accra, Ghana",
    registrationDate: "2024-01-15T08:30:00Z",
    totalOrders: 15,
    totalSpent: 2450.5,
    lastOrderDate: "2024-08-25T14:20:00Z",
    status: "active",
    customerType: "premium",
    notes: "Loyal customer, prefers frozen chicken",
  },
  {
    id: "cust_002",
    name: "Jane Smith",
    email: "jane.smith@email.com",
    phone: "+233 20 987 6543",
    address: "456 Oak Ave, Kumasi, Ghana",
    registrationDate: "2024-02-20T10:15:00Z",
    totalOrders: 8,
    totalSpent: 1320.75,
    lastOrderDate: "2024-08-28T16:45:00Z",
    status: "active",
    customerType: "regular",
    notes: "Frequent seafood orders",
  },
  {
    id: "cust_003",
    name: "Michael Johnson",
    email: "michael.j@email.com",
    phone: "+233 26 555 0123",
    address: "789 Pine Rd, Tamale, Ghana",
    registrationDate: "2024-03-10T12:00:00Z",
    totalOrders: 3,
    totalSpent: 450.25,
    lastOrderDate: "2024-07-15T11:30:00Z",
    status: "inactive",
    customerType: "regular",
    notes: "Seasonal customer",
  },
  {
    id: "cust_004",
    name: "Sarah Wilson",
    email: "sarah.wilson@email.com",
    phone: "+233 24 777 8888",
    address: "321 Elm St, Cape Coast, Ghana",
    registrationDate: "2024-04-05T09:20:00Z",
    totalOrders: 22,
    totalSpent: 3750.8,
    lastOrderDate: "2024-08-29T13:10:00Z",
    status: "active",
    customerType: "vip",
    notes: "VIP customer, bulk orders for restaurant",
  },
  {
    id: "cust_005",
    name: "David Brown",
    email: "david.brown@email.com",
    phone: "+233 55 333 2222",
    address: "654 Maple Dr, Sunyani, Ghana",
    registrationDate: "2024-05-12T15:45:00Z",
    totalOrders: 6,
    totalSpent: 890.4,
    lastOrderDate: "2024-08-20T10:25:00Z",
    status: "active",
    customerType: "regular",
    notes: "Prefers delivery on weekends",
  },
];

// Mock order history for customers
const mockOrderHistory = [
  {
    id: "ord_001",
    customerId: "cust_001",
    date: "2024-08-25T14:20:00Z",
    status: "delivered",
    total: 145.5,
    items: ["Frozen Chicken Breast", "Tilapia Fish"],
  },
  {
    id: "ord_002",
    customerId: "cust_001",
    date: "2024-08-15T10:30:00Z",
    status: "delivered",
    total: 89.25,
    items: ["Beef Chunks", "Shrimp"],
  },
  {
    id: "ord_003",
    customerId: "cust_002",
    date: "2024-08-28T16:45:00Z",
    status: "processing",
    total: 234.75,
    items: ["Salmon Fillet", "Crab Meat", "Prawns"],
  },
];

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: customerId } = await params;

    // Find customer
    const customer = mockCustomers.find((c) => c.id === customerId);
    if (!customer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }

    // Get customer's order history
    const orderHistory = mockOrderHistory.filter(
      (order) => order.customerId === customerId
    );

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

    return NextResponse.json({
      customer: {
        ...customer,
        metrics,
      },
      orderHistory,
    });
  } catch (error) {
    console.error("Error fetching customer details:", error);
    return NextResponse.json(
      { error: "Failed to fetch customer details" },
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

    // Find customer
    const customerIndex = mockCustomers.findIndex((c) => c.id === customerId);
    if (customerIndex === -1) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }

    // Update customer
    const updatedCustomer = {
      ...mockCustomers[customerIndex],
      ...updateData,
      id: customerId, // Ensure ID doesn't change
    };

    // In a real app, you would update in database
    console.log("Updating customer:", updatedCustomer);

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
