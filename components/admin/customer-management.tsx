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
    Badge,
    Table,
    Stat,
    Dialog,
    Portal,
    Field,
    CloseButton,
    NativeSelect,
    Textarea,
    Container,
    Grid,
    Center,
    Separator,
    Skeleton,
    Heading,
    InputGroup
} from '@chakra-ui/react';
import { useColorModeValue } from '@/components/ui/color-mode';
import {
    FaUsers,
    FaUserPlus,
    FaEdit,
    FaTrash,
    FaEye,
    FaPhone,
    FaEnvelope,
    FaDollarSign,
    FaSearch,
    FaDownload,
    FaSync,
    FaCrown,
    FaStar,
    FaUserCheck,
} from 'react-icons/fa';

interface Customer {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    registrationDate: string;
    totalOrders: number;
    totalSpent: number;
    lastOrderDate: string | null;
    status: 'active' | 'inactive';
    customerType: 'regular' | 'premium' | 'vip';
    notes: string;
}

interface CustomerStats {
    totalCustomers: number;
    activeCustomers: number;
    inactiveCustomers: number;
    vipCustomers: number;
    premiumCustomers: number;
    totalRevenue: number;
    averageOrderValue: number;
    newCustomersThisMonth: number;
}

export default function CustomerManagement() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [customerStats, setCustomerStats] = useState<CustomerStats>({
        totalCustomers: 0,
        activeCustomers: 0,
        inactiveCustomers: 0,
        vipCustomers: 0,
        premiumCustomers: 0,
        totalRevenue: 0,
        averageOrderValue: 0,
        newCustomersThisMonth: 0
    });

    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [filterCustomerType, setFilterCustomerType] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        customerType: 'regular',
        notes: ''
    });

    // Color mode values
    const cardBg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.600');
    const textColor = useColorModeValue('gray.900', 'white');
    const mutedTextColor = useColorModeValue('gray.600', 'gray.400');
    const hoverBg = useColorModeValue('gray.50', 'gray.700');
    const gradientBg = useColorModeValue('white', 'gray.900');
    const cardShadow = useColorModeValue(
        '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)'
    );

    const fetchCustomerData = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/admin/customers');
            if (response.ok) {
                const data = await response.json();
                setCustomers(data.customers);
                setCustomerStats(data.stats);
            }
        } catch (error) {
            console.error('Error fetching customers:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomerData();
    }, []);

    const filteredCustomers = customers.filter(customer => {
        const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.phone.includes(searchTerm);
        const matchesStatus = !filterStatus || customer.status === filterStatus;
        const matchesType = !filterCustomerType || customer.customerType === filterCustomerType;

        return matchesSearch && matchesStatus && matchesType;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'green';
            case 'inactive': return 'red';
            default: return 'gray';
        }
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const url = selectedCustomer
                ? `/api/admin/customers?id=${selectedCustomer.id}`
                : '/api/admin/customers';

            const method = selectedCustomer ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                await fetchCustomerData();
                setIsDialogOpen(false);
                resetForm();
            }
        } catch (error) {
            console.error('Error saving customer:', error);
        }
    };

    const handleDelete = async (customerId: string) => {
        if (confirm('Are you sure you want to delete this customer?')) {
            try {
                const response = await fetch(`/api/admin/customers?id=${customerId}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    await fetchCustomerData();
                }
            } catch (error) {
                console.error('Error deleting customer:', error);
            }
        }
    };

    const handleEdit = (customer: Customer) => {
        setSelectedCustomer(customer);
        setFormData({
            name: customer.name,
            email: customer.email,
            phone: customer.phone,
            address: customer.address,
            customerType: customer.customerType,
            notes: customer.notes
        });
        setIsDialogOpen(true);
    };

    const handleView = (customer: Customer) => {
        setSelectedCustomer(customer);
        setIsViewDialogOpen(true);
    };

    const resetForm = () => {
        setSelectedCustomer(null);
        setFormData({
            name: '',
            email: '',
            phone: '',
            address: '',
            customerType: 'regular',
            notes: ''
        });
    };

    if (loading) {
        return (
            <Container maxW="full" p={0}>
                <Box bg={gradientBg} minH="100vh">
                    <Container maxW="8xl" py={8}>
                        <VStack gap={6}>
                            <Skeleton height="200px" rounded="2xl" />
                            <Grid templateColumns="repeat(4, 1fr)" gap={6} w="full">
                                <Skeleton height="120px" rounded="2xl" />
                                <Skeleton height="120px" rounded="2xl" />
                                <Skeleton height="120px" rounded="2xl" />
                                <Skeleton height="120px" rounded="2xl" />
                            </Grid>
                            <Skeleton height="400px" rounded="2xl" />
                        </VStack>
                    </Container>
                </Box>
            </Container>
        );
    }

    return (
        <Container maxW="full" p={0}>
            <Box
                bg={gradientBg}
                minH="100vh"
                position="relative"
                _before={{
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '200px',
                    bg: 'linear-gradient(135deg, purple.500, blue.600)',
                    opacity: 0.1,
                    zIndex: 0
                }}
            >
                <Container maxW="8xl" position="relative" zIndex={1}>
                    <VStack align="stretch" gap={8} py={8}>
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
                                bg: 'linear-gradient(90deg, purple.500, blue.500, teal.500)',
                                borderTopRadius: '2xl'
                            }}
                        >
                            <Flex direction={{ base: 'column', lg: 'row' }} justify="space-between" align={{ base: 'start', lg: 'center' }} gap={6}>
                                <VStack align="start" gap={3}>
                                    <Heading size="2xl" color={textColor} letterSpacing="tight">
                                        👥 Customer Management
                                    </Heading>
                                    <Text color={mutedTextColor} fontSize="lg" maxW="md">
                                        Manage customer relationships, track customer activity, and analyze customer behavior
                                    </Text>
                                </VStack>

                                <Flex wrap="wrap" gap={3}>
                                    <Button
                                        bg="blue.500"
                                        color="white"
                                        onClick={() => {
                                            resetForm();
                                            setIsDialogOpen(true);
                                        }}
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
                                        onClick={fetchCustomerData}
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
                                </Flex>
                            </Flex>
                        </Box>

                        {/* Stats Cards */}
                        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }} gap={6}>
                            <Card.Root
                                bg={cardBg}
                                rounded="2xl"
                                shadow={cardShadow}
                                border="1px solid"
                                borderColor={borderColor}
                                _hover={{
                                    transform: 'translateY(-4px)',
                                    shadow: '2xl',
                                    borderColor: 'blue.300'
                                }}
                                transition="all 0.3s ease"
                                overflow="hidden"
                                position="relative"
                            >
                                <Card.Body p={6}>
                                    <Stat.Root>
                                        <Flex justify="space-between" align="center">
                                            <VStack align="start" gap={2} flex="1">
                                                <Stat.Label color={mutedTextColor} fontSize="sm" fontWeight="medium">
                                                    Total Customers
                                                </Stat.Label>
                                                <Stat.ValueText fontSize="3xl" fontWeight="bold" color={textColor}>
                                                    {customerStats.totalCustomers}
                                                </Stat.ValueText>
                                                <Text fontSize="xs" color="green.500" fontWeight="medium">
                                                    +{customerStats.newCustomersThisMonth} this month
                                                </Text>
                                            </VStack>
                                            <Center
                                                bg="blue.50"
                                                _dark={{ bg: 'blue.900' }}
                                                rounded="2xl"
                                                p={4}
                                                color="blue.500"
                                            >
                                                <FaUsers size={24} />
                                            </Center>
                                        </Flex>
                                    </Stat.Root>
                                </Card.Body>
                                <Box
                                    position="absolute"
                                    bottom={0}
                                    left={0}
                                    right={0}
                                    height="4px"
                                    bg="linear-gradient(90deg, blue.400, blue.600)"
                                />
                            </Card.Root>

                            <Card.Root
                                bg={cardBg}
                                rounded="2xl"
                                shadow={cardShadow}
                                border="1px solid"
                                borderColor={borderColor}
                                _hover={{
                                    transform: 'translateY(-4px)',
                                    shadow: '2xl',
                                    borderColor: 'green.300'
                                }}
                                transition="all 0.3s ease"
                                overflow="hidden"
                                position="relative"
                            >
                                <Card.Body p={6}>
                                    <Stat.Root>
                                        <Flex justify="space-between" align="center">
                                            <VStack align="start" gap={2} flex="1">
                                                <Stat.Label color={mutedTextColor} fontSize="sm" fontWeight="medium">
                                                    Active Customers
                                                </Stat.Label>
                                                <Stat.ValueText fontSize="3xl" fontWeight="bold" color="green.500">
                                                    {customerStats.activeCustomers}
                                                </Stat.ValueText>
                                                <Text fontSize="xs" color="green.500" fontWeight="medium">
                                                    {Math.round((customerStats.activeCustomers / customerStats.totalCustomers) * 100)}% of total
                                                </Text>
                                            </VStack>
                                            <Center
                                                bg="green.50"
                                                _dark={{ bg: 'green.900' }}
                                                rounded="2xl"
                                                p={4}
                                                color="green.500"
                                            >
                                                <FaUserCheck size={24} />
                                            </Center>
                                        </Flex>
                                    </Stat.Root>
                                </Card.Body>
                                <Box
                                    position="absolute"
                                    bottom={0}
                                    left={0}
                                    right={0}
                                    height="4px"
                                    bg="linear-gradient(90deg, green.400, green.600)"
                                />
                            </Card.Root>

                            <Card.Root
                                bg={cardBg}
                                rounded="2xl"
                                shadow={cardShadow}
                                border="1px solid"
                                borderColor={borderColor}
                                _hover={{
                                    transform: 'translateY(-4px)',
                                    shadow: '2xl',
                                    borderColor: 'purple.300'
                                }}
                                transition="all 0.3s ease"
                                overflow="hidden"
                                position="relative"
                            >
                                <Card.Body p={6}>
                                    <Stat.Root>
                                        <Flex justify="space-between" align="center">
                                            <VStack align="start" gap={2} flex="1">
                                                <Stat.Label color={mutedTextColor} fontSize="sm" fontWeight="medium">
                                                    VIP Customers
                                                </Stat.Label>
                                                <Stat.ValueText fontSize="3xl" fontWeight="bold" color="purple.500">
                                                    {customerStats.vipCustomers}
                                                </Stat.ValueText>
                                                <Text fontSize="xs" color="purple.500" fontWeight="medium">
                                                    Premium tier
                                                </Text>
                                            </VStack>
                                            <Center
                                                bg="purple.50"
                                                _dark={{ bg: 'purple.900' }}
                                                rounded="2xl"
                                                p={4}
                                                color="purple.500"
                                            >
                                                <FaCrown size={24} />
                                            </Center>
                                        </Flex>
                                    </Stat.Root>
                                </Card.Body>
                                <Box
                                    position="absolute"
                                    bottom={0}
                                    left={0}
                                    right={0}
                                    height="4px"
                                    bg="linear-gradient(90deg, purple.400, purple.600)"
                                />
                            </Card.Root>

                            <Card.Root
                                bg={cardBg}
                                rounded="2xl"
                                shadow={cardShadow}
                                border="1px solid"
                                borderColor={borderColor}
                                _hover={{
                                    transform: 'translateY(-4px)',
                                    shadow: '2xl',
                                    borderColor: 'orange.300'
                                }}
                                transition="all 0.3s ease"
                                overflow="hidden"
                                position="relative"
                            >
                                <Card.Body p={6}>
                                    <Stat.Root>
                                        <Flex justify="space-between" align="center">
                                            <VStack align="start" gap={2} flex="1">
                                                <Stat.Label color={mutedTextColor} fontSize="sm" fontWeight="medium">
                                                    Avg. Order Value
                                                </Stat.Label>
                                                <Stat.ValueText fontSize="3xl" fontWeight="bold" color="orange.500">
                                                    GHC {customerStats.averageOrderValue.toFixed(2)}
                                                </Stat.ValueText>
                                                <Text fontSize="xs" color="orange.500" fontWeight="medium">
                                                    Per customer
                                                </Text>
                                            </VStack>
                                            <Center
                                                bg="orange.50"
                                                _dark={{ bg: 'orange.900' }}
                                                rounded="2xl"
                                                p={4}
                                                color="orange.500"
                                            >
                                                <FaDollarSign size={24} />
                                            </Center>
                                        </Flex>
                                    </Stat.Root>
                                </Card.Body>
                                <Box
                                    position="absolute"
                                    bottom={0}
                                    left={0}
                                    right={0}
                                    height="4px"
                                    bg="linear-gradient(90deg, orange.400, orange.600)"
                                />
                            </Card.Root>
                        </Grid>

                        {/* Filters */}
                        <Card.Root
                            bg={cardBg}
                            rounded="2xl"
                            shadow={cardShadow}
                            border="1px solid"
                            borderColor={borderColor}
                        >
                            <Card.Body p={6}>
                                <VStack gap={4}>
                                    <Flex justify="space-between" align="center" w="full">
                                        <Heading size="md" color={textColor}>
                                            🔍 Filter & Search
                                        </Heading>
                                        <Badge colorPalette="blue" variant="subtle" px={3} py={1} rounded="full">
                                            {filteredCustomers.length} customers found
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
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
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
                                                    value={filterStatus}
                                                    onChange={(e) => setFilterStatus(e.target.value)}
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
                                                    value={filterCustomerType}
                                                    onChange={(e) => setFilterCustomerType(e.target.value)}
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
                                </VStack>
                            </Card.Body>
                        </Card.Root>

                        {/* Customer Table */}
                        <Card.Root
                            bg={cardBg}
                            rounded="2xl"
                            shadow={cardShadow}
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
                                            {filteredCustomers.map((customer) => (
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
                                                                onClick={() => handleView(customer)}
                                                                _hover={{ bg: hoverBg }}
                                                            >
                                                                <FaEye />
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => handleEdit(customer)}
                                                                _hover={{ bg: hoverBg }}
                                                            >
                                                                <FaEdit />
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                colorPalette="red"
                                                                variant="outline"
                                                                onClick={() => handleDelete(customer.id)}
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
                    </VStack>
                </Container>
            </Box>

            {/* Add/Edit Customer Dialog */}
            <Dialog.Root open={isDialogOpen} onOpenChange={(e) => setIsDialogOpen(e.open)}>
                <Portal>
                    <Dialog.Backdrop />
                    <Dialog.Positioner>
                        <Dialog.Content maxW="md">
                            <Dialog.Header>
                                <Dialog.Title>
                                    {selectedCustomer ? 'Edit Customer' : 'Add New Customer'}
                                </Dialog.Title>
                            </Dialog.Header>

                            <Dialog.Body>
                                <form onSubmit={handleSubmit}>
                                    <VStack gap={4}>
                                        <Field.Root>
                                            <Field.Label>Name *</Field.Label>
                                            <Input
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                placeholder="Customer name"
                                                required
                                            />
                                        </Field.Root>

                                        <Field.Root>
                                            <Field.Label>Email *</Field.Label>
                                            <Input
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                placeholder="customer@email.com"
                                                required
                                            />
                                        </Field.Root>

                                        <Field.Root>
                                            <Field.Label>Phone *</Field.Label>
                                            <Input
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                placeholder="+233 XX XXX XXXX"
                                                required
                                            />
                                        </Field.Root>

                                        <Field.Root>
                                            <Field.Label>Address</Field.Label>
                                            <Input
                                                value={formData.address}
                                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                                placeholder="Customer address"
                                            />
                                        </Field.Root>

                                        <Field.Root>
                                            <Field.Label>Customer Type</Field.Label>
                                            <NativeSelect.Root>
                                                <NativeSelect.Field
                                                    value={formData.customerType}
                                                    onChange={(e) => setFormData({ ...formData, customerType: e.target.value })}
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
                                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                                placeholder="Customer notes or preferences"
                                                rows={3}
                                            />
                                        </Field.Root>
                                    </VStack>
                                </form>
                            </Dialog.Body>

                            <Dialog.Footer>
                                <Dialog.ActionTrigger asChild>
                                    <Button variant="outline" onClick={resetForm}>Cancel</Button>
                                </Dialog.ActionTrigger>
                                <Button
                                    bg="blue.500"
                                    color="white"
                                    _hover={{ bg: 'blue.600' }}
                                    onClick={handleSubmit}
                                >
                                    {selectedCustomer ? 'Update Customer' : 'Add Customer'}
                                </Button>
                            </Dialog.Footer>

                            <Dialog.CloseTrigger asChild>
                                <CloseButton size="sm" />
                            </Dialog.CloseTrigger>
                        </Dialog.Content>
                    </Dialog.Positioner>
                </Portal>
            </Dialog.Root>

            {/* View Customer Dialog */}
            <Dialog.Root open={isViewDialogOpen} onOpenChange={(e) => setIsViewDialogOpen(e.open)}>
                <Portal>
                    <Dialog.Backdrop />
                    <Dialog.Positioner>
                        <Dialog.Content maxW="lg">
                            <Dialog.Header>
                                <Dialog.Title>Customer Details</Dialog.Title>
                            </Dialog.Header>

                            <Dialog.Body>
                                {selectedCustomer && (
                                    <VStack gap={6} align="stretch">
                                        <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                                            <VStack align="start" gap={2}>
                                                <Text fontSize="sm" fontWeight="medium" color={mutedTextColor}>
                                                    Name
                                                </Text>
                                                <Text fontWeight="medium" color={textColor}>
                                                    {selectedCustomer.name}
                                                </Text>
                                            </VStack>

                                            <VStack align="start" gap={2}>
                                                <Text fontSize="sm" fontWeight="medium" color={mutedTextColor}>
                                                    Customer Type
                                                </Text>
                                                <HStack>
                                                    {getTypeIcon(selectedCustomer.customerType)}
                                                    <Badge
                                                        colorPalette={getTypeColor(selectedCustomer.customerType)}
                                                        variant="subtle"
                                                    >
                                                        {selectedCustomer.customerType.toUpperCase()}
                                                    </Badge>
                                                </HStack>
                                            </VStack>

                                            <VStack align="start" gap={2}>
                                                <Text fontSize="sm" fontWeight="medium" color={mutedTextColor}>
                                                    Email
                                                </Text>
                                                <Text color={textColor}>{selectedCustomer.email}</Text>
                                            </VStack>

                                            <VStack align="start" gap={2}>
                                                <Text fontSize="sm" fontWeight="medium" color={mutedTextColor}>
                                                    Phone
                                                </Text>
                                                <Text color={textColor}>{selectedCustomer.phone}</Text>
                                            </VStack>

                                            <VStack align="start" gap={2}>
                                                <Text fontSize="sm" fontWeight="medium" color={mutedTextColor}>
                                                    Total Orders
                                                </Text>
                                                <Text fontWeight="medium" color={textColor}>
                                                    {selectedCustomer.totalOrders}
                                                </Text>
                                            </VStack>

                                            <VStack align="start" gap={2}>
                                                <Text fontSize="sm" fontWeight="medium" color={mutedTextColor}>
                                                    Total Spent
                                                </Text>
                                                <Text fontWeight="medium" color="green.500">
                                                    GHC {selectedCustomer.totalSpent.toLocaleString()}
                                                </Text>
                                            </VStack>
                                        </Grid>

                                        <VStack align="start" gap={2}>
                                            <Text fontSize="sm" fontWeight="medium" color={mutedTextColor}>
                                                Address
                                            </Text>
                                            <Text color={textColor}>{selectedCustomer.address || 'No address provided'}</Text>
                                        </VStack>

                                        <VStack align="start" gap={2}>
                                            <Text fontSize="sm" fontWeight="medium" color={mutedTextColor}>
                                                Notes
                                            </Text>
                                            <Text color={textColor}>{selectedCustomer.notes || 'No notes available'}</Text>
                                        </VStack>

                                        <Separator />

                                        <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                                            <VStack align="start" gap={2}>
                                                <Text fontSize="sm" fontWeight="medium" color={mutedTextColor}>
                                                    Registration Date
                                                </Text>
                                                <Text color={textColor}>
                                                    {new Date(selectedCustomer.registrationDate).toLocaleDateString()}
                                                </Text>
                                            </VStack>

                                            <VStack align="start" gap={2}>
                                                <Text fontSize="sm" fontWeight="medium" color={mutedTextColor}>
                                                    Last Order
                                                </Text>
                                                <Text color={textColor}>
                                                    {selectedCustomer.lastOrderDate
                                                        ? new Date(selectedCustomer.lastOrderDate).toLocaleDateString()
                                                        : 'Never'
                                                    }
                                                </Text>
                                            </VStack>
                                        </Grid>
                                    </VStack>
                                )}
                            </Dialog.Body>

                            <Dialog.Footer>
                                <Dialog.ActionTrigger asChild>
                                    <Button variant="outline">Close</Button>
                                </Dialog.ActionTrigger>
                            </Dialog.Footer>

                            <Dialog.CloseTrigger asChild>
                                <CloseButton size="sm" />
                            </Dialog.CloseTrigger>
                        </Dialog.Content>
                    </Dialog.Positioner>
                </Portal>
            </Dialog.Root>
        </Container>
    );
}
