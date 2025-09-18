import { NextRequest, NextResponse } from "next/server";
import { withAdminAuth } from "@/lib/middleware/admin-auth";
import { notificationService } from "@/lib/services/notification-service";

async function handleGET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    const logs = await notificationService.getNotificationLogs(limit, offset);

    return NextResponse.json({
      success: true,
      data: logs,
      pagination: {
        limit,
        offset,
        total: logs.length,
      },
    });
  } catch (error) {
    console.error("Error fetching notification logs:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch notification logs" },
      { status: 500 }
    );
  }
}

async function handlePOST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, recipients, subject, message, priority, category, metadata } =
      body;

    // Validate required fields
    if (!type || !recipients || !message || !priority || !category) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const success = await notificationService.sendNotification({
      type,
      recipients,
      subject,
      message,
      priority,
      category,
      metadata,
    });

    if (success) {
      return NextResponse.json({
        success: true,
        message: "Notification sent successfully",
      });
    } else {
      return NextResponse.json(
        { success: false, error: "Failed to send notification" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error sending notification:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export const GET = withAdminAuth(handleGET, ["notifications:read"]);
export const POST = withAdminAuth(handlePOST, ["notifications:write"]);
