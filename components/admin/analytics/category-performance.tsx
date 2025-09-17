'use client'

import { Card, VStack, HStack, Text, Icon, Progress } from '@chakra-ui/react';
import { FaBoxes } from 'react-icons/fa';
import { useColorModeValue } from '@/components/ui/color-mode';
import type { AnalyticsData } from '@/types/analytics';

interface CategoryPerformanceProps {
    categories: AnalyticsData['products']['categories'];
}

export default function CategoryPerformance({ categories }: CategoryPerformanceProps) {
    const cardBg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const textColor = useColorModeValue('gray.800', 'white');
    const mutedTextColor = useColorModeValue('gray.600', 'gray.400');

    return (
        <Card.Root bg={cardBg} borderColor={borderColor}>
            <Card.Header>
                <HStack>
                    <Icon color="blue.600">
                        <FaBoxes />
                    </Icon>
                    <Text fontSize="lg" fontWeight="bold" color={textColor}>
                        Category Performance
                    </Text>
                </HStack>
            </Card.Header>
            <Card.Body>
                <VStack gap={4} align="stretch">
                    {categories.map((category, index) => (
                        <VStack key={index} align="stretch" gap={2}>
                            <HStack justify="space-between">
                                <Text fontWeight="medium" color={textColor}>{category.name}</Text>
                                <Text fontSize="sm" color={mutedTextColor}>{category.percentage}%</Text>
                            </HStack>
                            <Progress.Root value={category.percentage} maxW="100%">
                                <Progress.Track>
                                    <Progress.Range bg={category.color} />
                                </Progress.Track>
                            </Progress.Root>
                        </VStack>
                    ))}
                </VStack>
            </Card.Body>
        </Card.Root>
    );
}
