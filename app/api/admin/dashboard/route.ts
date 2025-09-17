import { NextResponse } from "next/server";
import { DashboardStats } from "@/types/admin";

export async function GET() {
  try {
    // Mock dashboard statistics - In production, calculate from real database
    const stats: DashboardStats = {
      totalProducts: 125,
      lowStockProducts: 8,
      outOfStockProducts: 3,
      totalOrders: 1247,
      pendingOrders: 23,
      todayRevenue: 15750.0,
      monthlyRevenue: 487500.0,
      topSellingProducts: [
        {
          // @ts-expect-error - Mock data with partial Product interface
          product: {
            id: "1",
            title: "Full Chicken",
            category: "Poultry",
            price: 200,
            image: "/img-1.jpeg",
          },
          quantitySold: 156,
          revenue: 31200,
        },
        {
          // @ts-expect-error - Mock data with partial Product interface
          product: {
            id: "2",
            title: "Salmon",
            category: "SeaFood",
            price: 350,
            image: "/img-1.jpeg",
          },
          quantitySold: 89,
          revenue: 31150,
        },
        {
          // @ts-expect-error - Mock data with partial Product interface
          product: {
            id: "3",
            title: "Gizzard",
            category: "Meat",
            price: 150,
            image: "/img-1.jpeg",
          },
          quantitySold: 134,
          revenue: 20100,
        },
      ],
    };

    return NextResponse.json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error("Dashboard API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch dashboard stats",
      },
      { status: 500 }
    );
  }
}
