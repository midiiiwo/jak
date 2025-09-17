'use client'

import { VStack, Card, Heading, Grid, Field, Input, NativeSelect, Textarea } from '@chakra-ui/react';
import { useColorModeValue } from '@/components/ui/color-mode';
import type { SystemSettings } from '@/types/settings';

interface SystemSettingsTabProps {
    settings: SystemSettings;
    onChange: (settings: SystemSettings) => void;
}

export default function SystemSettingsTab({ settings, onChange }: SystemSettingsTabProps) {
    const cardBg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const textColor = useColorModeValue('gray.800', 'white');
    const cardShadow = useColorModeValue('lg', 'dark-lg');

    const updateSettings = (updates: Partial<SystemSettings>) => {
        onChange({ ...settings, ...updates });
    };

    return (
        <VStack gap={6} align="stretch">
            <Card.Root bg={cardBg} rounded="2xl" shadow={cardShadow} border="1px solid" borderColor={borderColor}>
                <Card.Header p={6}>
                    <Heading size="md" color={textColor}>
                        🏪 Business Information
                    </Heading>
                </Card.Header>
                <Card.Body px={6} pb={6}>
                    <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
                        <Field.Root>
                            <Field.Label>Business Name</Field.Label>
                            <Input
                                value={settings.businessName}
                                onChange={(e) => updateSettings({ businessName: e.target.value })}
                                placeholder="Your business name"
                            />
                        </Field.Root>

                        <Field.Root>
                            <Field.Label>Business Email</Field.Label>
                            <Input
                                type="email"
                                value={settings.businessEmail}
                                onChange={(e) => updateSettings({ businessEmail: e.target.value })}
                                placeholder="business@email.com"
                            />
                        </Field.Root>

                        <Field.Root>
                            <Field.Label>Business Phone</Field.Label>
                            <Input
                                value={settings.businessPhone}
                                onChange={(e) => updateSettings({ businessPhone: e.target.value })}
                                placeholder="+233 XX XXX XXXX"
                            />
                        </Field.Root>

                        <Field.Root>
                            <Field.Label>Currency</Field.Label>
                            <NativeSelect.Root>
                                <NativeSelect.Field
                                    value={settings.currency}
                                    onChange={(e) => updateSettings({ currency: e.target.value })}
                                >
                                    <option value="GHC">GHC - Ghana Cedi</option>
                                    <option value="USD">USD - US Dollar</option>
                                    <option value="EUR">EUR - Euro</option>
                                </NativeSelect.Field>
                                <NativeSelect.Indicator />
                            </NativeSelect.Root>
                        </Field.Root>

                        <Field.Root>
                            <Field.Label>Timezone</Field.Label>
                            <NativeSelect.Root>
                                <NativeSelect.Field
                                    value={settings.timezone}
                                    onChange={(e) => updateSettings({ timezone: e.target.value })}
                                >
                                    <option value="Africa/Accra">Africa/Accra</option>
                                    <option value="UTC">UTC</option>
                                    <option value="America/New_York">America/New_York</option>
                                </NativeSelect.Field>
                                <NativeSelect.Indicator />
                            </NativeSelect.Root>
                        </Field.Root>

                        <Field.Root>
                            <Field.Label>Tax Rate (%)</Field.Label>
                            <Input
                                type="number"
                                step="0.01"
                                value={settings.taxRate}
                                onChange={(e) => updateSettings({ taxRate: parseFloat(e.target.value) || 0 })}
                                placeholder="12.5"
                            />
                        </Field.Root>
                    </Grid>

                    <Field.Root mt={4}>
                        <Field.Label>Business Address</Field.Label>
                        <Textarea
                            value={settings.businessAddress}
                            onChange={(e) => updateSettings({ businessAddress: e.target.value })}
                            placeholder="Business address"
                            rows={3}
                        />
                    </Field.Root>
                </Card.Body>
            </Card.Root>

            <Card.Root bg={cardBg} rounded="2xl" shadow={cardShadow} border="1px solid" borderColor={borderColor}>
                <Card.Header p={6}>
                    <Heading size="md" color={textColor}>
                        📊 Business Rules
                    </Heading>
                </Card.Header>
                <Card.Body px={6} pb={6}>
                    <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
                        <Field.Root>
                            <Field.Label>Low Stock Threshold</Field.Label>
                            <Input
                                type="number"
                                value={settings.lowStockThreshold}
                                onChange={(e) => updateSettings({ lowStockThreshold: parseInt(e.target.value) || 0 })}
                                placeholder="10"
                            />
                        </Field.Root>

                        <Field.Root>
                            <Field.Label>Delivery Radius (km)</Field.Label>
                            <Input
                                type="number"
                                value={settings.deliveryRadius}
                                onChange={(e) => updateSettings({ deliveryRadius: parseInt(e.target.value) || 0 })}
                                placeholder="25"
                            />
                        </Field.Root>

                        <Field.Root>
                            <Field.Label>Minimum Order Amount</Field.Label>
                            <Input
                                type="number"
                                value={settings.minOrderAmount}
                                onChange={(e) => updateSettings({ minOrderAmount: parseInt(e.target.value) || 0 })}
                                placeholder="50"
                            />
                        </Field.Root>

                        <Field.Root>
                            <Field.Label>Maximum Order Amount</Field.Label>
                            <Input
                                type="number"
                                value={settings.maxOrderAmount}
                                onChange={(e) => updateSettings({ maxOrderAmount: parseInt(e.target.value) || 0 })}
                                placeholder="5000"
                            />
                        </Field.Root>
                    </Grid>
                </Card.Body>
            </Card.Root>
        </VStack>
    );
}
