'use client'

import { useState } from 'react';
import {
    Dialog,
    VStack,
    HStack,
    Text,
    Button,
    CloseButton,
    Select,
    Portal,
    NumberInput,
    createListCollection,
    Field,
    Input
} from '@chakra-ui/react';
import { useColorModeValue } from '@/components/ui/color-mode';
import { Product } from '@/types/admin';

const stockTypeOptions = createListCollection({
    items: [
        { label: "Stock In (Add)", value: "in" },
        { label: "Stock Out (Remove)", value: "out" },
        { label: "Adjustment (Set Exact)", value: "adjustment" },
    ],
});

interface StockManagementDialogProps {
    isOpen: boolean;
    onClose: () => void;
    product: Product | null;
    onUpdateStock: (productId: string, type: string, quantity: number, reason: string) => void;
}

export default function StockManagementDialog({
    isOpen,
    onClose,
    product,
    onUpdateStock
}: StockManagementDialogProps) {
    const [stockType, setStockType] = useState('in');
    const [quantity, setQuantity] = useState(0);
    const [reason, setReason] = useState('');

    const cardBg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');

    const handleSubmit = () => {
        if (product && quantity > 0) {
            onUpdateStock(product.id, stockType, quantity, reason);
            onClose();
            setQuantity(0);
            setReason('');
        }
    };

    if (!product) return null;

    return (
        <Dialog.Root open={isOpen} onOpenChange={({ open }) => !open && onClose()}>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content bg={cardBg} borderColor={borderColor} maxW="md">
                        <Dialog.Header>
                            <Dialog.Title>Stock Management - {product.title}</Dialog.Title>
                            <Dialog.CloseTrigger asChild>
                                <CloseButton size="sm" />
                            </Dialog.CloseTrigger>
                        </Dialog.Header>

                        <Dialog.Body>
                            <VStack gap={4} align="stretch">
                                <Text fontSize="sm" color="gray.600">
                                    Current Stock: {product.stock} {product.unit}
                                </Text>

                                <Field.Root>
                                    <Field.Label>Stock Action</Field.Label>
                                    <Select.Root
                                        collection={stockTypeOptions}
                                        value={[stockType]}
                                        onValueChange={(e) => setStockType(e.value[0])}
                                    >
                                        <Select.HiddenSelect />
                                        <Select.Control>
                                            <Select.Trigger>
                                                <Select.ValueText placeholder="Select action" />
                                            </Select.Trigger>
                                            <Select.IndicatorGroup>
                                                <Select.Indicator />
                                            </Select.IndicatorGroup>
                                        </Select.Control>
                                        <Portal>
                                            <Select.Positioner>
                                                <Select.Content>
                                                    {stockTypeOptions.items.map((option) => (
                                                        <Select.Item item={option} key={option.value}>
                                                            {option.label}
                                                            <Select.ItemIndicator />
                                                        </Select.Item>
                                                    ))}
                                                </Select.Content>
                                            </Select.Positioner>
                                        </Portal>
                                    </Select.Root>
                                </Field.Root>

                                <Field.Root>
                                    <Field.Label>Quantity ({product.unit})</Field.Label>
                                    <NumberInput.Root
                                        value={quantity.toString()}
                                        onValueChange={(e) => setQuantity(Number(e.value))}
                                        min={1}
                                    >
                                        <NumberInput.Control />
                                        <NumberInput.Input />
                                    </NumberInput.Root>
                                </Field.Root>

                                <Field.Root>
                                    <Field.Label>Reason (Optional)</Field.Label>
                                    <Input
                                        placeholder="Enter reason for stock change..."
                                        value={reason}
                                        onChange={(e) => setReason(e.target.value)}
                                    />
                                </Field.Root>
                            </VStack>
                        </Dialog.Body>

                        <Dialog.Footer>
                            <HStack gap={3}>
                                <Button variant="outline" onClick={onClose}>
                                    Cancel
                                </Button>
                                <Button
                                    colorPalette="green"
                                    onClick={handleSubmit}
                                    disabled={quantity <= 0}
                                >
                                    Update Stock
                                </Button>
                            </HStack>
                        </Dialog.Footer>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
}
