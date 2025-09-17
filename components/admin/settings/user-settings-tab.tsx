'use client'

import { VStack, Card, Heading, Field, HStack, Text, Switch, Grid, Input } from '@chakra-ui/react';
import { NativeSelect } from '@chakra-ui/react';
import { useColorModeValue } from '@/components/ui/color-mode';
import type { UserSettings } from '@/types/settings';

interface UserSettingsTabProps {
    settings: UserSettings;
    onChange: (settings: UserSettings) => void;
}

export default function UserSettingsTab({ settings, onChange }: UserSettingsTabProps) {
    const cardBg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const textColor = useColorModeValue('gray.800', 'white');
    const mutedTextColor = useColorModeValue('gray.600', 'gray.400');
    const cardShadow = useColorModeValue('lg', 'dark-lg');

    const updateSettings = (updates: Partial<UserSettings>) => {
        onChange({ ...settings, ...updates });
    };

    return (
        <VStack gap={6} align="stretch">
            <Card.Root bg={cardBg} rounded="2xl" shadow={cardShadow} border="1px solid" borderColor={borderColor}>
                <Card.Header p={6}>
                    <Heading size="md" color={textColor}>
                        🎨 Interface Preferences
                    </Heading>
                </Card.Header>
                <Card.Body px={6} pb={6}>
                    <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
                        <Field.Root>
                            <Field.Label>Theme</Field.Label>
                            <NativeSelect.Root>
                                <NativeSelect.Field
                                    value={settings.theme}
                                    onChange={(e) => updateSettings({ theme: e.target.value as 'light' | 'dark' | 'system' })}
                                >
                                    <option value="light">Light</option>
                                    <option value="dark">Dark</option>
                                    <option value="system">System</option>
                                </NativeSelect.Field>
                                <NativeSelect.Indicator />
                            </NativeSelect.Root>
                        </Field.Root>

                        <Field.Root>
                            <Field.Label>Date Format</Field.Label>
                            <NativeSelect.Root>
                                <NativeSelect.Field
                                    value={settings.dateFormat}
                                    onChange={(e) => updateSettings({ dateFormat: e.target.value })}
                                >
                                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                                </NativeSelect.Field>
                                <NativeSelect.Indicator />
                            </NativeSelect.Root>
                        </Field.Root>

                        <Field.Root>
                            <Field.Label>Time Format</Field.Label>
                            <NativeSelect.Root>
                                <NativeSelect.Field
                                    value={settings.timeFormat}
                                    onChange={(e) => updateSettings({ timeFormat: e.target.value })}
                                >
                                    <option value="24h">24 Hour</option>
                                    <option value="12h">12 Hour</option>
                                </NativeSelect.Field>
                                <NativeSelect.Indicator />
                            </NativeSelect.Root>
                        </Field.Root>

                        <Field.Root>
                            <Field.Label>Dashboard Refresh (seconds)</Field.Label>
                            <Input
                                type="number"
                                value={settings.dashboardRefreshInterval}
                                onChange={(e) => updateSettings({ dashboardRefreshInterval: parseInt(e.target.value) || 0 })}
                                placeholder="30"
                            />
                        </Field.Root>
                    </Grid>

                    <VStack gap={4} align="stretch" mt={6}>
                        <Field.Root>
                            <HStack justify="space-between">
                                <VStack align="start" gap={0}>
                                    <Field.Label>Enable Sounds</Field.Label>
                                    <Text fontSize="sm" color={mutedTextColor}>
                                        Play notification sounds
                                    </Text>
                                </VStack>
                                <Switch.Root
                                    checked={settings.enableSounds}
                                    onCheckedChange={(e) => updateSettings({ enableSounds: e.checked })}
                                >
                                    <Switch.HiddenInput />
                                    <Switch.Control />
                                </Switch.Root>
                            </HStack>
                        </Field.Root>

                        <Field.Root>
                            <HStack justify="space-between">
                                <VStack align="start" gap={0}>
                                    <Field.Label>Compact Mode</Field.Label>
                                    <Text fontSize="sm" color={mutedTextColor}>
                                        Use smaller spacing for interface elements
                                    </Text>
                                </VStack>
                                <Switch.Root
                                    checked={settings.compactMode}
                                    onCheckedChange={(e) => updateSettings({ compactMode: e.checked })}
                                >
                                    <Switch.HiddenInput />
                                    <Switch.Control />
                                </Switch.Root>
                            </HStack>
                        </Field.Root>

                        <Field.Root>
                            <HStack justify="space-between">
                                <VStack align="start" gap={0}>
                                    <Field.Label>Auto Save</Field.Label>
                                    <Text fontSize="sm" color={mutedTextColor}>
                                        Automatically save changes
                                    </Text>
                                </VStack>
                                <Switch.Root
                                    checked={settings.autoSave}
                                    onCheckedChange={(e) => updateSettings({ autoSave: e.checked })}
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
