'use client';

import React, { useState, useEffect } from 'react';
import {
    Box,
    Card,
    Text,
    Button,
    Input,
    VStack,
    HStack,
    Flex,
    Field,
    NativeSelect,
    Textarea,
    Container,
    Grid,
    Skeleton,
    Heading,
    Tabs,
    Switch
} from '@chakra-ui/react';
import { useColorModeValue } from '@/components/ui/color-mode';
import { RiResetRightLine } from "react-icons/ri";
import {
    FaCog,
    FaUser,
    FaCreditCard,
    FaBell,
    FaSave,
    FaDownload,
    FaUpload,
    FaEnvelope,
    FaSms,
    FaSync,
} from 'react-icons/fa';
import { PiTestTubeLight } from "react-icons/pi";

interface SystemSettings {
    businessName: string;
    businessEmail: string;
    businessPhone: string;
    businessAddress: string;
    currency: string;
    timezone: string;
    language: string;
    taxRate: number;
    lowStockThreshold: number;
    enableNotifications: boolean;
    enableEmailAlerts: boolean;
    enableSMSAlerts: boolean;
    deliveryRadius: number;
    minOrderAmount: number;
    maxOrderAmount: number;
}

interface UserSettings {
    theme: 'light' | 'dark' | 'system';
    dateFormat: string;
    timeFormat: string;
    enableSounds: boolean;
    dashboardRefreshInterval: number;
}

interface PaymentSettings {
    acceptCash: boolean;
    acceptKowri: boolean;
    kowriMerchantId: string;
    kowriApiKey: string;
    enableTestMode: boolean;
}

interface NotificationSettings {
    lowStockAlerts: boolean;
    orderAlerts: boolean;
    customerAlerts: boolean;
    systemAlerts: boolean;
    emailNotifications: boolean;
    smsNotifications: boolean;
    pushNotifications: boolean;
}

