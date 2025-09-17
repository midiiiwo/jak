"use client";

import { useEffect, useRef } from "react";
import {
  webSocketService,
  WebSocketEvent,
} from "@/lib/services/websocket-service";
import { useAnalytics } from "./use-analytics";
import type { TimeFrame } from "@/types/analytics";

export function useRealtimeAnalytics(timeFrame: TimeFrame = "30d") {
  const { analytics, loading, refetch } = useAnalytics(timeFrame);
  const lastRefreshRef = useRef<number>(0);
  const refreshThrottleMs = 5000; // Throttle refreshes to every 5 seconds

  useEffect(() => {
    // Events that should trigger analytics refresh
    const eventsToListenFor: WebSocketEvent[] = [
      "order:created",
      "order:updated",
      "stock:updated",
      "product:updated",
    ];

    const handleDataUpdate = (data: any) => {
      console.log("Real-time data update received:", data);

      // Throttle refresh to avoid too frequent updates
      const now = Date.now();
      if (now - lastRefreshRef.current > refreshThrottleMs) {
        lastRefreshRef.current = now;
        refetch();
      }
    };

    // Subscribe to all relevant events
    eventsToListenFor.forEach((event) => {
      webSocketService.subscribe(event, handleDataUpdate);
    });

    // Connect to websocket
    webSocketService.connect();

    // Cleanup on unmount
    return () => {
      eventsToListenFor.forEach((event) => {
        webSocketService.unsubscribe(event);
      });
    };
  }, [refetch, refreshThrottleMs]);

  return {
    analytics,
    loading,
    refetch,
    isRealtime: true,
  };
}

export default useRealtimeAnalytics;
