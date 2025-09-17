export interface AnalyticsData {
  revenue: {
    total: number;
    growth: number;
    trend: "up" | "down";
    monthly: { month: string; amount: number }[];
  };
  orders: {
    total: number;
    growth: number;
    trend: "up" | "down";
    recent: {
      id: string;
      customer: string;
      amount: number;
      status: string;
      date: string;
    }[];
  };
  customers: {
    total: number;
    growth: number;
    trend: "up" | "down";
    newThisMonth: number;
    returning: number;
  };
  products: {
    topSelling: { name: string; sold: number; revenue: number }[];
    lowStock: { name: string; stock: number }[];
    categories: { name: string; percentage: number; color: string }[];
  };
  traffic: {
    pageViews: number;
    uniqueVisitors: number;
    bounceRate: number;
    avgSessionTime: string;
  };
}

export type TimeFrame = "7d" | "30d" | "90d" | "1y";

export interface MetricCardProps {
  title: string;
  value: string | number;
  growth?: number;
  trend?: "up" | "down";
  icon: React.ReactNode;
  color?: string;
}
