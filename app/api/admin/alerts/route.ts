import { NextRequest, NextResponse } from "next/server";
import { withAdminAuth } from "@/lib/middleware/admin-auth";
import { notificationService } from "@/lib/services/notification-service";

async function handleGET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "20");
    const unreadOnly = searchParams.get("unreadOnly") === "true";

    const alerts = await notificationService.getAdminAlerts(limit, unreadOnly);

    return NextResponse.json({
      success: true,
      data: alerts,
      total: alerts.length,
    });
  } catch (error) {
    console.error("Error fetching admin alerts:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch alerts" },
      { status: 500 }
    );
  }
}

async function handlePOST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, alertId } = body;

    if (action === "markAsRead" && alertId) {
      const success = await notificationService.markAlertAsRead(alertId);

      if (success) {
        return NextResponse.json({
          success: true,
          message: "Alert marked as read",
        });
      } else {
        return NextResponse.json(
          { success: false, error: "Failed to mark alert as read" },
          { status: 500 }
        );
      }
    }

    if (action === "cleanup") {
      await notificationService.cleanupExpiredAlerts();
      return NextResponse.json({
        success: true,
        message: "Expired alerts cleaned up",
      });
    }

    return NextResponse.json(
      { success: false, error: "Invalid action" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error processing alert action:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export const GET = withAdminAuth(handleGET, ["alerts:read"]);
export const POST = withAdminAuth(handlePOST, ["alerts:write"]);