export default function SettingsManagement() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('system');

    const [systemSettings, setSystemSettings] = useState<SystemSettings>({
        businessName: '',
        businessEmail: '',
        businessPhone: '',
        businessAddress: '',
        currency: 'GHC',
        timezone: 'Africa/Accra',
        language: 'English',
        taxRate: 0,
        lowStockThreshold: 10,
        enableNotifications: true,
        enableEmailAlerts: true,
        enableSMSAlerts: false,
        deliveryRadius: 25,
        minOrderAmount: 50,
        maxOrderAmount: 10000
    });

    const [userSettings, setUserSettings] = useState<UserSettings>({
        theme: 'system',
        dateFormat: 'DD/MM/YYYY',
        timeFormat: '24h',
        enableSounds: true,
        dashboardRefreshInterval: 30
    });

    const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>({
        acceptCash: true,
        acceptKowri: true,
        kowriMerchantId: '',
        kowriApiKey: '',
        enableTestMode: true
    });

    const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
        lowStockAlerts: true,
        orderAlerts: true,
        customerAlerts: false,
        systemAlerts: true,
        emailNotifications: true,
        smsNotifications: false,
        pushNotifications: true
    });

    // Color mode values
    const cardBg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.600');
    const textColor = useColorModeValue('gray.900', 'white');
    const mutedTextColor = useColorModeValue('gray.600', 'gray.400');
    const gradientBg = useColorModeValue('white', 'gray.900');
    const cardShadow = useColorModeValue(
        '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)'
    );

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/admin/settings');
            if (response.ok) {
                const data = await response.json();
                setSystemSettings(data.system);
                setUserSettings(data.user);
                setPaymentSettings(data.payment);
                setNotificationSettings(data.notifications);
            }
        } catch (error) {
            console.error('Error fetching settings:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const saveSettings = async <T extends object>(section: string, settings: T) => {
        try {
            setSaving(true);
            const response = await fetch(`/api/admin/settings?section=${section}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings)
            });

            if (response.ok) {
                // Show success message
                console.log(`${section} settings saved successfully`);
            }
        } catch (error) {
            console.error('Error saving settings:', error);
        } finally {
            setSaving(false);
        }
    };

    const testConnection = async (type: string) => {
        try {
            const response = await fetch('/api/admin/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: `test_${type}_connection` })
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data.message);
            }
        } catch (error) {
            console.error(`Error testing ${type} connection:`, error);
        }
    };

    if (loading) {
        return (
            <Container maxW="full" p={0}>
                <Box bg={gradientBg} minH="100vh">
                    <Container maxW="8xl" py={8}>
                        <VStack gap={6}>
                            <Skeleton height="200px" rounded="2xl" />
                            <Skeleton height="600px" rounded="2xl" />
                        </VStack>
                    </Container>
                </Box>
            </Container>
        );
    }

    const renderSystemSettings = () => (
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
                                value={systemSettings.businessName}
                                onChange={(e) => setSystemSettings({ ...systemSettings, businessName: e.target.value })}
                                placeholder="Your business name"
                            />
                        </Field.Root>

                        <Field.Root>
                            <Field.Label>Business Email</Field.Label>
                            <Input
                                type="email"
                                value={systemSettings.businessEmail}
                                onChange={(e) => setSystemSettings({ ...systemSettings, businessEmail: e.target.value })}
                                placeholder="business@email.com"
                            />
                        </Field.Root>

                        <Field.Root>
                            <Field.Label>Business Phone</Field.Label>
                            <Input
                                value={systemSettings.businessPhone}
                                onChange={(e) => setSystemSettings({ ...systemSettings, businessPhone: e.target.value })}
                                placeholder="+233 XX XXX XXXX"
                            />
                        </Field.Root>

                        <Field.Root>
                            <Field.Label>Currency</Field.Label>
                            <NativeSelect.Root>
                                <NativeSelect.Field
                                    value={systemSettings.currency}
                                    onChange={(e) => setSystemSettings({ ...systemSettings, currency: e.target.value })}
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
                                    value={systemSettings.timezone}
                                    onChange={(e) => setSystemSettings({ ...systemSettings, timezone: e.target.value })}
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
                                value={systemSettings.taxRate}
                                onChange={(e) => setSystemSettings({ ...systemSettings, taxRate: parseFloat(e.target.value) })}
                                placeholder="12.5"
                            />
                        </Field.Root>
                    </Grid>

                    <Field.Root mt={4}>
                        <Field.Label>Business Address</Field.Label>
                        <Textarea
                            value={systemSettings.businessAddress}
                            onChange={(e) => setSystemSettings({ ...systemSettings, businessAddress: e.target.value })}
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
                                value={systemSettings.lowStockThreshold}
                                onChange={(e) => setSystemSettings({ ...systemSettings, lowStockThreshold: parseInt(e.target.value) })}
                                placeholder="10"
                            />
                        </Field.Root>

                        <Field.Root>
                            <Field.Label>Delivery Radius (km)</Field.Label>
                            <Input
                                type="number"
                                value={systemSettings.deliveryRadius}
                                onChange={(e) => setSystemSettings({ ...systemSettings, deliveryRadius: parseInt(e.target.value) })}
                                placeholder="25"
                            />
                        </Field.Root>

                        <Field.Root>
                            <Field.Label>Minimum Order Amount</Field.Label>
                            <Input
                                type="number"
                                value={systemSettings.minOrderAmount}
                                onChange={(e) => setSystemSettings({ ...systemSettings, minOrderAmount: parseInt(e.target.value) })}
                                placeholder="50"
                            />
                        </Field.Root>

                        <Field.Root>
                            <Field.Label>Maximum Order Amount</Field.Label>
                            <Input
                                type="number"
                                value={systemSettings.maxOrderAmount}
                                onChange={(e) => setSystemSettings({ ...systemSettings, maxOrderAmount: parseInt(e.target.value) })}
                                placeholder="10000"
                            />
                        </Field.Root>
                    </Grid>
                </Card.Body>
            </Card.Root>

            <Flex justify="end" gap={3}>
                <Button variant="outline" onClick={() => fetchSettings()}>
                    <RiResetRightLine />
                    Reset
                </Button>
                <Button
                    bg="blue.500"
                    color="white"
                    onClick={() => saveSettings('system', systemSettings)}
                    loading={saving}
                    _hover={{ bg: 'blue.600' }}
                >
                    <FaSave />
                    Save Changes
                </Button>
            </Flex>
        </VStack>
    );

    const renderUserSettings = () => (
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
                                    value={userSettings.theme}
                                    onChange={(e) => setUserSettings({ ...userSettings, theme: e.target.value as 'light' | 'dark' | 'system' })}
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
                                    value={userSettings.dateFormat}
                                    onChange={(e) => setUserSettings({ ...userSettings, dateFormat: e.target.value })}
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
                                    value={userSettings.timeFormat}
                                    onChange={(e) => setUserSettings({ ...userSettings, timeFormat: e.target.value })}
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
                                value={userSettings.dashboardRefreshInterval}
                                onChange={(e) => setUserSettings({ ...userSettings, dashboardRefreshInterval: parseInt(e.target.value) })}
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
                                    checked={userSettings.enableSounds}
                                    onCheckedChange={(e) => setUserSettings({ ...userSettings, enableSounds: e.checked })}
                                >
                                    <Switch.HiddenInput />
                                    <Switch.Control />
                                </Switch.Root>
                            </HStack>
                        </Field.Root>
                    </VStack>
                </Card.Body>
            </Card.Root>

            <Flex justify="end" gap={3}>
                <Button variant="outline" onClick={() => fetchSettings()}>
                    <RiResetRightLine />
                    Reset
                </Button>
                <Button
                    bg="blue.500"
                    color="white"
                    onClick={() => saveSettings('user', userSettings)}
                    loading={saving}
                    _hover={{ bg: 'blue.600' }}
                >
                    <FaSave />
                    Save Changes
                </Button>
            </Flex>
        </VStack>
    );

    const renderPaymentSettings = () => (
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
                                    checked={paymentSettings.acceptCash}
                                    onCheckedChange={(e) => setPaymentSettings({ ...paymentSettings, acceptCash: e.checked })}
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
                                    checked={paymentSettings.acceptKowri}
                                    onCheckedChange={(e) => setPaymentSettings({ ...paymentSettings, acceptKowri: e.checked })}
                                >
                                    <Switch.HiddenInput />
                                    <Switch.Control />
                                </Switch.Root>
                            </HStack>
                        </Field.Root>
                    </VStack>
                </Card.Body>
            </Card.Root>

            {paymentSettings.acceptKowri && (
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
                                    value={paymentSettings.kowriMerchantId}
                                    onChange={(e) => setPaymentSettings({ ...paymentSettings, kowriMerchantId: e.target.value })}
                                    placeholder="Your Kowri Merchant ID"
                                />
                            </Field.Root>

                            <Field.Root>
                                <Field.Label>API Key</Field.Label>
                                <Input
                                    type="password"
                                    value={paymentSettings.kowriApiKey}
                                    onChange={(e) => setPaymentSettings({ ...paymentSettings, kowriApiKey: e.target.value })}
                                    placeholder="Your Kowri API Key"
                                />
                            </Field.Root>

                            <Field.Root>
                                <HStack justify="space-between">
                                    <VStack align="start" gap={0}>
                                        <Field.Label>Test Mode</Field.Label>
                                        <Text fontSize="sm" color={mutedTextColor}>
                                            Use test environment for development
                                        </Text>
                                    </VStack>
                                    <Switch.Root
                                        checked={paymentSettings.enableTestMode}
                                        onCheckedChange={(e) => setPaymentSettings({ ...paymentSettings, enableTestMode: e.checked })}
                                    >
                                        <Switch.HiddenInput />
                                        <Switch.Control />
                                    </Switch.Root>
                                </HStack>
                            </Field.Root>

                            <HStack>
                                <Button
                                    variant="outline"
                                    onClick={() => testConnection('kowri')}
                                    flex="1"
                                >
                                    <PiTestTubeLight />
                                    Test Connection
                                </Button>
                            </HStack>
                        </VStack>
                    </Card.Body>
                </Card.Root>
            )}

            <Flex justify="end" gap={3}>
                <Button variant="outline" onClick={() => fetchSettings()}>
                    <RiResetRightLine />
                    Reset
                </Button>
                <Button
                    bg="blue.500"
                    color="white"
                    onClick={() => saveSettings('payment', paymentSettings)}
                    loading={saving}
                    _hover={{ bg: 'blue.600' }}
                >
                    <FaSave />
                    Save Changes
                </Button>
            </Flex>
        </VStack>
    );

    const renderNotificationSettings = () => (
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
                                    checked={notificationSettings.lowStockAlerts}
                                    onCheckedChange={(e) => setNotificationSettings({ ...notificationSettings, lowStockAlerts: e.checked })}
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
                                    checked={notificationSettings.orderAlerts}
                                    onCheckedChange={(e) => setNotificationSettings({ ...notificationSettings, orderAlerts: e.checked })}
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
                                    checked={notificationSettings.customerAlerts}
                                    onCheckedChange={(e) => setNotificationSettings({ ...notificationSettings, customerAlerts: e.checked })}
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
                                    checked={notificationSettings.systemAlerts}
                                    onCheckedChange={(e) => setNotificationSettings({ ...notificationSettings, systemAlerts: e.checked })}
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
                        📱 Delivery Channels
                    </Heading>
                </Card.Header>
                <Card.Body px={6} pb={6}>
                    <VStack gap={4} align="stretch">
                        <Field.Root>
                            <HStack justify="space-between">
                                <VStack align="start" gap={0}>
                                    <Field.Label>Email Notifications</Field.Label>
                                    <Text fontSize="sm" color={mutedTextColor}>
                                        Send notifications via email
                                    </Text>
                                </VStack>
                                <Switch.Root
                                    checked={notificationSettings.emailNotifications}
                                    onCheckedChange={(e) => setNotificationSettings({ ...notificationSettings, emailNotifications: e.checked })}
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
                                        Send notifications via SMS
                                    </Text>
                                </VStack>
                                <Switch.Root
                                    checked={notificationSettings.smsNotifications}
                                    onCheckedChange={(e) => setNotificationSettings({ ...notificationSettings, smsNotifications: e.checked })}
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
                                        Send browser push notifications
                                    </Text>
                                </VStack>
                                <Switch.Root
                                    checked={notificationSettings.pushNotifications}
                                    onCheckedChange={(e) => setNotificationSettings({ ...notificationSettings, pushNotifications: e.checked })}
                                >
                                    <Switch.HiddenInput />
                                    <Switch.Control />
                                </Switch.Root>
                            </HStack>
                        </Field.Root>

                        <HStack gap={3} mt={4}>
                            <Button
                                variant="outline"
                                onClick={() => testConnection('email')}
                                flex="1"
                            >
                                <FaEnvelope />
                                Test Email
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => testConnection('sms')}
                                flex="1"
                            >
                                <FaSms />
                                Test SMS
                            </Button>
                        </HStack>
                    </VStack>
                </Card.Body>
            </Card.Root>

            <Flex justify="end" gap={3}>
                <Button variant="outline" onClick={() => fetchSettings()}>
                    <RiResetRightLine />
                    Reset
                </Button>
                <Button
                    bg="blue.500"
                    color="white"
                    onClick={() => saveSettings('notifications', notificationSettings)}
                    loading={saving}
                    _hover={{ bg: 'blue.600' }}
                >
                    <FaSave />
                    Save Changes
                </Button>
            </Flex>
        </VStack>
    );

    return (
        <Container maxW="full" p={0}>
            <Box bg={gradientBg} minH="100vh">
                <Container maxW="8xl" py={8}>
                    <VStack align="stretch" gap={8}>
                        {/* Header */}
                        <Box
                            bg={cardBg}
                            rounded="2xl"
                            p={8}
                            shadow={cardShadow}
                            border="1px solid"
                            borderColor={borderColor}
                            position="relative"
                            overflow="hidden"
                            _before={{
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                height: '4px',
                                bg: 'linear-gradient(90deg, orange.500, red.500, purple.500)',
                                borderTopRadius: '2xl'
                            }}
                        >
                            <Flex direction={{ base: 'column', lg: 'row' }} justify="space-between" align={{ base: 'start', lg: 'center' }} gap={6}>
                                <VStack align="start" gap={3}>
                                    <Heading size="2xl" color={textColor} letterSpacing="tight">
                                        ⚙️ System Settings
                                    </Heading>
                                    <Text color={mutedTextColor} fontSize="lg" maxW="md">
                                        Configure your system preferences, payment methods, and notification settings
                                    </Text>
                                </VStack>

                                <Flex wrap="wrap" gap={3}>
                                    <Button variant="outline" bg={cardBg}>
                                        <FaDownload />
                                        Export Settings
                                    </Button>
                                    <Button variant="outline" bg={cardBg}>
                                        <FaUpload />
                                        Import Settings
                                    </Button>
                                    <Button variant="outline" onClick={fetchSettings} bg={cardBg}>
                                        <FaSync />
                                        Refresh
                                    </Button>
                                </Flex>
                            </Flex>
                        </Box>

                        {/* Settings Tabs */}
                        <Card.Root bg={cardBg} rounded="2xl" shadow={cardShadow} border="1px solid" borderColor={borderColor}>
                            <Tabs.Root value={activeTab} onValueChange={(e) => setActiveTab(e.value!)}>
                                <Tabs.List bg="transparent" borderBottom="1px solid" borderColor={borderColor}>
                                    <Tabs.Trigger value="system" gap={2}>
                                        <FaCog />
                                        System
                                    </Tabs.Trigger>
                                    <Tabs.Trigger value="user" gap={2}>
                                        <FaUser />
                                        User
                                    </Tabs.Trigger>
                                    <Tabs.Trigger value="payment" gap={2}>
                                        <FaCreditCard />
                                        Payment
                                    </Tabs.Trigger>
                                    <Tabs.Trigger value="notifications" gap={2}>
                                        <FaBell />
                                        Notifications
                                    </Tabs.Trigger>
                                </Tabs.List>

                                <Box p={6}>
                                    <Tabs.Content value="system">
                                        {renderSystemSettings()}
                                    </Tabs.Content>

                                    <Tabs.Content value="user">
                                        {renderUserSettings()}
                                    </Tabs.Content>

                                    <Tabs.Content value="payment">
                                        {renderPaymentSettings()}
                                    </Tabs.Content>

                                    <Tabs.Content value="notifications">
                                        {renderNotificationSettings()}
                                    </Tabs.Content>
                                </Box>
                            </Tabs.Root>
                        </Card.Root>
                    </VStack>
                </Container>
            </Box>
        </Container>
    );
}
