import { NextRequest, NextResponse } from "next/server";
import { analyticsService } from "@/lib/services/analytics-service";
import type { TimeFrame } from "@/types/analytics";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const timeFrame = (searchParams.get("timeFrame") as TimeFrame) || "30d";

    // Validate timeFrame
    const validTimeFrames: TimeFrame[] = ["7d", "30d", "90d", "1y"];
    if (!validTimeFrames.includes(timeFrame)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid time frame. Must be one of: 7d, 30d, 90d, 1y",
        },
        { status: 400 }
      );
    }

    const analytics = await analyticsService.getAnalyticsData(timeFrame);

    return NextResponse.json({
      success: true,
      data: analytics,
      timeFrame,
    });
  } catch (error) {
    console.error("Analytics API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch analytics data",
      },
      { status: 500 }
    );
  }
}
