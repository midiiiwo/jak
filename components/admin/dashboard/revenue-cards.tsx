import { SimpleGrid } from '@chakra-ui/react';
import { FaDollarSign } from 'react-icons/fa';
import { StatCard } from '@/components/admin/shared';
import { DashboardStats } from '@/types/admin';
import { formatCurrency } from '@/lib/utils';

interface RevenueCardsProps {
    stats: DashboardStats;
}

export default function RevenueCards({ stats }: RevenueCardsProps) {
    return (
        <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
            <StatCard
                title="Today's Revenue"
                value={formatCurrency(stats.todayRevenue)}
                icon={FaDollarSign}
                color="green"
                trend={8.5}
                subtitle="vs yesterday"
            />
            <StatCard
                title="Monthly Revenue"
                value={formatCurrency(stats.monthlyRevenue)}
                icon={FaDollarSign}
                color="green"
                trend={15.3}
                subtitle="vs last month"
            />
        </SimpleGrid>
    );
}
