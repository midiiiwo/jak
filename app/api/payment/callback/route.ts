import { NextResponse } from "next/server";
import { db } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(request: Request) {
  try {
    const paymentData = await request.json();

    console.log("Payment callback received:", paymentData);

    // Extract order ID from reference
    const reference = paymentData.reference;
    const orderId = reference?.split("-")[0];

    if (!orderId) {
      console.error("No order ID found in payment reference:", reference);
      return NextResponse.json(
        {
          success: false,
          error: "Invalid payment reference",
        },
        { status: 400 }
      );
    }

    // Find the order
    const orderQuery = await db
      .collection("orders")
      .where("id", "==", orderId)
      .limit(1)
      .get();

    if (orderQuery.empty) {
      console.error("Order not found:", orderId);
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

    // Update order with payment information
    const paymentStatus =
      paymentData.status === "successful" ? "paid" : "failed";
    const orderStatus = paymentStatus === "paid" ? "confirmed" : "pending";

    await orderDoc.ref.update({
      paymentStatus,
      status: orderStatus,
      transactionId: paymentData.transaction_id || paymentData.id,
      paymentReference: reference,
      paymentData: paymentData,
      updatedAt: FieldValue.serverTimestamp(),
    });

    // Create admin alert for payment status
    await db.collection("admin_alerts").add({
      message: `Payment ${paymentStatus} for order ${orderId}`,
      category: "payment",
      priority: paymentStatus === "paid" ? "low" : "high",
      isRead: false,
      metadata: {
        orderId,
        paymentStatus,
        amount: paymentData.amount,
        transactionId: paymentData.transaction_id || paymentData.id,
      },
      createdAt: FieldValue.serverTimestamp(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    // If payment was successful, create notification log
    if (paymentStatus === "paid") {
      // You can add email/SMS notification logic here
      await db.collection("notification_logs").add({
        type: "order_confirmation",
        recipient: orderData.customerEmail,
        subject: "Order Confirmed - Frozen Haven",
        message: `Your order ${orderId} has been confirmed and payment received.`,
        status: "pending",
        createdAt: FieldValue.serverTimestamp(),
        metadata: {
          orderId,
          customerName: orderData.customerName,
          amount: orderData.total,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: `Payment ${paymentStatus}`,
      orderId,
      paymentStatus,
    });
  } catch (error) {
    console.error("Payment callback error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Payment callback processing failed",
      },
      { status: 500 }
    );
  }
}

// Handle GET requests for payment verification
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const reference = searchParams.get("reference");

    if (!reference) {
      return NextResponse.json(
        {
          success: false,
          error: "Payment reference required",
        },
        { status: 400 }
      );
    }

    // Verify payment with Kowri
    const verifyResponse = await fetch(
      `${process.env.NEXT_PUBLIC_KOWRI_BASE_URL}/v1/charge/verify/${reference}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_KOWRI_SECRET}`,
          Accept: "application/json",
        },
      }
    );

    const verifyData = await verifyResponse.json();

    if (!verifyResponse.ok) {
      return NextResponse.json(
        {
          success: false,
          error: "Payment verification failed",
          details: verifyData,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      paymentData: verifyData,
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Payment verification failed",
      },
      { status: 500 }
    );
  }
}
