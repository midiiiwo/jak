'use client'
import { useState, useEffect } from 'react';
import { Box, VStack, Heading, Text, Grid } from '@chakra-ui/react';
import { useColorModeValue } from '@/components/ui/color-mode';
import { DashboardStats } from '@/types/admin';
import { LoadingSpinner, ErrorFallback } from '@/components/shared';
import TopSellingProducts from './dashboard/top-selling-products';
import QuickActions from './dashboard/quick-actions';
import RevenueCards from './dashboard/revenue-cards';
import StatsGrid from './dashboard/stats-grid';
import { API_ENDPOINTS } from '@/lib/utils';

export default function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const bgColor = useColorModeValue('gray.50', 'gray.900');
    const textColor = useColorModeValue('gray.800', 'white');

    useEffect(() => {
        fetchDashboardStats();
    }, []);

    const fetchDashboardStats = async () => {
        try {
            setLoading(true);
            setError(false);
            const response = await fetch(API_ENDPOINTS.admin.dashboard);
            const data = await response.json();
            if (data.success) {
                setStats(data.stats);
            } else {
                setError(true);
            }
        } catch (error) {
            console.error('Failed to fetch dashboard stats:', error);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <LoadingSpinner
                title="Loading Dashboard..."
                subtitle="Fetching your latest data"
            />
        );
    }

    if (error || !stats) {
        return (
            <ErrorFallback
                title="Dashboard Unavailable"
                message="Failed to load dashboard data"
                onRetry={fetchDashboardStats}
            />
        );
    }

    return (
        <Box p={8} bg={bgColor} minH="100vh">
            <VStack align="start" gap={8} maxW="7xl" mx="auto">
                {/* Header Section */}
                <Box w="100%">
                    <VStack align="start" gap={2}>
                        <Heading size="2xl" color={textColor} fontWeight="bold">
                            Admin Dashboard
                        </Heading>
                        <Text color="gray.500" fontSize="lg">
                            Welcome back! Here&apos;s what&apos;s happening with your store today.
                        </Text>
                    </VStack>
                </Box>

                {/* Main Stats Grid */}
                <StatsGrid stats={stats} />

                {/* Revenue Section */}
                <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={6} w="100%">
                    <RevenueCards stats={stats} />
                    <QuickActions />
                </Grid>

                {/* Top Selling Products */}
                <TopSellingProducts stats={stats} />
            </VStack>
        </Box>
    );
}
