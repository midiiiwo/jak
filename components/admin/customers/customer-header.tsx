'use client'

import {
    Flex, VStack, Text, Button, HStack, Box, Input,
    InputGroup, Grid, Heading, Badge, NativeSelect
} from '@chakra-ui/react';
import { FaUserPlus, FaDownload, FaSync, FaSearch } from 'react-icons/fa';
import { useColorModeValue } from '@/components/ui/color-mode';
import type { CustomerFilters } from '@/types/customer';

interface CustomerHeaderProps {
    filters: CustomerFilters;
    onFiltersChange: (filters: Partial<CustomerFilters>) => void;
    onAddCustomer: () => void;
    onRefresh: () => void;
    totalCount: number;
    filteredCount: number;
}

export default function CustomerHeader({
    filters,
    onFiltersChange,
    onAddCustomer,
    onRefresh,
    totalCount,
    filteredCount
}: CustomerHeaderProps) {
    const textColor = useColorModeValue('gray.800', 'white');
    const mutedTextColor = useColorModeValue('gray.600', 'gray.400');
    const cardBg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const hoverBg = useColorModeValue('gray.50', 'gray.700');

    return (
        <VStack gap={6} align="stretch" w="full">
            {/* Header Section */}
            <Flex direction={{ base: "column", lg: "row" }} justify="space-between" align={{ base: "stretch", lg: "center" }} gap={4}>
                <VStack align="start" gap={2}>
                    <Text
                        fontSize={{ base: '2xl', md: '3xl' }}
                        fontWeight="bold"
                        color={textColor}
                        lineHeight="shorter"
                    >
                        👥 Customer Management
                    </Text>
                    <Text color={mutedTextColor} fontSize="lg">
                        Manage your customers and track their activities
                    </Text>
                    <Badge colorPalette="blue" variant="outline" px={3} py={1} rounded="full">
                        {totalCount} total customers
                    </Badge>
                </VStack>

                <HStack gap={3} flexWrap="wrap">
                    <Button
                        bg="linear-gradient(135deg, blue.500, blue.600)"
                        color="white"
                        size="lg"
                        onClick={onAddCustomer}
                        _hover={{
                            transform: 'translateY(-2px)',
                            shadow: 'lg',
                            bg: 'linear-gradient(135deg, blue.600, blue.700)'
                        }}
                        transition="all 0.2s"
                        rounded="xl"
                        px={6}
                        py={3}
                        fontWeight="semibold"
                    >
                        <FaUserPlus />
                        Add Customer
                    </Button>
                    <Button
                        variant="outline"
                        bg={cardBg}
                        _hover={{
                            transform: 'translateY(-2px)',
                            shadow: 'md',
                            bg: hoverBg
                        }}
                        transition="all 0.2s"
                        rounded="xl"
                        px={6}
                        py={3}
                    >
                        <FaDownload />
                        Export
                    </Button>
                    <Button
                        variant="outline"
                        onClick={onRefresh}
                        bg={cardBg}
                        _hover={{
                            transform: 'translateY(-2px)',
                            shadow: 'md',
                            bg: hoverBg
                        }}
                        transition="all 0.2s"
                        rounded="xl"
                        px={6}
                        py={3}
                    >
                        <FaSync />
                        Refresh
                    </Button>
                </HStack>
            </Flex>

            {/* Filter Section */}
            <Box>
                <Flex justify="space-between" align="center" w="full" mb={4}>
                    <Heading size="md" color={textColor}>
                        🔍 Filter & Search
                    </Heading>
                    <Badge colorPalette="blue" variant="subtle" px={3} py={1} rounded="full">
                        {filteredCount} customers found
                    </Badge>
                </Flex>
                <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={4} w="full">
                    <Box>
                        <Text fontSize="sm" fontWeight="medium" color={mutedTextColor} mb={2}>
                            Search Customers
                        </Text>
                        <InputGroup startElement={<FaSearch color="gray.400" />}>
                            <Input
                                placeholder="Search by name, email, or phone..."
                                value={filters.searchTerm}
                                onChange={(e) => onFiltersChange({ searchTerm: e.target.value })}
                                bg={cardBg}
                                border="1px solid"
                                borderColor={borderColor}
                                rounded="xl"
                                _focus={{
                                    borderColor: 'blue.400',
                                    shadow: '0 0 0 3px rgba(66, 153, 225, 0.1)'
                                }}
                            />
                        </InputGroup>
                    </Box>

                    <Box>
                        <Text fontSize="sm" fontWeight="medium" color={mutedTextColor} mb={2}>
                            Status
                        </Text>
                        <NativeSelect.Root>
                            <NativeSelect.Field
                                value={filters.filterStatus}
                                onChange={(e) => onFiltersChange({ filterStatus: e.target.value })}
                                bg={cardBg}
                                border="1px solid"
                                borderColor={borderColor}
                                rounded="xl"
                                _focus={{
                                    borderColor: 'blue.400',
                                    shadow: '0 0 0 3px rgba(66, 153, 225, 0.1)'
                                }}
                            >
                                <option value="">All Status</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </NativeSelect.Field>
                            <NativeSelect.Indicator />
                        </NativeSelect.Root>
                    </Box>

                    <Box>
                        <Text fontSize="sm" fontWeight="medium" color={mutedTextColor} mb={2}>
                            Customer Type
                        </Text>
                        <NativeSelect.Root>
                            <NativeSelect.Field
                                value={filters.filterCustomerType}
                                onChange={(e) => onFiltersChange({ filterCustomerType: e.target.value })}
                                bg={cardBg}
                                border="1px solid"
                                borderColor={borderColor}
                                rounded="xl"
                                _focus={{
                                    borderColor: 'blue.400',
                                    shadow: '0 0 0 3px rgba(66, 153, 225, 0.1)'
                                }}
                            >
                                <option value="">All Types</option>
                                <option value="regular">Regular</option>
                                <option value="premium">Premium</option>
                                <option value="vip">VIP</option>
                            </NativeSelect.Field>
                            <NativeSelect.Indicator />
                        </NativeSelect.Root>
                    </Box>
                </Grid>
            </Box>
        </VStack>
    );
}
