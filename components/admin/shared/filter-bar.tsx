"use client"

import { HStack, Input, Select, Button, Icon, Portal, createListCollection } from '@chakra-ui/react';
import { FaSearch } from 'react-icons/fa';
import { useColorModeValue } from '@/components/ui/color-mode';

interface FilterBarProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    searchPlaceholder?: string;
    filters?: Array<{
        label: string;
        value: string;
        onChange: (value: string) => void;
        options: Array<{ label: string; value: string }>;
    }>;
    actions?: Array<{
        label: string;
        onClick: () => void;
        icon?: React.ComponentType;
        colorPalette?: string;
    }>;
}

export default function FilterBar({
    searchTerm,
    onSearchChange,
    searchPlaceholder = "Search...",
    filters = [],
    actions = []
}: FilterBarProps) {
    const cardBg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');

    return (
        <HStack
            gap={4}
            p={4}
            bg={cardBg}
            border="1px solid"
            borderColor={borderColor}
            borderRadius="xl"
            wrap="wrap"
        >
            {/* Search Input */}
            <HStack flex={1} minW="200px">
                <Icon color="gray.400">
                    <FaSearch />
                </Icon>
                <Input
                    placeholder={searchPlaceholder}
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    variant="outline"
                    size="sm"
                />
            </HStack>

            {/* Filters */}
            {filters.map((filter, index) => {
                const filterCollection = createListCollection({
                    items: filter.options.map(option => ({
                        label: option.label,
                        value: option.value
                    }))
                });

                return (
                    <Select.Root
                        key={index}
                        collection={filterCollection}
                        size="sm"
                        minW="150px"
                        onValueChange={(details) => filter.onChange(details.value[0])}
                    >
                        <Select.HiddenSelect />
                        <Select.Label>{filter.label}</Select.Label>
                        <Select.Control>
                            <Select.Trigger>
                                <Select.ValueText placeholder={filter.label} />
                            </Select.Trigger>
                            <Select.IndicatorGroup>
                                <Select.Indicator />
                            </Select.IndicatorGroup>
                        </Select.Control>
                        <Portal>
                            <Select.Positioner>
                                <Select.Content>
                                    {filterCollection.items.map((option) => (
                                        <Select.Item item={option} key={option.value}>
                                            {option.label}
                                            <Select.ItemIndicator />
                                        </Select.Item>
                                    ))}
                                </Select.Content>
                            </Select.Positioner>
                        </Portal>
                    </Select.Root>
                );
            })}

            {/* Actions */}
            {actions.map((action, index) => (
                <Button
                    key={index}
                    onClick={action.onClick}
                    colorPalette={action.colorPalette || "green"}
                    size="sm"
                >
                    {action.icon && <Icon as={action.icon} mr={2} />}
                    {action.label}
                </Button>
            ))}
        </HStack>
    );
}
