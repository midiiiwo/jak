'use client'

import { Card, VStack, HStack, Text, Icon } from '@chakra-ui/react';
import { IoTrendingUp } from 'react-icons/io5';
import { useColorModeValue } from '@/components/ui/color-mode';
import type { AnalyticsData } from '@/types/analytics';

interface TopSellingProductsProps {
    products: AnalyticsData['products']['topSelling'];
}

export default function TopSellingProducts({ products }: TopSellingProductsProps) {
    const cardBg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const textColor = useColorModeValue('gray.800', 'white');
    const mutedTextColor = useColorModeValue('gray.600', 'gray.400');
    const itemBg = useColorModeValue('gray.50', 'gray.700');

    return (
        <Card.Root bg={cardBg} borderColor={borderColor}>
            <Card.Header>
                <HStack>
                    <Icon color="green.600">
                        <IoTrendingUp />
                    </Icon>
                    <Text fontSize="lg" fontWeight="bold" color={textColor}>
                        Top Selling Products
                    </Text>
                </HStack>
            </Card.Header>
            <Card.Body>
                <VStack gap={4} align="stretch">
                    {products.map((product, index) => (
                        <HStack key={index} justify="space-between" p={3} borderRadius="md" bg={itemBg}>
                            <VStack align="start" gap={0}>
                                <Text fontWeight="medium" color={textColor}>{product.name}</Text>
                                <Text fontSize="sm" color={mutedTextColor}>{product.sold} units sold</Text>
                            </VStack>
                            <Text fontWeight="bold" color="green.600">
                                GHC {product.revenue.toLocaleString()}
                            </Text>
                        </HStack>
                    ))}
                </VStack>
            </Card.Body>
        </Card.Root>
    );
}
