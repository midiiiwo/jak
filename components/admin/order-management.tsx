'use client'
import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    VStack,
    HStack,
    Text,
    Badge,
    Input,
    Table,
    Dialog,
    Portal,
    CloseButton,
    Card,
    Stat,
    Grid,
    Spinner,
    NativeSelect,
    InputGroup,
    Heading,
    Container,
    Flex,
    Center,
} from '@chakra-ui/react';
import { useColorModeValue } from "@/components/ui/color-mode";
import { toaster } from "@/components/ui/toaster";
import {
    FaShoppingCart,
    FaClock,
    FaTruck,
    FaCheckCircle,
    FaBan,
    FaEye,
    FaSearch,
    FaDownload,
    FaPlus,
    FaDollarSign,
} from 'react-icons/fa';

interface OrderItem {
    id: number;
    name: string;
    quantity: number;
    unitPrice: number;
    total: number;
}

interface ShippingAddress {
    street: string;
    city: string;
    region: string;
    zipCode: string;
}

interface Order {
    id: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    orderDate: string;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    total: number;
    items: OrderItem[];
    shippingAddress: ShippingAddress;
    paymentMethod: string;
    paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
    notes: string;
}

interface OrderStats {
    totalOrders: number;
    pendingOrders: number;
    processingOrders: number;
    shippedOrders: number;
    deliveredOrders: number;
    cancelledOrders: number;
    totalRevenue: number;
    averageOrderValue: number;
}

