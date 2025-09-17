"use client";

import { useState, useEffect } from "react";
import type { AnalyticsData, TimeFrame } from "@/types/analytics";

export function useAnalytics(timeFrame: TimeFrame) {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [timeFrame]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/admin/analytics?timeFrame=${timeFrame}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to fetch analytics");
      }

      setAnalytics(result.data);
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
      setAnalytics(null);
    } finally {
      setLoading(false);
    }
  };

  return { analytics, loading, refetch: fetchAnalytics };
}
