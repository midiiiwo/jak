import {
  productService,
  orderService,
  customerService,
  stockMovementService,
} from "./database-service";
import { Order, Product } from "@/types/admin";
import { Customer } from "@/types/customer";
import type { AnalyticsData, TimeFrame } from "@/types/analytics";

export class AnalyticsService {
  /**
   * Calculate analytics data for a given time frame
   */
  async getAnalyticsData(timeFrame: TimeFrame): Promise<AnalyticsData> {
    const { startDate, endDate } = this.getDateRange(timeFrame);

    // Fetch all required data in parallel
    const [
      allOrders,
      allCustomers,
      allProducts,
      lowStockProducts,
      recentOrders,
    ] = await Promise.all([
      this.getOrdersInRange(startDate, endDate),
      customerService.getCustomers({ limit: 10000 }),
      productService.getProducts({ limit: 10000 }),
      productService.getLowStockProducts(),
      orderService.getOrders({ limit: 10, page: 1 }),
    ]);

    // Calculate revenue analytics
    const revenue = this.calculateRevenueAnalytics(allOrders.orders, timeFrame);

    // Calculate order analytics
    const orders = this.calculateOrderAnalytics(
      allOrders.orders,
      recentOrders.orders
    );

    // Calculate customer analytics
    const customers = this.calculateCustomerAnalytics(
      allCustomers.customers,
      startDate
    );

    // Calculate product analytics
    const products = this.calculateProductAnalytics(
      allProducts.products,
      allOrders.orders,
      lowStockProducts
    );

    // Calculate traffic analytics (mock for now - would need real tracking)
    const traffic = this.calculateTrafficAnalytics();

    return {
      revenue,
      orders,
      customers,
      products,
      traffic,
    };
  }

  private getDateRange(timeFrame: TimeFrame): {
    startDate: Date;
    endDate: Date;
  } {
    const endDate = new Date();
    const startDate = new Date();

    switch (timeFrame) {
      case "7d":
        startDate.setDate(endDate.getDate() - 7);
        break;
      case "30d":
        startDate.setDate(endDate.getDate() - 30);
        break;
      case "90d":
        startDate.setDate(endDate.getDate() - 90);
        break;
      case "1y":
        startDate.setFullYear(endDate.getFullYear() - 1);
        break;
    }

    return { startDate, endDate };
  }

  private async getOrdersInRange(startDate: Date, endDate: Date) {
    return orderService.getOrders({
      startDate,
      endDate,
      limit: 10000, // Get all orders in range
    });
  }

  private calculateRevenueAnalytics(orders: Order[], timeFrame: TimeFrame) {
    const total = orders.reduce((sum, order) => sum + order.total, 0);

    // Calculate previous period for growth comparison
    const { startDate: prevStart, endDate: prevEnd } =
      this.getPreviousDateRange(timeFrame);

    // For now, we'll simulate growth calculation
    // In a real implementation, you'd fetch previous period data
    const growth = Math.random() * 20 - 5; // Random growth between -5% and 15%

    // Generate monthly revenue data for charts
    const monthly = this.generateMonthlyRevenue(orders);

    return {
      total,
      growth,
      trend: growth > 0 ? ("up" as const) : ("down" as const),
      monthly,
    };
  }

  private calculateOrderAnalytics(allOrders: Order[], recentOrders: Order[]) {
    const total = allOrders.length;
    const growth = Math.random() * 15; // Simulate growth

    // Format recent orders for display
    const recent = recentOrders.slice(0, 5).map((order) => ({
      id: `#${order.orderNumber}`,
      customer: order.customerInfo?.name || "Unknown Customer",
      amount: order.total,
      status: order.status,
      date: this.formatTimeAgo(order.createdAt),
    }));

    return {
      total,
      growth,
      trend: "up" as const,
      recent,
    };
  }

  private calculateCustomerAnalytics(customers: Customer[], startDate: Date) {
    const total = customers.length;

    // Calculate new customers this period
    const newThisMonth = customers.filter(
      (customer) => new Date(customer.registrationDate) >= startDate
    ).length;

    const returning = total - newThisMonth;
    const growth = total > 0 ? (newThisMonth / total) * 100 : 0;

    return {
      total,
      growth,
      trend: "up" as const,
      newThisMonth,
      returning,
    };
  }

