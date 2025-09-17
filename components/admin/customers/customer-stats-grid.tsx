'use client'

import { Grid, Card, Stat, Flex, VStack, Text, Center, Box } from '@chakra-ui/react';
import { FaUsers, FaUserCheck, FaCrown, FaDollarSign } from 'react-icons/fa';
import { useColorModeValue } from '@/components/ui/color-mode';
import type { CustomerStats } from '@/types/customer';

interface CustomerStatsGridProps {
    stats: CustomerStats;
}

export default function CustomerStatsGrid({ stats }: CustomerStatsGridProps) {
    const cardBg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const textColor = useColorModeValue('gray.800', 'white');
    const mutedTextColor = useColorModeValue('gray.600', 'gray.400');
    const cardShadow = useColorModeValue('lg', 'dark-lg');

    const statCards = [
        {
            title: "Total Customers",
            value: stats.totalCustomers,
            subtitle: `+${stats.newCustomersThisMonth} this month`,
            icon: FaUsers,
            color: "blue",
            bgColor: "blue.50",
            darkBgColor: "blue.900"
        },
        {
            title: "Active Customers",
            value: stats.activeCustomers,
            subtitle: `${((stats.activeCustomers / stats.totalCustomers) * 100).toFixed(1)}% of total`,
            icon: FaUserCheck,
            color: "green",
            bgColor: "green.50",
            darkBgColor: "green.900"
        },
        {
            title: "VIP Customers",
            value: stats.vipCustomers,
            subtitle: `${stats.premiumCustomers} premium customers`,
            icon: FaCrown,
            color: "purple",
            bgColor: "purple.50",
            darkBgColor: "purple.900"
        },
        {
            title: "Total Revenue",
            value: `GHC ${stats.totalRevenue.toLocaleString()}`,
            subtitle: `Avg: GHC ${stats.averageOrderValue.toFixed(2)}`,
            icon: FaDollarSign,
            color: "orange",
            bgColor: "orange.50",
            darkBgColor: "orange.900"
        }
    ];

    return (
        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }} gap={6}>
            {statCards.map((card, index) => (
                <Card.Root
                    key={index}
                    bg={cardBg}
                    rounded="2xl"
                    shadow={cardShadow}
                    border="1px solid"
                    borderColor={borderColor}
                    _hover={{
                        transform: 'translateY(-4px)',
                        shadow: '2xl',
                        borderColor: `${card.color}.300`
                    }}
                    transition="all 0.3s ease"
                    overflow="hidden"
                    position="relative"
                >
                    <Card.Body p={6}>
                        <Stat.Root>
                            <Flex justify="space-between" align="center">
                                <VStack align="start" gap={2} flex="1">
                                    <Stat.Label color={mutedTextColor} fontSize="sm" fontWeight="medium">
                                        {card.title}
                                    </Stat.Label>
                                    <Stat.ValueText fontSize="3xl" fontWeight="bold" color={textColor}>
                                        {card.value}
                                    </Stat.ValueText>
                                    <Text fontSize="xs" color="green.500" fontWeight="medium">
                                        {card.subtitle}
                                    </Text>
                                </VStack>
                                <Center
                                    bg={card.bgColor}
                                    _dark={{ bg: card.darkBgColor }}
                                    rounded="2xl"
                                    p={4}
                                    color={`${card.color}.500`}
                                >
                                    <card.icon size={24} />
                                </Center>
                            </Flex>
                        </Stat.Root>
                    </Card.Body>
                    <Box
                        position="absolute"
                        bottom={0}
                        left={0}
                        right={0}
                        h="3px"
                        bg={`${card.color}.500`}
                    />
                </Card.Root>
            ))}
        </Grid>
    );
}
