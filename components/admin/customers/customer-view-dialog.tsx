'use client'

import {
    Dialog, Portal, Grid, VStack, Text, HStack, Badge, Button
} from '@chakra-ui/react';
import { FaUsers, FaStar, FaCrown } from 'react-icons/fa';
import { useColorModeValue } from '@/components/ui/color-mode';
import type { Customer } from '@/types/customer';

interface CustomerViewDialogProps {
    isOpen: boolean;
    onClose: () => void;
    customer: Customer | null;
}

export default function CustomerViewDialog({
    isOpen,
    onClose,
    customer
}: CustomerViewDialogProps) {
    const textColor = useColorModeValue('gray.800', 'white');
    const mutedTextColor = useColorModeValue('gray.600', 'gray.400');

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

    if (!customer) return null;

    return (
        <Dialog.Root open={isOpen} onOpenChange={(e) => !e.open && onClose()}>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content maxW="2xl">
                        <Dialog.Header>
                            <Dialog.Title>Customer Details</Dialog.Title>
                        </Dialog.Header>

                        <Dialog.Body>
                            <VStack gap={6} align="stretch">
                                <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                                    <VStack align="start" gap={2}>
                                        <Text fontSize="sm" fontWeight="medium" color={mutedTextColor}>
                                            Name
                                        </Text>
                                        <Text fontWeight="medium" color={textColor}>
                                            {customer.name}
                                        </Text>
                                    </VStack>

                                    <VStack align="start" gap={2}>
                                        <Text fontSize="sm" fontWeight="medium" color={mutedTextColor}>
                                            Customer Type
                                        </Text>
                                        <HStack>
                                            {getTypeIcon(customer.customerType)}
                                            <Badge
                                                colorPalette={getTypeColor(customer.customerType)}
                                                variant="subtle"
                                            >
                                                {customer.customerType.toUpperCase()}
                                            </Badge>
                                        </HStack>
                                    </VStack>

                                    <VStack align="start" gap={2}>
                                        <Text fontSize="sm" fontWeight="medium" color={mutedTextColor}>
                                            Email
                                        </Text>
                                        <Text color={textColor}>{customer.email}</Text>
                                    </VStack>

                                    <VStack align="start" gap={2}>
                                        <Text fontSize="sm" fontWeight="medium" color={mutedTextColor}>
                                            Phone
                                        </Text>
                                        <Text color={textColor}>{customer.phone}</Text>
                                    </VStack>

                                    <VStack align="start" gap={2}>
                                        <Text fontSize="sm" fontWeight="medium" color={mutedTextColor}>
                                            Total Orders
                                        </Text>
                                        <Text fontWeight="medium" color={textColor}>
                                            {customer.totalOrders}
                                        </Text>
                                    </VStack>

                                    <VStack align="start" gap={2}>
                                        <Text fontSize="sm" fontWeight="medium" color={mutedTextColor}>
                                            Total Spent
                                        </Text>
                                        <Text fontWeight="medium" color="green.500">
                                            GHC {customer.totalSpent.toLocaleString()}
                                        </Text>
                                    </VStack>
                                </Grid>

                                <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                                    <VStack align="start" gap={2}>
                                        <Text fontSize="sm" fontWeight="medium" color={mutedTextColor}>
                                            Registration Date
                                        </Text>
                                        <Text color={textColor}>
                                            {new Date(customer.registrationDate).toLocaleDateString()}
                                        </Text>
                                    </VStack>

                                    <VStack align="start" gap={2}>
                                        <Text fontSize="sm" fontWeight="medium" color={mutedTextColor}>
                                            Last Order
                                        </Text>
                                        <Text color={textColor}>
                                            {customer.lastOrderDate
                                                ? new Date(customer.lastOrderDate).toLocaleDateString()
                                                : 'Never'
                                            }
                                        </Text>
                                    </VStack>
                                </Grid>

                                <VStack align="start" gap={2}>
                                    <Text fontSize="sm" fontWeight="medium" color={mutedTextColor}>
                                        Address
                                    </Text>
                                    <Text color={textColor}>{customer.address || 'No address provided'}</Text>
                                </VStack>

                                {customer.notes && (
                                    <VStack align="start" gap={2}>
                                        <Text fontSize="sm" fontWeight="medium" color={mutedTextColor}>
                                            Notes
                                        </Text>
                                        <Text color={textColor}>{customer.notes}</Text>
                                    </VStack>
                                )}
                            </VStack>
                        </Dialog.Body>

                        <Dialog.Footer>
                            <Button onClick={onClose}>Close</Button>
                        </Dialog.Footer>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
}
