import { NextResponse } from "next/server";
import { db } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(request: Request) {
  try {
    const contactData = await request.json();

    // Validate required fields
    const requiredFields = ["name", "email", "message"];
    for (const field of requiredFields) {
      if (!contactData[field]) {
        return NextResponse.json(
          {
            success: false,
            error: `Missing required field: ${field}`,
          },
          { status: 400 }
        );
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactData.email)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid email format",
        },
        { status: 400 }
      );
    }

    // Create contact inquiry
    const inquiry = {
      name: contactData.name,
      email: contactData.email,
      phone: contactData.phone || null,
      subject: contactData.subject || "General Inquiry",
      message: contactData.message,
      orderId: contactData.orderId || null,
      type: contactData.type || "general", // general, order_inquiry, complaint, suggestion
      status: "open",
      priority: determinePriority(contactData),
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };

    const inquiryRef = await db.collection("customer_inquiries").add(inquiry);

    // Create admin alert for the inquiry
    await db.collection("admin_alerts").add({
      message: `New customer inquiry from ${contactData.name}`,
      category: "customer",
      priority: inquiry.priority,
      isRead: false,
      metadata: {
        inquiryId: inquiryRef.id,
        customerName: contactData.name,
        email: contactData.email,
        subject: contactData.subject || "General Inquiry",
        type: contactData.type || "general",
      },
      createdAt: FieldValue.serverTimestamp(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    // Log the inquiry for tracking
    await db.collection("notification_logs").add({
      type: "customer_inquiry",
      recipient: "admin",
      subject: `Customer Inquiry: ${contactData.subject || "General"}`,
      message: `New inquiry from ${contactData.name} (${
        contactData.email
      }): ${contactData.message.substring(0, 100)}...`,
      status: "sent",
      sentAt: FieldValue.serverTimestamp(),
      createdAt: FieldValue.serverTimestamp(),
      metadata: {
        inquiryId: inquiryRef.id,
        customerEmail: contactData.email,
        customerName: contactData.name,
      },
    });

    return NextResponse.json({
      success: true,
      message:
        "Your message has been received. We will get back to you within 24 hours.",
      inquiryId: inquiryRef.id,
    });
  } catch (error) {
    console.error("Error creating contact inquiry:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to submit inquiry",
      },
      { status: 500 }
    );
  }
}

// Newsletter subscription endpoint
export async function PUT(request: Request) {
  try {
    const { email, name } = await request.json();

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          error: "Email is required",
        },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid email format",
        },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingSubscriber = await db
      .collection("newsletter_subscribers")
      .where("email", "==", email)
      .limit(1)
      .get();

    if (!existingSubscriber.empty) {
      return NextResponse.json(
        {
          success: false,
          error: "Email already subscribed to newsletter",
        },
        { status: 400 }
      );
    }

    // Add to newsletter subscribers
    await db.collection("newsletter_subscribers").add({
      email,
      name: name || null,
      status: "active",
      subscribedAt: FieldValue.serverTimestamp(),
      createdAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({
      success: true,
      message: "Successfully subscribed to newsletter",
    });
  } catch (error) {
    console.error("Error subscribing to newsletter:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to subscribe to newsletter",
      },
      { status: 500 }
    );
  }
}

// Helper function to determine inquiry priority
function determinePriority(contactData: any): "low" | "medium" | "high" {
  // High priority for order-related issues
  if (contactData.orderId || contactData.type === "complaint") {
    return "high";
  }

  // Medium priority for specific subjects
  const highPriorityKeywords = [
    "urgent",
    "problem",
    "issue",
    "error",
    "payment",
    "delivery",
  ];
  const message = (contactData.message || "").toLowerCase();
  const subject = (contactData.subject || "").toLowerCase();

  const hasHighPriorityKeyword = highPriorityKeywords.some(
    (keyword) => message.includes(keyword) || subject.includes(keyword)
  );

  return hasHighPriorityKeyword ? "medium" : "low";
}
