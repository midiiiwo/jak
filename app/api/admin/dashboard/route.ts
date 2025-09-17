import { NextRequest, NextResponse } from "next/server";
import {
  productService,
  orderService,
  customerService,
} from "@/lib/services/database-service";
import { DashboardStats } from "@/types/admin";

export async function GET(request: NextRequest) {
  try {
    // Get today's date for filtering
    const today = new Date();
    const startOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    // Fetch data in parallel for better performance
    const [
      allProducts,
      lowStockProducts,
      allOrders,
      pendingOrders,
      todayOrders,
      monthlyOrders,
      allCustomers,
    ] = await Promise.all([
      productService.getProducts({ limit: 10000 }),
      productService.getLowStockProducts(),
      orderService.getOrders({ limit: 10000 }),
      orderService.getOrders({ status: "pending", limit: 1000 }),
      orderService.getOrders({
        startDate: startOfToday,
        endDate: new Date(),
        limit: 1000,
      }),
      orderService.getOrders({
        startDate: startOfMonth,
        endDate: new Date(),
        limit: 1000,
      }),
      customerService.getCustomers({ limit: 10000 }),
    ]);

    // Calculate out of stock products
    const outOfStockProducts = allProducts.products.filter(
      (p) => p.stock <= 0
    ).length;

    // Calculate today's revenue
    const todayRevenue = todayOrders.orders.reduce(
      (sum, order) => sum + order.total,
      0
    );

    // Calculate monthly revenue
    const monthlyRevenue = monthlyOrders.orders.reduce(
      (sum, order) => sum + order.total,
      0
    );

    // Calculate top selling products
    const productSales: {
      [key: string]: { product: any; quantitySold: number; revenue: number };
    } = {};

    allOrders.orders.forEach((order) => {
      order.items.forEach((item) => {
        const product = allProducts.products.find(
          (p) => p.id === item.productId
        );
        if (product) {
          if (!productSales[item.productId]) {
            productSales[item.productId] = {
              product: {
                id: product.id,
                title: product.title,
                category: product.category,
                price: product.price,
                image: product.images?.[0] || "/img-1.jpeg",
              },
              quantitySold: 0,
              revenue: 0,
            };
          }
          productSales[item.productId].quantitySold += item.quantity;
          productSales[item.productId].revenue += item.price * item.quantity;
        }
      });
    });

    const topSellingProducts = Object.values(productSales)
      .sort((a, b) => b.quantitySold - a.quantitySold)
      .slice(0, 3);

    const stats: DashboardStats = {
      totalProducts: allProducts.products.length,
      lowStockProducts: lowStockProducts.length,
      outOfStockProducts,
      totalOrders: allOrders.orders.length,
      pendingOrders: pendingOrders.orders.length,
      todayRevenue,
      monthlyRevenue,
      topSellingProducts,
      totalCustomers: allCustomers.customers.length,
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
