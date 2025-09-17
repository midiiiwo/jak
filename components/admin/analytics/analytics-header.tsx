'use client'

import { Flex, VStack, Text, Select, Portal, createListCollection } from '@chakra-ui/react';
import { useColorModeValue } from '@/components/ui/color-mode';
import type { TimeFrame } from '@/types/analytics';

const timeFrames = createListCollection({
    items: [
        { label: "Last 7 Days", value: "7d" },
        { label: "Last 30 Days", value: "30d" },
        { label: "Last 3 Months", value: "3m" },
        { label: "Last Year", value: "1y" },
    ],
});

interface AnalyticsHeaderProps {
    timeFrame: TimeFrame;
    onTimeFrameChange: (timeFrame: TimeFrame) => void;
}

export default function AnalyticsHeader({ timeFrame, onTimeFrameChange }: AnalyticsHeaderProps) {
    const textColor = useColorModeValue('gray.800', 'white');
    const mutedTextColor = useColorModeValue('gray.600', 'gray.400');

    return (
        <Flex justify="space-between" align="center" mb={8}>
            <VStack align="start" gap={1}>
                <Text fontSize="3xl" fontWeight="bold" color={textColor}>
                    Analytics Dashboard
                </Text>
                <Text color={mutedTextColor}>
                    Track your business performance and growth
                </Text>
            </VStack>

            <Select.Root
                collection={timeFrames}
                value={[timeFrame]}
                onValueChange={(e) => onTimeFrameChange(e.value[0] as TimeFrame)}
                size="md"
                width="200px"
            >
                <Select.HiddenSelect />
                <Select.Control>
                    <Select.Trigger>
                        <Select.ValueText placeholder="Select timeframe" />
                    </Select.Trigger>
                    <Select.IndicatorGroup>
                        <Select.Indicator />
                    </Select.IndicatorGroup>
                </Select.Control>
                <Portal>
                    <Select.Positioner>
                        <Select.Content>
                            {timeFrames.items.map((frame) => (
                                <Select.Item item={frame} key={frame.value}>
                                    {frame.label}
                                    <Select.ItemIndicator />
                                </Select.Item>
                            ))}
                        </Select.Content>
                    </Select.Positioner>
                </Portal>
            </Select.Root>
        </Flex>
    );
}