export default function OrderManagement() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [orderStats, setOrderStats] = useState<OrderStats>({
        totalOrders: 0,
        pendingOrders: 0,
        processingOrders: 0,
        shippedOrders: 0,
        deliveredOrders: 0,
        cancelledOrders: 0,
        totalRevenue: 0,
        averageOrderValue: 0
    });
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

    // Color mode values
    const textColor = useColorModeValue('gray.800', 'white');
    const mutedTextColor = useColorModeValue('gray.600', 'gray.400');
    const cardBg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.600');
    const hoverBg = useColorModeValue('gray.50', 'gray.700');
    const gradientBg = useColorModeValue(
        'linear-gradient(135deg, gray.50 0%, blue.50 100%)',
        'linear-gradient(135deg, gray.900 0%, blue.900 100%)'
    );
    const cardShadow = useColorModeValue(
        '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)'
    );

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/admin/orders');
            const data = await response.json();

            if (data.success) {
                setOrders(data.data.orders);
                setOrderStats(data.data.stats);
            } else {
                toaster.error({
                    title: "Error",
                    description: "Failed to fetch orders",
                });
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
            toaster.error({
                title: "Error",
                description: "Failed to fetch orders",
            });
        } finally {
            setLoading(false);
        }
    };

    const updateOrderStatus = async (orderId: string, newStatus: string) => {
        try {
            const response = await fetch(`/api/admin/orders/${orderId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });

            const data = await response.json();

            if (data.success) {
                fetchOrders();
                toaster.create({
                    title: "Success",
                    description: "Order status updated successfully",
                });
            }
        } catch (error) {
            console.error('Error updating order:', error);
            toaster.create({
                title: "Error",
                description: "Failed to update order status",
            });
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'yellow';
            case 'processing': return 'blue';
            case 'shipped': return 'purple';
            case 'delivered': return 'green';
            case 'cancelled': return 'red';
            default: return 'gray';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending': return <FaClock />;
            case 'processing': return <FaShoppingCart />;
            case 'shipped': return <FaTruck />;
            case 'delivered': return <FaCheckCircle />;
            case 'cancelled': return <FaBan />;
            default: return <FaClock />;
        }
    };

    const filteredOrders = orders.filter(order => {
        const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === '' || order.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    if (loading) {
        return (
            <VStack justify="center" align="center" h="400px" gap={4}>
                <Spinner size="xl" color="blue.500" />
                <Text color={mutedTextColor}>Loading orders...</Text>
            </VStack>
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
                    bg: 'linear-gradient(135deg, orange.500, red.600)',
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
                                bg: 'linear-gradient(90deg, orange.500, red.500, purple.500)',
                                borderTopRadius: '2xl'
                            }}
                        >
                            <Flex direction={{ base: 'column', lg: 'row' }} justify="space-between" align={{ base: 'start', lg: 'center' }} gap={6}>
                                <VStack align="start" gap={3}>
                                    <Heading size="2xl" color={textColor} letterSpacing="tight">
                                        🛒 Order Management
                                    </Heading>
                                    <Text color={mutedTextColor} fontSize="lg" maxW="md">
                                        Track and manage customer orders, update order status, and monitor order fulfillment
                                    </Text>
                                </VStack>

                                <Flex wrap="wrap" gap={3}>
                                    <Button
                                        bg="linear-gradient(135deg, blue.500, blue.600)"
                                        color="white"
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
                                        <FaPlus />
                                        New Order
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
                                                    Total Orders
                                                </Stat.Label>
                                                <Stat.ValueText fontSize="3xl" fontWeight="bold" color={textColor}>
                                                    {orderStats.totalOrders}
                                                </Stat.ValueText>
                                                <Text fontSize="xs" color="blue.500" fontWeight="medium">
                                                    All time
                                                </Text>
                                            </VStack>
                                            <Center
                                                bg="blue.50"
                                                _dark={{ bg: 'blue.900' }}
                                                rounded="2xl"
                                                p={4}
                                                color="blue.500"
                                            >
                                                <FaShoppingCart size={24} />
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
                                    borderColor: 'yellow.300'
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
                                                    Pending Orders
                                                </Stat.Label>
                                                <Stat.ValueText fontSize="3xl" fontWeight="bold" color="yellow.500">
                                                    {orderStats.pendingOrders}
                                                </Stat.ValueText>
                                                <Text fontSize="xs" color="yellow.500" fontWeight="medium">
                                                    Needs attention
                                                </Text>
                                            </VStack>
                                            <Center
                                                bg="yellow.50"
                                                _dark={{ bg: 'yellow.900' }}
                                                rounded="2xl"
                                                p={4}
                                                color="yellow.500"
                                            >
                                                <FaClock size={24} />
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
                                    bg="linear-gradient(90deg, yellow.400, yellow.600)"
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
                                                    Delivered
                                                </Stat.Label>
                                                <Stat.ValueText fontSize="3xl" fontWeight="bold" color="green.500">
                                                    {orderStats.deliveredOrders}
                                                </Stat.ValueText>
                                                <Text fontSize="xs" color="green.500" fontWeight="medium">
                                                    Completed successfully
                                                </Text>
                                            </VStack>
                                            <Center
                                                bg="green.50"
                                                _dark={{ bg: 'green.900' }}
                                                rounded="2xl"
                                                p={4}
                                                color="green.500"
                                            >
                                                <FaCheckCircle size={24} />
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
                                                    Total Revenue
                                                </Stat.Label>
                                                <Stat.ValueText fontSize="3xl" fontWeight="bold" color="purple.500">
                                                    GHC {orderStats.totalRevenue.toLocaleString()}
                                                </Stat.ValueText>
                                                <Text fontSize="xs" color="purple.500" fontWeight="medium">
                                                    Avg: GHC {orderStats.averageOrderValue.toFixed(2)}
                                                </Text>
                                            </VStack>
                                            <Center
                                                bg="purple.50"
                                                _dark={{ bg: 'purple.900' }}
                                                rounded="2xl"
                                                p={4}
                                                color="purple.500"
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
                                    bg="linear-gradient(90deg, purple.400, purple.600)"
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
                                            🔍 Filter & Search Orders
                                        </Heading>
                                        <Badge colorPalette="blue" variant="subtle" px={3} py={1} rounded="full">
                                            {filteredOrders.length} orders found
                                        </Badge>
                                    </Flex>
                                    <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4} w="full">
                                        <Box>
                                            <Text fontSize="sm" fontWeight="medium" color={mutedTextColor} mb={2}>
                                                Search Orders
                                            </Text>
                                            <InputGroup startElement={<FaSearch color="gray.400" />}>
                                                <Input
                                                    placeholder="Search by order ID, customer name, or email..."
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
                                                Order Status
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
                                                    <option value="pending">Pending</option>
                                                    <option value="processing">Processing</option>
                                                    <option value="shipped">Shipped</option>
                                                    <option value="delivered">Delivered</option>
                                                    <option value="cancelled">Cancelled</option>
                                                </NativeSelect.Field>
                                                <NativeSelect.Indicator />
                                            </NativeSelect.Root>
                                        </Box>
                                    </Grid>
                                </VStack>
                            </Card.Body>
                        </Card.Root>

                        {/* Orders Table */}
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
                                                <Table.ColumnHeader>Order ID</Table.ColumnHeader>
                                                <Table.ColumnHeader>Customer</Table.ColumnHeader>
                                                <Table.ColumnHeader>Date</Table.ColumnHeader>
                                                <Table.ColumnHeader>Status</Table.ColumnHeader>
                                                <Table.ColumnHeader>Items</Table.ColumnHeader>
                                                <Table.ColumnHeader>Total</Table.ColumnHeader>
                                                <Table.ColumnHeader>Payment</Table.ColumnHeader>
                                                <Table.ColumnHeader>Actions</Table.ColumnHeader>
                                            </Table.Row>
                                        </Table.Header>
                                        <Table.Body>
                                            {filteredOrders.map((order) => (
                                                <Table.Row key={order.id}>
                                                    <Table.Cell>
                                                        <Text fontFamily="mono" fontWeight="bold" color="blue.500">
                                                            {order.id}
                                                        </Text>
                                                    </Table.Cell>
                                                    <Table.Cell>
                                                        <VStack align="start" gap={1}>
                                                            <Text fontWeight="medium" color={textColor}>
                                                                {order.customerName}
                                                            </Text>
                                                            <Text fontSize="sm" color={mutedTextColor}>
                                                                {order.customerEmail}
                                                            </Text>
                                                        </VStack>
                                                    </Table.Cell>
                                                    <Table.Cell>
                                                        <Text fontSize="sm" color={mutedTextColor}>
                                                            {new Date(order.orderDate).toLocaleDateString()}
                                                        </Text>
                                                    </Table.Cell>
                                                    <Table.Cell>
                                                        <HStack>
                                                            {getStatusIcon(order.status)}
                                                            <Badge
                                                                colorPalette={getStatusColor(order.status)}
                                                                variant="subtle"
                                                            >
                                                                {order.status.toUpperCase()}
                                                            </Badge>
                                                        </HStack>
                                                    </Table.Cell>
                                                    <Table.Cell>
                                                        <Text fontWeight="medium" color={textColor}>
                                                            {order.items.length} item{order.items.length > 1 ? 's' : ''}
                                                        </Text>
                                                    </Table.Cell>
                                                    <Table.Cell>
                                                        <Text fontWeight="bold" color="green.500" fontSize="lg">
                                                            GHC {order.total.toFixed(2)}
                                                        </Text>
                                                    </Table.Cell>
                                                    <Table.Cell>
                                                        <Badge
                                                            colorPalette={order.paymentStatus === 'completed' ? 'green' :
                                                                order.paymentStatus === 'pending' ? 'yellow' : 'red'}
                                                            variant="subtle"
                                                        >
                                                            {order.paymentStatus.toUpperCase()}
                                                        </Badge>
                                                    </Table.Cell>
                                                    <Table.Cell>
                                                        <HStack gap={2}>
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => {
                                                                    setSelectedOrder(order);
                                                                    setIsViewDialogOpen(true);
                                                                }}
                                                            >
                                                                <FaEye />
                                                                View
                                                            </Button>
                                                            <NativeSelect.Root size="sm" minW="120px">
                                                                <NativeSelect.Field
                                                                    value={order.status}
                                                                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                                                >
                                                                    <option value="pending">Pending</option>
                                                                    <option value="processing">Processing</option>
                                                                    <option value="shipped">Shipped</option>
                                                                    <option value="delivered">Delivered</option>
                                                                    <option value="cancelled">Cancelled</option>
                                                                </NativeSelect.Field>
                                                                <NativeSelect.Indicator />
                                                            </NativeSelect.Root>
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

            {/* Order Details Dialog */}
            <Dialog.Root open={isViewDialogOpen} onOpenChange={(e) => setIsViewDialogOpen(e.open)}>
                <Portal>
                    <Dialog.Backdrop />
                    <Dialog.Positioner>
                        <Dialog.Content maxW="4xl">
                            <Dialog.Header>
                                <Dialog.Title>Order Details - {selectedOrder?.id}</Dialog.Title>
                            </Dialog.Header>

                            <Dialog.Body>
                                {selectedOrder && (
                                    <VStack gap={6} align="stretch">
                                        {/* Order Info */}
                                        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6}>
                                            <Card.Root>
                                                <Card.Header>
                                                    <Card.Title>Customer Information</Card.Title>
                                                </Card.Header>
                                                <Card.Body>
                                                    <VStack align="start" gap={2}>
                                                        <Text><strong>Name:</strong> {selectedOrder.customerName}</Text>
                                                        <Text><strong>Email:</strong> {selectedOrder.customerEmail}</Text>
                                                        <Text><strong>Phone:</strong> {selectedOrder.customerPhone}</Text>
                                                    </VStack>
                                                </Card.Body>
                                            </Card.Root>

                                            <Card.Root>
                                                <Card.Header>
                                                    <Card.Title>Order Information</Card.Title>
                                                </Card.Header>
                                                <Card.Body>
                                                    <VStack align="start" gap={2}>
                                                        <Text><strong>Date:</strong> {new Date(selectedOrder.orderDate).toLocaleString()}</Text>
                                                        <Text><strong>Status:</strong>
                                                            <Badge ml={2} colorPalette={getStatusColor(selectedOrder.status)}>
                                                                {selectedOrder.status.toUpperCase()}
                                                            </Badge>
                                                        </Text>
                                                        <Text><strong>Payment:</strong>
                                                            <Badge ml={2} colorPalette={selectedOrder.paymentStatus === 'completed' ? 'green' : 'yellow'}>
                                                                {selectedOrder.paymentStatus.toUpperCase()}
                                                            </Badge>
                                                        </Text>
                                                    </VStack>
                                                </Card.Body>
                                            </Card.Root>
                                        </Grid>

                                        {/* Shipping Address */}
                                        <Card.Root>
                                            <Card.Header>
                                                <Card.Title>Shipping Address</Card.Title>
                                            </Card.Header>
                                            <Card.Body>
                                                <Text>
                                                    {selectedOrder.shippingAddress.street}, {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.region} {selectedOrder.shippingAddress.zipCode}
                                                </Text>
                                            </Card.Body>
                                        </Card.Root>

                                        {/* Order Items */}
                                        <Card.Root>
                                            <Card.Header>
                                                <Card.Title>Order Items</Card.Title>
                                            </Card.Header>
                                            <Card.Body p={0}>
                                                <Table.Root size="sm">
                                                    <Table.Header>
                                                        <Table.Row>
                                                            <Table.ColumnHeader>Product</Table.ColumnHeader>
                                                            <Table.ColumnHeader>Quantity</Table.ColumnHeader>
                                                            <Table.ColumnHeader>Unit Price</Table.ColumnHeader>
                                                            <Table.ColumnHeader>Total</Table.ColumnHeader>
                                                        </Table.Row>
                                                    </Table.Header>
                                                    <Table.Body>
                                                        {selectedOrder.items.map((item) => (
                                                            <Table.Row key={item.id}>
                                                                <Table.Cell>{item.name}</Table.Cell>
                                                                <Table.Cell>{item.quantity}</Table.Cell>
                                                                <Table.Cell>GHC {item.unitPrice.toFixed(2)}</Table.Cell>
                                                                <Table.Cell>GHC {item.total.toFixed(2)}</Table.Cell>
                                                            </Table.Row>
                                                        ))}
                                                        <Table.Row>
                                                            <Table.Cell colSpan={3} fontWeight="bold">Total:</Table.Cell>
                                                            <Table.Cell fontWeight="bold" color="green.500">
                                                                GHC {selectedOrder.total.toFixed(2)}
                                                            </Table.Cell>
                                                        </Table.Row>
                                                    </Table.Body>
                                                </Table.Root>
                                            </Card.Body>
                                        </Card.Root>

                                        {/* Notes */}
                                        {selectedOrder.notes && (
                                            <Card.Root>
                                                <Card.Header>
                                                    <Card.Title>Order Notes</Card.Title>
                                                </Card.Header>
                                                <Card.Body>
                                                    <Text>{selectedOrder.notes}</Text>
                                                </Card.Body>
                                            </Card.Root>
                                        )}
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
