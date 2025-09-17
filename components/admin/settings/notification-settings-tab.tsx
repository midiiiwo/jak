'use client'

import { VStack, Card, Heading, Field, HStack, Text, Switch } from '@chakra-ui/react';
import { useColorModeValue } from '@/components/ui/color-mode';
import type { NotificationSettings } from '@/types/settings';

interface NotificationSettingsTabProps {
    settings: NotificationSettings;
    onChange: (settings: NotificationSettings) => void;
}

export default function NotificationSettingsTab({ settings, onChange }: NotificationSettingsTabProps) {
    const cardBg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const textColor = useColorModeValue('gray.800', 'white');
    const mutedTextColor = useColorModeValue('gray.600', 'gray.400');
    const cardShadow = useColorModeValue('lg', 'dark-lg');

    const updateSettings = (updates: Partial<NotificationSettings>) => {
        onChange({ ...settings, ...updates });
    };

    return (
        <VStack gap={6} align="stretch">
            <Card.Root bg={cardBg} rounded="2xl" shadow={cardShadow} border="1px solid" borderColor={borderColor}>
                <Card.Header p={6}>
                    <Heading size="md" color={textColor}>
                        🔔 Alert Preferences
                    </Heading>
                </Card.Header>
                <Card.Body px={6} pb={6}>
                    <VStack gap={4} align="stretch">
                        <Field.Root>
                            <HStack justify="space-between">
                                <VStack align="start" gap={0}>
                                    <Field.Label>Low Stock Alerts</Field.Label>
                                    <Text fontSize="sm" color={mutedTextColor}>
                                        Get notified when items are running low
                                    </Text>
                                </VStack>
                                <Switch.Root
                                    checked={settings.lowStockAlerts}
                                    onCheckedChange={(e) => updateSettings({ lowStockAlerts: e.checked })}
                                >
                                    <Switch.HiddenInput />
                                    <Switch.Control />
                                </Switch.Root>
                            </HStack>
                        </Field.Root>

                        <Field.Root>
                            <HStack justify="space-between">
                                <VStack align="start" gap={0}>
                                    <Field.Label>Order Alerts</Field.Label>
                                    <Text fontSize="sm" color={mutedTextColor}>
                                        Get notified about new orders
                                    </Text>
                                </VStack>
                                <Switch.Root
                                    checked={settings.orderAlerts}
                                    onCheckedChange={(e) => updateSettings({ orderAlerts: e.checked })}
                                >
                                    <Switch.HiddenInput />
                                    <Switch.Control />
                                </Switch.Root>
                            </HStack>
                        </Field.Root>

                        <Field.Root>
                            <HStack justify="space-between">
                                <VStack align="start" gap={0}>
                                    <Field.Label>Customer Alerts</Field.Label>
                                    <Text fontSize="sm" color={mutedTextColor}>
                                        Get notified about customer activities
                                    </Text>
                                </VStack>
                                <Switch.Root
                                    checked={settings.customerAlerts}
                                    onCheckedChange={(e) => updateSettings({ customerAlerts: e.checked })}
                                >
                                    <Switch.HiddenInput />
                                    <Switch.Control />
                                </Switch.Root>
                            </HStack>
                        </Field.Root>

                        <Field.Root>
                            <HStack justify="space-between">
                                <VStack align="start" gap={0}>
                                    <Field.Label>System Alerts</Field.Label>
                                    <Text fontSize="sm" color={mutedTextColor}>
                                        Get notified about system updates
                                    </Text>
                                </VStack>
                                <Switch.Root
                                    checked={settings.systemAlerts}
                                    onCheckedChange={(e) => updateSettings({ systemAlerts: e.checked })}
                                >
                                    <Switch.HiddenInput />
                                    <Switch.Control />
                                </Switch.Root>
                            </HStack>
                        </Field.Root>
                    </VStack>
                </Card.Body>
            </Card.Root>

            <Card.Root bg={cardBg} rounded="2xl" shadow={cardShadow} border="1px solid" borderColor={borderColor}>
                <Card.Header p={6}>
                    <Heading size="md" color={textColor}>
                        📧 Delivery Methods
                    </Heading>
                </Card.Header>
                <Card.Body px={6} pb={6}>
                    <VStack gap={4} align="stretch">
                        <Field.Root>
                            <HStack justify="space-between">
                                <VStack align="start" gap={0}>
                                    <Field.Label>Email Notifications</Field.Label>
                                    <Text fontSize="sm" color={mutedTextColor}>
                                        Receive notifications via email
                                    </Text>
                                </VStack>
                                <Switch.Root
                                    checked={settings.emailNotifications}
                                    onCheckedChange={(e) => updateSettings({ emailNotifications: e.checked })}
                                >
                                    <Switch.HiddenInput />
                                    <Switch.Control />
                                </Switch.Root>
                            </HStack>
                        </Field.Root>

                        <Field.Root>
                            <HStack justify="space-between">
                                <VStack align="start" gap={0}>
                                    <Field.Label>SMS Notifications</Field.Label>
                                    <Text fontSize="sm" color={mutedTextColor}>
                                        Receive notifications via SMS
                                    </Text>
                                </VStack>
                                <Switch.Root
                                    checked={settings.smsNotifications}
                                    onCheckedChange={(e) => updateSettings({ smsNotifications: e.checked })}
                                >
                                    <Switch.HiddenInput />
                                    <Switch.Control />
                                </Switch.Root>
                            </HStack>
                        </Field.Root>

                        <Field.Root>
                            <HStack justify="space-between">
                                <VStack align="start" gap={0}>
                                    <Field.Label>Push Notifications</Field.Label>
                                    <Text fontSize="sm" color={mutedTextColor}>
                                        Receive browser push notifications
                                    </Text>
                                </VStack>
                                <Switch.Root
                                    checked={settings.pushNotifications}
                                    onCheckedChange={(e) => updateSettings({ pushNotifications: e.checked })}
                                >
                                    <Switch.HiddenInput />
                                    <Switch.Control />
                                </Switch.Root>
                            </HStack>
                        </Field.Root>
                    </VStack>
                </Card.Body>
            </Card.Root>
        </VStack>
    );
}
