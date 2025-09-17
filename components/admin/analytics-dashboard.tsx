"use client";

import { useState } from "react";
import { Box, Grid, VStack, Text, Circle, Icon } from "@chakra-ui/react";
import {
  FaChartLine,
  FaDollarSign,
  FaShoppingCart,
  FaUsers,
  FaEye,
} from "react-icons/fa";
import { useColorModeValue } from "@/components/ui/color-mode";
import { ErrorFallback } from "@/components/shared";
import {
  MetricCard,
  TopSellingProducts,
  CategoryPerformance,
  RecentOrders,
  LowStockAlert,
  TrafficOverview,
  AnalyticsHeader,
} from "@/components/admin/analytics";
import { useRealtimeAnalytics } from "@/hooks/use-realtime-analytics";
import type { TimeFrame } from "@/types/analytics";

export default function AnalyticsDashboard() {
  const [timeFrame, setTimeFrame] = useState<TimeFrame>("30d");
  const { analytics, loading } = useRealtimeAnalytics(timeFrame);

  const bgColor = useColorModeValue("gray.50", "gray.900");
  const mutedTextColor = useColorModeValue("gray.600", "gray.400");

  if (loading) {
    return (
      <Box p={8} bg={bgColor} minH="100vh">
        <VStack gap={6} align="center" justify="center" minH="60vh">
          <Circle size="60px" bg="green.100">
            <Icon color="green.600" boxSize="24px">
              <FaChartLine />
            </Icon>
          </Circle>
          <Text fontSize="lg" color={mutedTextColor}>
            Loading analytics...
          </Text>
        </VStack>
      </Box>
    );
  }

  if (!analytics) {
    return (
      <Box p={8} bg={bgColor} minH="100vh">
        <ErrorFallback message="Failed to load analytics data" />
      </Box>
    );
  }

  return (
    <Box p={8} bg={bgColor} minH="100vh">
      <AnalyticsHeader timeFrame={timeFrame} onTimeFrameChange={setTimeFrame} />

      {/* Key Metrics */}
      <Grid
        templateColumns={{
          base: "1fr",
          md: "repeat(2, 1fr)",
          lg: "repeat(4, 1fr)",
        }}
        gap={6}
        mb={8}
      >
        <MetricCard
          title="Total Revenue"
          value={`GHC ${analytics.revenue.total.toLocaleString()}`}
          growth={analytics.revenue.growth}
          trend={analytics.revenue.trend}
          icon={<FaDollarSign />}
          color="green"
        />
        <MetricCard
          title="Total Orders"
          value={analytics.orders.total}
          growth={analytics.orders.growth}
          trend={analytics.orders.trend}
          icon={<FaShoppingCart />}
          color="blue"
        />
        <MetricCard
          title="Total Customers"
          value={analytics.customers.total}
          growth={analytics.customers.growth}
          trend={analytics.customers.trend}
          icon={<FaUsers />}
          color="purple"
        />
        <MetricCard
          title="Page Views"
          value={analytics.traffic.pageViews}
          icon={<FaEye />}
          color="orange"
        />
      </Grid>

      <Grid
        templateColumns={{ base: "1fr", lg: "repeat(2, 1fr)" }}
        gap={8}
        mb={8}
      >
        <TopSellingProducts products={analytics.products.topSelling} />
        <CategoryPerformance categories={analytics.products.categories} />
      </Grid>

      <Grid templateColumns={{ base: "1fr", lg: "repeat(3, 1fr)" }} gap={8}>
        <RecentOrders orders={analytics.orders.recent} />
        <LowStockAlert products={analytics.products.lowStock} />
        <TrafficOverview traffic={analytics.traffic} />
      </Grid>
    </Box>
  );
}
