'use client'

import {
    Dialog, Portal, VStack, Field, Input, NativeSelect,
    Textarea, Button, HStack
} from '@chakra-ui/react';
import type { Customer, CustomerFormData } from '@/types/customer';

interface CustomerFormDialogProps {
    isOpen: boolean;
    onClose: () => void;
    customer: Customer | null;
    formData: CustomerFormData;
    onFormDataChange: (data: Partial<CustomerFormData>) => void;
    onSubmit: (e: React.FormEvent) => void;
    isLoading?: boolean;
}

export default function CustomerFormDialog({
    isOpen,
    onClose,
    customer,
    formData,
    onFormDataChange,
    onSubmit,
    isLoading = false
}: CustomerFormDialogProps) {
    return (
        <Dialog.Root open={isOpen} onOpenChange={(e) => !e.open && onClose()}>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content maxW="md">
                        <Dialog.Header>
                            <Dialog.Title>
                                {customer ? 'Edit Customer' : 'Add New Customer'}
                            </Dialog.Title>
                        </Dialog.Header>

                        <Dialog.Body>
                            <form onSubmit={onSubmit}>
                                <VStack gap={4}>
                                    <Field.Root>
                                        <Field.Label>Name *</Field.Label>
                                        <Input
                                            value={formData.name}
                                            onChange={(e) => onFormDataChange({ name: e.target.value })}
                                            placeholder="Customer name"
                                            required
                                        />
                                    </Field.Root>

                                    <Field.Root>
                                        <Field.Label>Email *</Field.Label>
                                        <Input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => onFormDataChange({ email: e.target.value })}
                                            placeholder="customer@email.com"
                                            required
                                        />
                                    </Field.Root>

                                    <Field.Root>
                                        <Field.Label>Phone *</Field.Label>
                                        <Input
                                            value={formData.phone}
                                            onChange={(e) => onFormDataChange({ phone: e.target.value })}
                                            placeholder="+233 XX XXX XXXX"
                                            required
                                        />
                                    </Field.Root>

                                    <Field.Root>
                                        <Field.Label>Address</Field.Label>
                                        <Input
                                            value={formData.address}
                                            onChange={(e) => onFormDataChange({ address: e.target.value })}
                                            placeholder="Customer address"
                                        />
                                    </Field.Root>

                                    <Field.Root>
                                        <Field.Label>Customer Type</Field.Label>
                                        <NativeSelect.Root>
                                            <NativeSelect.Field
                                                value={formData.customerType}
                                                onChange={(e) => onFormDataChange({ customerType: e.target.value as 'regular' | 'premium' | 'vip' })}
                                            >
                                                <option value="regular">Regular</option>
                                                <option value="premium">Premium</option>
                                                <option value="vip">VIP</option>
                                            </NativeSelect.Field>
                                            <NativeSelect.Indicator />
                                        </NativeSelect.Root>
                                    </Field.Root>

                                    <Field.Root>
                                        <Field.Label>Notes</Field.Label>
                                        <Textarea
                                            value={formData.notes}
                                            onChange={(e) => onFormDataChange({ notes: e.target.value })}
                                            placeholder="Additional notes about the customer..."
                                            rows={3}
                                        />
                                    </Field.Root>
                                </VStack>
                            </form>
                        </Dialog.Body>

                        <Dialog.Footer>
                            <HStack>
                                <Button variant="outline" onClick={onClose}>
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    onClick={onSubmit}
                                    loading={isLoading}
                                    colorPalette="blue"
                                >
                                    {customer ? 'Update Customer' : 'Add Customer'}
                                </Button>
                            </HStack>
                        </Dialog.Footer>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
}
