'use client'

import { Card, VStack, HStack, Text, Icon, Button, Separator } from '@chakra-ui/react';
import { FaEye, FaPercent } from 'react-icons/fa';
import { useColorModeValue } from '@/components/ui/color-mode';
import type { AnalyticsData } from '@/types/analytics';

interface TrafficOverviewProps {
    traffic: AnalyticsData['traffic'];
}

export default function TrafficOverview({ traffic }: TrafficOverviewProps) {
    const cardBg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const textColor = useColorModeValue('gray.800', 'white');
    const mutedTextColor = useColorModeValue('gray.600', 'gray.400');

    return (
        <Card.Root bg={cardBg} borderColor={borderColor}>
            <Card.Header>
                <HStack>
                    <Icon color="orange.600">
                        <FaEye />
                    </Icon>
                    <Text fontSize="lg" fontWeight="bold" color={textColor}>
                        Traffic Overview
                    </Text>
                </HStack>
            </Card.Header>
            <Card.Body>
                <VStack gap={4} align="stretch">
                    <HStack justify="space-between">
                        <Text color={mutedTextColor}>Unique Visitors</Text>
                        <Text fontWeight="bold" color={textColor}>{traffic.uniqueVisitors.toLocaleString()}</Text>
                    </HStack>
                    <HStack justify="space-between">
                        <Text color={mutedTextColor}>Bounce Rate</Text>
                        <HStack>
                            <Text fontWeight="bold" color={textColor}>{traffic.bounceRate}%</Text>
                            <Icon color="orange.500">
                                <FaPercent />
                            </Icon>
                        </HStack>
                    </HStack>
                    <HStack justify="space-between">
                        <Text color={mutedTextColor}>Avg. Session</Text>
                        <Text fontWeight="bold" color={textColor}>{traffic.avgSessionTime}</Text>
                    </HStack>
                    <Separator />
                    <Button size="sm" variant="outline" w="100%">
                        View Detailed Report
                    </Button>
                </VStack>
            </Card.Body>
        </Card.Root>
    );
}
