'use client'

import { useState, useEffect } from 'react';
import type { AnalyticsData, TimeFrame } from '@/types/analytics';

export function useAnalytics(timeFrame: TimeFrame) {
    const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
    }, [timeFrame]);

    const fetchAnalytics = async () => {
        setLoading(true);
        try {
            // Simulate API call - replace with actual API
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Mock data - replace with actual API call
            const mockData: AnalyticsData = {
                revenue: {
                    total: 45280,
                    growth: 12.5,
                    trend: 'up',
                    monthly: [
                        { month: 'Jan', amount: 32000 },
                        { month: 'Feb', amount: 38000 },
                        { month: 'Mar', amount: 45280 },
                    ]
                },
                orders: {
                    total: 324,
                    growth: 8.3,
                    trend: 'up',
                    recent: [
                        { id: '#1234', customer: 'John Doe', amount: 85.50, status: 'completed', date: '2 hours ago' },
                        { id: '#1235', customer: 'Jane Smith', amount: 142.30, status: 'processing', date: '4 hours ago' },
                        { id: '#1236', customer: 'Mike Johnson', amount: 67.80, status: 'shipped', date: '6 hours ago' },
                    ]
                },
                customers: {
                    total: 1847,
                    growth: 15.2,
                    trend: 'up',
                    newThisMonth: 234,
                    returning: 1613
                },
                products: {
                    topSelling: [
                        { name: 'Full Chicken', sold: 156, revenue: 31200 },
                        { name: 'Salmon', sold: 89, revenue: 17800 },
                        { name: 'Gizzard', sold: 203, revenue: 71050 },
                    ],
                    lowStock: [
                        { name: 'Turkey', stock: 5 },
                        { name: 'Duck', stock: 8 },
                        { name: 'Prawns', stock: 12 },
                    ],
                    categories: [
                        { name: 'Poultry', percentage: 45, color: 'green.500' },
                        { name: 'Seafood', percentage: 30, color: 'blue.500' },
                        { name: 'Meat', percentage: 25, color: 'orange.500' },
                    ]
                },
                traffic: {
                    pageViews: 12480,
                    uniqueVisitors: 3240,
                    bounceRate: 32,
                    avgSessionTime: '3m 45s'
                }
            };

            setAnalytics(mockData);
        } catch (error) {
            console.error('Failed to fetch analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    return { analytics, loading, refetch: fetchAnalytics };
}
