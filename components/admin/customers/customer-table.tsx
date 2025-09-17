'use client'

import {
    Card, Box, Table, VStack, Text, HStack, Badge, Button
} from '@chakra-ui/react';
import {
    FaEnvelope, FaPhone, FaEye, FaEdit, FaTrash,
    FaUsers, FaStar, FaCrown
} from 'react-icons/fa';
import { useColorModeValue } from '@/components/ui/color-mode';
import type { Customer } from '@/types/customer';

interface CustomerTableProps {
    customers: Customer[];
    onView: (customer: Customer) => void;
    onEdit: (customer: Customer) => void;
    onDelete: (customerId: string) => void;
}

export default function CustomerTable({
    customers,
    onView,
    onEdit,
    onDelete
}: CustomerTableProps) {
    const cardBg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const textColor = useColorModeValue('gray.800', 'white');
    const mutedTextColor = useColorModeValue('gray.600', 'gray.400');
    const hoverBg = useColorModeValue('gray.50', 'gray.700');

    const getStatusColor = (status: string) => {
        return status === 'active' ? 'green' : 'red';
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'vip': return 'purple';
            case 'premium': return 'orange';
            case 'regular': return 'blue';
            default: return 'gray';
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'vip': return <FaCrown />;
            case 'premium': return <FaStar />;
            case 'regular': return <FaUsers />;
            default: return <FaUsers />;
        }
    };

    return (
        <Card.Root
            bg={cardBg}
            rounded="2xl"
            border="1px solid"
            borderColor={borderColor}
        >
            <Card.Body p={0}>
                <Box overflowX="auto">
                    <Table.Root size="md">
                        <Table.Header>
                            <Table.Row>
                                <Table.ColumnHeader>Customer</Table.ColumnHeader>
                                <Table.ColumnHeader>Contact</Table.ColumnHeader>
                                <Table.ColumnHeader>Type</Table.ColumnHeader>
                                <Table.ColumnHeader>Orders</Table.ColumnHeader>
                                <Table.ColumnHeader>Total Spent</Table.ColumnHeader>
                                <Table.ColumnHeader>Last Order</Table.ColumnHeader>
                                <Table.ColumnHeader>Status</Table.ColumnHeader>
                                <Table.ColumnHeader>Actions</Table.ColumnHeader>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {customers.map((customer) => (
                                <Table.Row key={customer.id}>
                                    <Table.Cell>
                                        <VStack align="start" gap={1}>
                                            <Text fontWeight="medium" color={textColor}>
                                                {customer.name}
                                            </Text>
                                            <Text fontSize="sm" color={mutedTextColor}>
                                                ID: {customer.id}
                                            </Text>
                                        </VStack>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <VStack align="start" gap={1}>
                                            <HStack>
                                                <FaEnvelope color="gray.400" size={12} />
                                                <Text fontSize="sm">{customer.email}</Text>
                                            </HStack>
                                            <HStack>
                                                <FaPhone color="gray.400" size={12} />
                                                <Text fontSize="sm">{customer.phone}</Text>
                                            </HStack>
                                        </VStack>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <HStack>
                                            {getTypeIcon(customer.customerType)}
                                            <Badge
                                                colorPalette={getTypeColor(customer.customerType)}
                                                variant="subtle"
                                            >
                                                {customer.customerType.toUpperCase()}
                                            </Badge>
                                        </HStack>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Text fontWeight="bold" color={textColor}>
                                            {customer.totalOrders}
                                        </Text>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Text fontWeight="medium" color="green.500">
                                            GHC {customer.totalSpent.toLocaleString()}
                                        </Text>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Text fontSize="sm" color={mutedTextColor}>
                                            {customer.lastOrderDate
                                                ? new Date(customer.lastOrderDate).toLocaleDateString()
                                                : 'Never'
                                            }
                                        </Text>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Badge
                                            colorPalette={getStatusColor(customer.status)}
                                            variant="subtle"
                                        >
                                            {customer.status.toUpperCase()}
                                        </Badge>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <HStack gap={2}>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => onView(customer)}
                                                _hover={{ bg: hoverBg }}
                                            >
                                                <FaEye />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => onEdit(customer)}
                                                _hover={{ bg: hoverBg }}
                                            >
                                                <FaEdit />
                                            </Button>
                                            <Button
                                                size="sm"
                                                colorPalette="red"
                                                variant="outline"
                                                onClick={() => onDelete(customer.id)}
                                                _hover={{ bg: 'red.50' }}
                                            >
                                                <FaTrash />
                                            </Button>
                                        </HStack>
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table.Root>
                </Box>
            </Card.Body>
        </Card.Root>
    );
}
