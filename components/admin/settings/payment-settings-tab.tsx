'use client'

import { VStack, Card, Heading, Field, HStack, Text, Switch, Input } from '@chakra-ui/react';
import { useColorModeValue } from '@/components/ui/color-mode';
import type { PaymentSettings } from '@/types/settings';

interface PaymentSettingsTabProps {
    settings: PaymentSettings;
    onChange: (settings: PaymentSettings) => void;
}

export default function PaymentSettingsTab({ settings, onChange }: PaymentSettingsTabProps) {
    const cardBg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const textColor = useColorModeValue('gray.800', 'white');
    const mutedTextColor = useColorModeValue('gray.600', 'gray.400');
    const cardShadow = useColorModeValue('lg', 'dark-lg');

    const updateSettings = (updates: Partial<PaymentSettings>) => {
        onChange({ ...settings, ...updates });
    };

    return (
        <VStack gap={6} align="stretch">
            <Card.Root bg={cardBg} rounded="2xl" shadow={cardShadow} border="1px solid" borderColor={borderColor}>
                <Card.Header p={6}>
                    <Heading size="md" color={textColor}>
                        💳 Payment Methods
                    </Heading>
                </Card.Header>
                <Card.Body px={6} pb={6}>
                    <VStack gap={4} align="stretch">
                        <Field.Root>
                            <HStack justify="space-between">
                                <VStack align="start" gap={0}>
                                    <Field.Label>Accept Cash Payments</Field.Label>
                                    <Text fontSize="sm" color={mutedTextColor}>
                                        Allow cash on delivery
                                    </Text>
                                </VStack>
                                <Switch.Root
                                    checked={settings.acceptCash}
                                    onCheckedChange={(e) => updateSettings({ acceptCash: e.checked })}
                                >
                                    <Switch.HiddenInput />
                                    <Switch.Control />
                                </Switch.Root>
                            </HStack>
                        </Field.Root>

                        <Field.Root>
                            <HStack justify="space-between">
                                <VStack align="start" gap={0}>
                                    <Field.Label>Accept Kowri Payments</Field.Label>
                                    <Text fontSize="sm" color={mutedTextColor}>
                                        Enable digital payments through Kowri
                                    </Text>
                                </VStack>
                                <Switch.Root
                                    checked={settings.acceptKowri}
                                    onCheckedChange={(e) => updateSettings({ acceptKowri: e.checked })}
                                >
                                    <Switch.HiddenInput />
                                    <Switch.Control />
                                </Switch.Root>
                            </HStack>
                        </Field.Root>
                    </VStack>
                </Card.Body>
            </Card.Root>

            {settings.acceptKowri && (
                <Card.Root bg={cardBg} rounded="2xl" shadow={cardShadow} border="1px solid" borderColor={borderColor}>
                    <Card.Header p={6}>
                        <Heading size="md" color={textColor}>
                            🔌 Kowri Configuration
                        </Heading>
                    </Card.Header>
                    <Card.Body px={6} pb={6}>
                        <VStack gap={4} align="stretch">
                            <Field.Root>
                                <Field.Label>Merchant ID</Field.Label>
                                <Input
                                    value={settings.kowriMerchantId}
                                    onChange={(e) => updateSettings({ kowriMerchantId: e.target.value })}
                                    placeholder="Your Kowri Merchant ID"
                                />
                            </Field.Root>

                            <Field.Root>
                                <Field.Label>API Key</Field.Label>
                                <Input
                                    type="password"
                                    value={settings.kowriApiKey}
                                    onChange={(e) => updateSettings({ kowriApiKey: e.target.value })}
                                    placeholder="Your Kowri API Key"
                                />
                            </Field.Root>

                            <Field.Root>
                                <HStack justify="space-between">
                                    <VStack align="start" gap={0}>
                                        <Field.Label>Test Mode</Field.Label>
                                        <Text fontSize="sm" color={mutedTextColor}>
                                            Enable test mode for development
                                        </Text>
                                    </VStack>
                                    <Switch.Root
                                        checked={settings.enableTestMode}
                                        onCheckedChange={(e) => updateSettings({ enableTestMode: e.checked })}
                                    >
                                        <Switch.HiddenInput />
                                        <Switch.Control />
                                    </Switch.Root>
                                </HStack>
                            </Field.Root>
                        </VStack>
                    </Card.Body>
                </Card.Root>
            )}
        </VStack>
    );
}
