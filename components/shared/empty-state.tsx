import React from 'react';
import { Box, VStack, Circle, Icon, Text, Button } from '@chakra-ui/react';
import { useColorModeValue } from '@/components/ui/color-mode';

interface EmptyStateProps {
    icon: React.ElementType;
    title: string;
    description?: string;
    action?: {
        label: string;
        onClick: () => void;
        colorPalette?: string;
    };
    actionLabel?: string;
    onAction?: () => void;
}

export default function EmptyState({ icon, title, description,  action }: EmptyStateProps) {
    const cardBg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const textColor = useColorModeValue('gray.800', 'white');
    const mutedTextColor = useColorModeValue('gray.500', 'gray.400');

    return (
        <Box
            bg={cardBg}
            shadow="lg"
            border="1px solid"
            borderColor={borderColor}
            borderRadius="xl"
            textAlign="center"
            py={16}
        >
            <VStack gap={4}>
                <Circle size="20" bg="gray.100" color={mutedTextColor}>
                    <Icon fontSize="2xl">
                        {React.createElement(icon)}
                    </Icon>
                </Circle>
                <VStack gap={2}>
                    <Text fontSize="xl" fontWeight="bold" color={textColor}>
                        {title}
                    </Text>
                    {description && (
                        <Text color={mutedTextColor} fontSize="sm" maxW="300px">
                            {description}
                        </Text>
                    )}
                    {action && (
                        <Button
                            onClick={action.onClick}
                            colorPalette={action.colorPalette || "green"}
                            mt={4}
                        >
                            {action.label}
                        </Button>
                    )}
                </VStack>
            </VStack>
        </Box>
    );
}