  private calculateProductAnalytics(
    products: Product[],
    orders: Order[],
    lowStockProducts: Product[]
  ) {
    // Calculate top selling products
    const productSales: {
      [key: string]: { quantity: number; revenue: number; product: Product };
    } = {};

    orders.forEach((order) => {
      order.items.forEach((item) => {
        const product = products.find((p) => p.id === item.productId);
        if (product) {
          if (!productSales[item.productId]) {
            productSales[item.productId] = {
              quantity: 0,
              revenue: 0,
              product,
            };
          }
          productSales[item.productId].quantity += item.quantity;
          productSales[item.productId].revenue += item.price * item.quantity;
        }
      });
    });

    const topSelling = Object.values(productSales)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5)
      .map((sale) => ({
        name: sale.product.title,
        sold: sale.quantity,
        revenue: sale.revenue,
      }));

    // Format low stock products
    const lowStock = lowStockProducts.slice(0, 5).map((product) => ({
      name: product.title,
      stock: product.stock,
    }));

    // Calculate category performance
    const categoryStats: { [key: string]: number } = {};
    products.forEach((product) => {
      if (!categoryStats[product.category]) {
        categoryStats[product.category] = 0;
      }
      categoryStats[product.category]++;
    });

    const totalProducts = products.length;
    const categories = Object.entries(categoryStats)
      .map(([name, count]) => ({
        name,
        percentage:
          totalProducts > 0 ? Math.round((count / totalProducts) * 100) : 0,
        color: this.getCategoryColor(name),
      }))
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 5);

    return {
      topSelling,
      lowStock,
      categories,
    };
  }

  private calculateTrafficAnalytics() {
    // Mock traffic data - in a real app, you'd integrate with Google Analytics or similar
    return {
      pageViews: Math.floor(Math.random() * 20000) + 10000,
      uniqueVisitors: Math.floor(Math.random() * 5000) + 2000,
      bounceRate: Math.floor(Math.random() * 40) + 20,
      avgSessionTime: `${Math.floor(Math.random() * 5) + 2}m ${Math.floor(
        Math.random() * 60
      )}s`,
    };
  }

  private getPreviousDateRange(timeFrame: TimeFrame): {
    startDate: Date;
    endDate: Date;
  } {
    const { startDate, endDate } = this.getDateRange(timeFrame);
    const duration = endDate.getTime() - startDate.getTime();

    const prevEndDate = new Date(startDate.getTime() - 1);
    const prevStartDate = new Date(prevEndDate.getTime() - duration);

    return { startDate: prevStartDate, endDate: prevEndDate };
  }

  private generateMonthlyRevenue(orders: Order[]) {
    const monthlyData: { [key: string]: number } = {};

    orders.forEach((order) => {
      const date = new Date(order.createdAt);
      const monthKey = date.toLocaleDateString("en-US", { month: "short" });

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = 0;
      }
      monthlyData[monthKey] += order.total;
    });

    // Get last 3 months
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const currentMonth = new Date().getMonth();
    const lastThreeMonths = [];

    for (let i = 2; i >= 0; i--) {
      const monthIndex = (currentMonth - i + 12) % 12;
      const monthName = months[monthIndex];
      lastThreeMonths.push({
        month: monthName,
        amount: monthlyData[monthName] || 0,
      });
    }

    return lastThreeMonths;
  }

  private formatTimeAgo(date: Date | string): string {
    const now = new Date();
    const orderDate = new Date(date);
    const diffMs = now.getTime() - orderDate.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) {
      return "Just now";
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
    } else {
      return orderDate.toLocaleDateString();
    }
  }

  private getCategoryColor(categoryName: string): string {
    const colors = [
      "green.500",
      "blue.500",
      "orange.500",
      "purple.500",
      "red.500",
      "teal.500",
      "pink.500",
    ];

    // Simple hash function to assign consistent colors
    let hash = 0;
    for (let i = 0; i < categoryName.length; i++) {
      hash = categoryName.charCodeAt(i) + ((hash << 5) - hash);
    }

    return colors[Math.abs(hash) % colors.length];
  }
}

export const analyticsService = new AnalyticsService();
