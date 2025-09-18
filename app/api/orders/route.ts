import { NextResponse } from "next/server";
import { db } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";

// Create a new order (Customer Checkout)
export async function POST(request: Request) {
  try {
    const orderData = await request.json();

    // Validate required fields
    const requiredFields = [
      "customerName",
      "customerPhone",
      "customerEmail",
      "deliveryAddress",
      "items",
      "subtotal",
      "deliveryFee",
      "total",
    ];
    for (const field of requiredFields) {
      if (!orderData[field]) {
        return NextResponse.json(
          {
            success: false,
            error: `Missing required field: ${field}`,
          },
          { status: 400 }
        );
      }
    }

    // Validate items
    if (!Array.isArray(orderData.items) || orderData.items.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Order must contain at least one item",
        },
        { status: 400 }
      );
    }

    // Check stock availability for each item
    const stockChecks = await Promise.all(
      orderData.items.map(async (item: any) => {
        const productDoc = await db
          .collection("products")
          .doc(item.productId)
          .get();
        if (!productDoc.exists) {
          return { valid: false, error: `Product ${item.productId} not found` };
        }

        const productData = productDoc.data();
        if (productData?.stock < item.quantity) {
          return {
            valid: false,
            error: `Insufficient stock for ${item.title}. Available: ${productData?.stock}, Requested: ${item.quantity}`,
          };
        }

        return { valid: true, productData };
      })
    );

    // Check if any stock validation failed
    const stockError = stockChecks.find((check) => !check.valid);
    if (stockError) {
      return NextResponse.json(
        {
          success: false,
          error: stockError.error,
        },
        { status: 400 }
      );
    }

    // Generate order ID
    const orderId = `ORD-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)
      .toUpperCase()}`;

    // Create customer record if email is provided
    let customerId = null;
    if (orderData.customerEmail) {
      // Check if customer exists
      const existingCustomerQuery = await db
        .collection("customers")
        .where("email", "==", orderData.customerEmail)
        .limit(1)
        .get();

      if (!existingCustomerQuery.empty) {
        // Update existing customer
        const customerDoc = existingCustomerQuery.docs[0];
        customerId = customerDoc.id;
        const customerData = customerDoc.data();

        await customerDoc.ref.update({
          name: orderData.customerName,
          phone: orderData.customerPhone,
          address: orderData.deliveryAddress,
          totalOrders: (customerData.totalOrders || 0) + 1,
          totalSpent: (customerData.totalSpent || 0) + orderData.total,
          lastOrderAt: FieldValue.serverTimestamp(),
          updatedAt: FieldValue.serverTimestamp(),
        });
      } else {
        // Create new customer
        const customerRef = await db.collection("customers").add({
          name: orderData.customerName,
          email: orderData.customerEmail,
          phone: orderData.customerPhone,
          address: orderData.deliveryAddress,
          totalOrders: 1,
          totalSpent: orderData.total,
          status: "active",
          createdAt: FieldValue.serverTimestamp(),
          lastOrderAt: FieldValue.serverTimestamp(),
          updatedAt: FieldValue.serverTimestamp(),
        });
        customerId = customerRef.id;
      }
    }

    // Create order document
    const order = {
      id: orderId,
      customerId,
      customerName: orderData.customerName,
      customerPhone: orderData.customerPhone,
      customerEmail: orderData.customerEmail,
      deliveryAddress: orderData.deliveryAddress,
      items: orderData.items,
      subtotal: orderData.subtotal,
      deliveryFee: orderData.deliveryFee,
      total: orderData.total,
      status: "pending",
      paymentStatus: "pending",
      paymentMethod: orderData.paymentMethod || "kowri",
      transactionId: orderData.transactionId || null,
      specialInstructions: orderData.specialInstructions || "",
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };

    const orderRef = await db.collection("orders").add(order);

    // Update product stock
    const batch = db.batch();
    orderData.items.forEach((item: any, index: number) => {
      const productRef = db.collection("products").doc(item.productId);
      const currentStock = stockChecks[index].productData?.stock || 0;
      batch.update(productRef, {
        stock: currentStock - item.quantity,
        updatedAt: FieldValue.serverTimestamp(),
      });

      // Create stock movement record
      const stockMovementRef = db.collection("stock_movements").doc();
      batch.set(stockMovementRef, {
        productId: item.productId,
        type: "out",
        quantity: item.quantity,
        reason: "sale",
        orderId: orderId,
        notes: `Order: ${orderId}`,
        performedBy: "customer",
        createdAt: FieldValue.serverTimestamp(),
      });
    });

    await batch.commit();

    // Create admin alert for new order
    await db.collection("admin_alerts").add({
      message: `New order received: ${orderId}`,
      category: "order",
      priority: "medium",
      isRead: false,
      metadata: {
        orderId: orderId,
        customerName: orderData.customerName,
        total: orderData.total,
      },
      createdAt: FieldValue.serverTimestamp(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    return NextResponse.json({
      success: true,
      orderId: orderId,
      order: {
        ...order,
        id: orderRef.id,
      },
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create order",
      },
      { status: 500 }
    );
  }
}

// Get orders by phone number or email (for order tracking)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const phone = searchParams.get("phone");
    const email = searchParams.get("email");
    const orderId = searchParams.get("orderId");

    if (!phone && !email && !orderId) {
      return NextResponse.json(
        {
          success: false,
          error: "Phone number, email, or order ID is required",
        },
        { status: 400 }
      );
    }

    let query;

    if (orderId) {
      // Search by order ID
      query = db.collection("orders").where("id", "==", orderId);
    } else if (phone) {
      // Search by phone number
      query = db.collection("orders").where("customerPhone", "==", phone);
    } else {
      // Search by email
      query = db.collection("orders").where("customerEmail", "==", email);
    }

    const snapshot = await query.orderBy("createdAt", "desc").limit(10).get();

    const orders = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || null,
      updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || null,
    }));

    return NextResponse.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch orders",
      },
      { status: 500 }
    );
  }
}
