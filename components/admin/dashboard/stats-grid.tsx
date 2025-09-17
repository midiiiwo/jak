import { SimpleGrid } from '@chakra-ui/react';
import { FaBoxes, FaExclamationTriangle, FaTimesCircle, FaClock } from 'react-icons/fa';
import { StatCard } from '@/components/admin/shared';
import { DashboardStats } from '@/types/admin';

interface StatsGridProps {
    stats: DashboardStats;
}

export default function StatsGrid({ stats }: StatsGridProps) {
    return (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={6} w="100%">
            <StatCard
                title="Total Products"
                value={stats.totalProducts}
                icon={FaBoxes}
                color="blue"
                trend={12}
                subtitle="Active inventory items"
            />
            <StatCard
                title="Low Stock Alert"
                value={stats.lowStockProducts}
                icon={FaExclamationTriangle}
                color="orange"
                subtitle="Items below threshold"
            />
            <StatCard
                title="Out of Stock"
                value={stats.outOfStockProducts}
                icon={FaTimesCircle}
                color="red"
                subtitle="Requires restocking"
            />
            <StatCard
                title="Pending Orders"
                value={stats.pendingOrders}
                icon={FaClock}
                color="purple"
                trend={-5}
                subtitle="Awaiting processing"
            />
        </SimpleGrid>
    );
}
