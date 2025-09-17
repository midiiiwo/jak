'use client'

import { Card, VStack, HStack, Text, Icon, Badge, Button } from '@chakra-ui/react';
import { FaBoxes } from 'react-icons/fa';
import { useColorModeValue } from '@/components/ui/color-mode';
import type { AnalyticsData } from '@/types/analytics';

interface LowStockAlertProps {
    products: AnalyticsData['products']['lowStock'];
}

export default function LowStockAlert({ products }: LowStockAlertProps) {
    const cardBg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const textColor = useColorModeValue('gray.800', 'white');
    const lowStockBg = useColorModeValue('red.50', 'red.900');

    return (
        <Card.Root bg={cardBg} borderColor={borderColor}>
            <Card.Header>
                <HStack>
                    <Icon color="red.600">
                        <FaBoxes />
                    </Icon>
                    <Text fontSize="lg" fontWeight="bold" color={textColor}>
                        Low Stock Alert
                    </Text>
                </HStack>
            </Card.Header>
            <Card.Body>
                <VStack gap={3} align="stretch">
                    {products.map((product, index) => (
                        <HStack key={index} justify="space-between" p={3} borderRadius="md" bg={lowStockBg}>
                            <Text fontWeight="medium" color={textColor}>{product.name}</Text>
                            <Badge colorPalette="red" size="sm">
                                {product.stock} left
                            </Badge>
                        </HStack>
                    ))}
                </VStack>
                <Button size="sm" bg="red.600" color="white" w="100%" mt={4} _hover={{ bg: 'red.700' }}>
                    Restock Products
                </Button>
            </Card.Body>
        </Card.Root>
    );
}
