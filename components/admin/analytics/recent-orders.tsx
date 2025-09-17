'use client'

import { Card, VStack, Box, HStack, Text, Icon, Badge } from '@chakra-ui/react';
import { FaClock } from 'react-icons/fa';
import { useColorModeValue } from '@/components/ui/color-mode';
import type { AnalyticsData } from '@/types/analytics';

interface RecentOrdersProps {
    orders: AnalyticsData['orders']['recent'];
}

export default function RecentOrders({ orders }: RecentOrdersProps) {
    const cardBg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const textColor = useColorModeValue('gray.800', 'white');
    const mutedTextColor = useColorModeValue('gray.600', 'gray.400');
    const itemBg = useColorModeValue('gray.50', 'gray.700');

    return (
        <Card.Root bg={cardBg} borderColor={borderColor}>
            <Card.Header>
                <HStack>
                    <Icon color="purple.600">
                        <FaClock />
                    </Icon>
                    <Text fontSize="lg" fontWeight="bold" color={textColor}>
                        Recent Orders
                    </Text>
                </HStack>
            </Card.Header>
            <Card.Body>
                <VStack gap={3} align="stretch">
                    {orders.map((order, index) => (
                        <Box key={index} p={3} borderRadius="md" bg={itemBg}>
                            <HStack justify="space-between" mb={2}>
                                <Text fontSize="sm" fontWeight="medium" color={textColor}>{order.id}</Text>
                                <Badge
                                    colorPalette={order.status === 'completed' ? 'green' : order.status === 'processing' ? 'yellow' : 'blue'}
                                    size="sm"
                                >
                                    {order.status}
                                </Badge>
                            </HStack>
                            <Text fontSize="sm" color={mutedTextColor} mb={1}>{order.customer}</Text>
                            <HStack justify="space-between">
                                <Text fontSize="sm" fontWeight="bold" color="green.600">
                                    GHC {order.amount.toFixed(2)}
                                </Text>
                                <Text fontSize="xs" color={mutedTextColor}>{order.date}</Text>
                            </HStack>
                        </Box>
                    ))}
                </VStack>
            </Card.Body>
        </Card.Root>
    );
}
