'use client'

import { Card, HStack, VStack, Text, Circle, Icon } from '@chakra-ui/react';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { useColorModeValue } from '@/components/ui/color-mode';
import type { MetricCardProps } from '@/types/analytics';

export default function MetricCard({
    title,
    value,
    growth,
    trend,
    icon,
    color = 'green'
}: MetricCardProps) {
    const cardBg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const textColor = useColorModeValue('gray.800', 'white');
    const mutedTextColor = useColorModeValue('gray.600', 'gray.400');
    const successColor = useColorModeValue('green.500', 'green.400');
    const errorColor = useColorModeValue('red.500', 'red.400');

    return (
        <Card.Root
            bg={cardBg}
            borderColor={borderColor}
            p={6}
            _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
            transition="all 0.3s"
        >
            <Card.Body>
                <HStack justify="space-between" mb={4}>
                    <Circle size="50px" bg={`${color}.100`} color={`${color}.600`}>
                        {icon}
                    </Circle>
                    {growth && (
                        <HStack>
                            <Icon color={trend === 'up' ? successColor : errorColor}>
                                {trend === 'up' ? <FaArrowUp /> : <FaArrowDown />}
                            </Icon>
                            <Text fontSize="sm" color={trend === 'up' ? successColor : errorColor} fontWeight="medium">
                                {growth}%
                            </Text>
                        </HStack>
                    )}
                </HStack>
                <VStack align="start" gap={1}>
                    <Text fontSize="2xl" fontWeight="bold" color={textColor}>
                        {typeof value === 'number' ? value.toLocaleString() : value}
                    </Text>
                    <Text fontSize="sm" color={mutedTextColor}>
                        {title}
                    </Text>
                </VStack>
            </Card.Body>
        </Card.Root>
    );
}
