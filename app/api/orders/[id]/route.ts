import { NextResponse } from "next/server";
import { db } from "@/lib/firebase/admin";

// Get individual order details
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = params.id;

    // Query by orderId field (not document ID)
    const orderQuery = await db
      .collection("orders")
      .where("id", "==", orderId)
      .limit(1)
      .get();

    if (orderQuery.empty) {
      return NextResponse.json(
        {
          success: false,
          error: "Order not found",
        },
        { status: 404 }
      );
    }

    const orderDoc = orderQuery.docs[0];
    const orderData = orderDoc.data();

    // Get detailed product information for items
    const itemsWithDetails = await Promise.all(
      orderData.items.map(async (item: any) => {
        try {
          const productDoc = await db
            .collection("products")
            .doc(item.productId)
            .get();
          if (productDoc.exists) {
            const productData = productDoc.data();
            return {
              ...item,
              productDetails: {
                title: productData?.title,
                category: productData?.category,
                image: productData?.images?.[0] || "img-1.jpeg",
                currentStock: productData?.stock,
              },
            };
          }
          return item;
        } catch (error) {
          console.warn(
            `Failed to fetch product details for ${item.productId}:`,
            error
          );
          return item;
        }
      })
    );

    // Calculate order timeline
    const timeline = [
      {
        status: "pending",
        label: "Order Placed",
        completed: true,
        timestamp: orderData.createdAt?.toDate?.()?.toISOString() || null,
      },
      {
        status: "confirmed",
        label: "Order Confirmed",
        completed: [
          "confirmed",
          "preparing",
          "out_for_delivery",
          "delivered",
        ].includes(orderData.status),
        timestamp:
          orderData.status === "confirmed"
            ? orderData.updatedAt?.toDate?.()?.toISOString()
            : null,
      },
      {
        status: "preparing",
        label: "Preparing Order",
        completed: ["preparing", "out_for_delivery", "delivered"].includes(
          orderData.status
        ),
        timestamp:
          orderData.status === "preparing"
            ? orderData.updatedAt?.toDate?.()?.toISOString()
            : null,
      },
      {
        status: "out_for_delivery",
        label: "Out for Delivery",
        completed: ["out_for_delivery", "delivered"].includes(orderData.status),
        timestamp:
          orderData.status === "out_for_delivery"
            ? orderData.updatedAt?.toDate?.()?.toISOString()
            : null,
      },
      {
        status: "delivered",
        label: "Delivered",
        completed: orderData.status === "delivered",
        timestamp:
          orderData.status === "delivered"
            ? orderData.updatedAt?.toDate?.()?.toISOString()
            : null,
      },
    ];

    const order = {
      id: orderDoc.id,
      ...orderData,
      items: itemsWithDetails,
      timeline,
      createdAt: orderData.createdAt?.toDate?.()?.toISOString() || null,
      updatedAt: orderData.updatedAt?.toDate?.()?.toISOString() || null,
      estimatedDelivery: calculateEstimatedDelivery(
        orderData.createdAt,
        orderData.status
      ),
    };

    return NextResponse.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch order",
      },
      { status: 500 }
    );
  }
}

// Update order status (for admin use, but keeping it simple)
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = params.id;
    const updates = await request.json();

    // Query by orderId field
    const orderQuery = await db
      .collection("orders")
      .where("id", "==", orderId)
      .limit(1)
      .get();

    if (orderQuery.empty) {
      return NextResponse.json(
        {
          success: false,
          error: "Order not found",
        },
        { status: 404 }
      );
    }

    const orderDoc = orderQuery.docs[0];

    // Only allow status updates for now
    const allowedUpdates: any = {};
    if (updates.status) {
      allowedUpdates.status = updates.status;
    }
    if (updates.paymentStatus) {
      allowedUpdates.paymentStatus = updates.paymentStatus;
    }
    if (updates.transactionId) {
      allowedUpdates.transactionId = updates.transactionId;
    }

    allowedUpdates.updatedAt = new Date();

    await orderDoc.ref.update(allowedUpdates);

    return NextResponse.json({
      success: true,
      message: "Order updated successfully",
    });
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update order",
      },
      { status: 500 }
    );
  }
}

// Helper function to calculate estimated delivery
function calculateEstimatedDelivery(createdAt: any, status: string) {
  if (!createdAt) return null;

  const orderDate = createdAt.toDate ? createdAt.toDate() : new Date(createdAt);

  // Default delivery time: 1-3 business days
  let daysToAdd = 1;

  switch (status) {
    case "pending":
      daysToAdd = 3;
      break;
    case "confirmed":
      daysToAdd = 2;
      break;
    case "preparing":
      daysToAdd = 1;
      break;
    case "out_for_delivery":
      daysToAdd = 0.5; // Same day delivery
      break;
    case "delivered":
      return null; // Already delivered
    default:
      daysToAdd = 2;
  }

  const estimatedDate = new Date(orderDate);
  estimatedDate.setDate(estimatedDate.getDate() + daysToAdd);

  return estimatedDate.toISOString();
}
