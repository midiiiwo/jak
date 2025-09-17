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
    Field,
    NumberInput,
    Card,
    Stat,
    SimpleGrid,
    Icon,
    Spinner,
    Checkbox,
    NativeSelect,
    IconButton,
} from '@chakra-ui/react';
import { useColorModeValue } from "@/components/ui/color-mode";
import { toaster } from "@/components/ui/toaster";
import {
    FaBoxes,
    FaExclamationTriangle,
    FaArrowUp,
    FaArrowDown,
    FaEdit,
    FaPlus,
    FaDownload,
    FaSync,
    FaSearch,
} from 'react-icons/fa';

interface StockItem {
    id: string;
    name: string;
    sku: string;
    category: string;
    currentStock: number;
    minStock: number;
    maxStock: number;
    unitPrice: number;
    totalValue: number;
    status: 'in-stock' | 'low-stock' | 'out-of-stock' | 'overstocked';
    lastUpdated: string;
    supplier: string;
    location: string;
}

interface StockMovement {
    id: string;
    itemId: string;
    itemName: string;
    type: 'in' | 'out' | 'adjustment';
    quantity: number;
    reason: string;
    timestamp: string;
    user: string;
}

export default function StockManagement() {
    const [stockItems, setStockItems] = useState<StockItem[]>([]);
    const [stockMovements, setStockMovements] = useState<StockMovement[]>([]);
    const [loading, setLoading] = useState(true);
    const [isMovementDialogOpen, setIsMovementDialogOpen] = useState(false);
    const [, setSelectedItem] = useState<StockItem | null>(null);
    const [, setIsDialogOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [filterCategory, setFilterCategory] = useState('');

    // Color mode values
    const textColor = useColorModeValue('gray.800', 'white');
    const mutedTextColor = useColorModeValue('gray.600', 'gray.400');
    const cardBg = useColorModeValue('white', 'gray.700');
    const pageBg = useColorModeValue('gray.50', 'gray.900');

    useEffect(() => {
        fetchStockData();
    }, []);

    const fetchStockData = async () => {
        try {
            setLoading(true);
            const [stockResponse, movementsResponse] = await Promise.all([
                fetch('/api/admin/stock'),
                fetch('/api/admin/stock/movements')
            ]);

            if (stockResponse.ok && movementsResponse.ok) {
                const stockData = await stockResponse.json();
                const movementsData = await movementsResponse.json();

                setStockItems(stockData.items || []);
                setStockMovements(movementsData.movements || []);
            }
        } catch (error) {
            console.error('Failed to fetch stock data:', error);
            toaster.error({
                title: "Error",
                description: "Failed to load stock data",
            });
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'in-stock': return 'green';
            case 'low-stock': return 'yellow';
            case 'out-of-stock': return 'red';
            case 'overstocked': return 'blue';
            default: return 'gray';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'low-stock':
            case 'out-of-stock':
                return <FaExclamationTriangle />;
            case 'overstocked':
                return <FaArrowUp />;
            default:
                return <FaBoxes />;
        }
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handleStockUpdate = async (itemId: string, newStock: number) => {
        try {
            const response = await fetch(`/api/admin/stock/${itemId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ currentStock: newStock })
            });

            if (response.ok) {
                await fetchStockData();
                toaster.success({
                    title: "Success",
                    description: "Stock updated successfully",
                });
            }
        } catch (error) {
            console.error('Stock update error:', error);
            toaster.error({
                title: "Error",
                description: "Failed to update stock",
            });
        }
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handleStockMovement = async (data: {
        itemId: string;
        type: 'in' | 'out' | 'adjustment';
        quantity: number;
        reason: string;
    }) => {
        try {
            const response = await fetch('/api/admin/stock/movements', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                await fetchStockData();
                setIsMovementDialogOpen(false);
                toaster.success({
                    title: "Success",
                    description: "Stock movement recorded successfully",
                });
            }
        } catch (error) {
            console.error('Stock movement error:', error);
            toaster.error({
                title: "Error",
                description: "Failed to record stock movement",
            });
        }
    };

    const filteredItems = stockItems.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.sku.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = !filterStatus || item.status === filterStatus;
        const matchesCategory = !filterCategory || item.category === filterCategory;

        return matchesSearch && matchesStatus && matchesCategory;
    });

    const stockStats = {
        totalItems: stockItems.length,
        lowStockItems: stockItems.filter(item => item.status === 'low-stock').length,
        outOfStockItems: stockItems.filter(item => item.status === 'out-of-stock').length,
        totalValue: stockItems.reduce((sum, item) => sum + item.totalValue, 0),
    };

    if (loading) {
        return (
            <Box p={8} display="flex" justifyContent="center" alignItems="center" minH="400px">
                <VStack>
                    <Spinner size="xl" color="green.500" />
                    <Text color={mutedTextColor}>Loading stock data...</Text>
                </VStack>
            </Box>
        );
    }

    return (
        <Box p={{ base: 4, md: 6 }} bg={pageBg} minH="100vh">
            <VStack align="stretch" gap={{ base: 4, md: 6 }}>
                {/* Header */}
                <VStack align="start" gap={{ base: 4, md: 6 }}>
                    <VStack align="start" gap={1}>
                        <Text fontSize={{ base: "xl", md: "2xl" }} fontWeight="bold" color={textColor}>
                            Stock Management
                        </Text>
                        <Text color={mutedTextColor} fontSize={{ base: "sm", md: "md" }}>
                            Monitor inventory levels and manage stock movements
                        </Text>
                    </VStack>

                </VStack>
                <HStack wrap="wrap" gap={2} w="full" justify={{ base: "stretch", sm: "flex-start" }}>
                    <Button
                        bg="green.500"
                        color="white"
                        onClick={() => setIsMovementDialogOpen(true)}
                        _hover={{ bg: 'green.600' }}
                        size={{ base: "sm", md: "md" }}
                        flex={{ base: 1, sm: "initial" }}
                    >
                        <FaPlus />
                        <Text display={{ base: "none", sm: "inline" }} ml={2}>Stock Movement</Text>
                    </Button>
                    <Button
                        variant="outline"
                        size={{ base: "sm", md: "md" }}
                        flex={{ base: 1, sm: "initial" }}
                    >
                        <FaDownload />
                        <Text display={{ base: "none", sm: "inline" }} ml={2}>Export</Text>
                    </Button>
                    <Button
                        variant="outline"
                        onClick={fetchStockData}
                        size={{ base: "sm", md: "md" }}
                        flex={{ base: 1, sm: "initial" }}
                    >
                        <FaSync /> Refresh
                    </Button>
                </HStack>
            </VStack>

            {/* Stats Cards */}
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={4}>
                <Card.Root bg={cardBg} p={4}>
                    <Card.Body>
                        <Stat.Root>
                            <HStack justify="space-between">
                                <VStack align="start" gap={1}>
                                    <Stat.Label color={mutedTextColor}>Total Items</Stat.Label>
                                    <Stat.ValueText fontSize="2xl" fontWeight="bold" color={textColor}>
                                        {stockStats.totalItems}
                                    </Stat.ValueText>
                                </VStack>
                                <Icon color="blue.500" boxSize={8}>
                                    <FaBoxes />
                                </Icon>
                            </HStack>
                        </Stat.Root>
                    </Card.Body>
                </Card.Root>

                <Card.Root bg={cardBg} p={4}>
                    <Card.Body>
                        <Stat.Root>
                            <HStack justify="space-between">
                                <VStack align="start" gap={1}>
                                    <Stat.Label color={mutedTextColor}>Low Stock</Stat.Label>
                                    <Stat.ValueText fontSize="2xl" fontWeight="bold" color="yellow.500">
                                        {stockStats.lowStockItems}
                                    </Stat.ValueText>
                                </VStack>
                                <Icon color="yellow.500" boxSize={8}>
                                    <FaExclamationTriangle />
                                </Icon>
                            </HStack>
                        </Stat.Root>
                    </Card.Body>
                </Card.Root>

                <Card.Root bg={cardBg} p={4}>
                    <Card.Body>
                        <Stat.Root>
                            <HStack justify="space-between">
                                <VStack align="start" gap={1}>
                                    <Stat.Label color={mutedTextColor}>Out of Stock</Stat.Label>
                                    <Stat.ValueText fontSize="2xl" fontWeight="bold" color="red.500">
                                        {stockStats.outOfStockItems}
                                    </Stat.ValueText>
                                </VStack>
                                <Icon color="red.500" boxSize={8}>
                                    <FaExclamationTriangle />
                                </Icon>
                            </HStack>
                        </Stat.Root>
                    </Card.Body>
                </Card.Root>

                <Card.Root bg={cardBg} p={4}>
                    <Card.Body>
                        <Stat.Root>
                            <HStack justify="space-between">
                                <VStack align="start" gap={1}>
                                    <Stat.Label color={mutedTextColor}>Total Value</Stat.Label>
                                    <Stat.ValueText fontSize="2xl" fontWeight="bold" color="green.500">
                                        GHC {stockStats.totalValue.toLocaleString()}
                                    </Stat.ValueText>
                                </VStack>
                                <Icon color="green.500" boxSize={8}>
                                    <FaArrowUp />
                                </Icon>
                            </HStack>
                        </Stat.Root>
                    </Card.Body>
                </Card.Root>
            </SimpleGrid>

            {/* Filters */}
            <Card.Root bg={cardBg}>
                <Card.Body p={4}>
                    <HStack wrap="wrap" gap={4}>
                        <Box flex="1" minW="200px">
                            <HStack>
                                <Icon color="gray.400">
                                    <FaSearch />
                                </Icon>
                                <Input
                                    placeholder="Search by name or SKU..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    variant="outline"
                                />
                            </HStack>
                        </Box>

                        <NativeSelect.Root minW="150px">
                            <NativeSelect.Field
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                            >
                                <option value="">All Status</option>
                                <option value="in-stock">In Stock</option>
                                <option value="low-stock">Low Stock</option>
                                <option value="out-of-stock">Out of Stock</option>
                                <option value="overstocked">Overstocked</option>
                            </NativeSelect.Field>
                            <NativeSelect.Indicator />
                        </NativeSelect.Root>

                        <NativeSelect.Root minW="150px">
                            <NativeSelect.Field
                                value={filterCategory}
                                onChange={(e) => setFilterCategory(e.target.value)}
                            >
                                <option value="">All Categories</option>
                                <option value="Poultry">Poultry</option>
                                <option value="Seafood">Seafood</option>
                                <option value="Meat">Meat</option>
                                <option value="Beef">Beef</option>
                            </NativeSelect.Field>
                            <NativeSelect.Indicator />
                        </NativeSelect.Root>
                    </HStack>
                </Card.Body>
            </Card.Root>

            {/* Stock Table */}
            <Card.Root bg={cardBg}>
                <Card.Body p={0}>
                    <Box overflowX="auto" w="full">
                        <Table.Root size={{ base: "sm", md: "md" }} w="full">
                            <Table.Header>
                                <Table.Row>
                                    <Table.ColumnHeader display={{ base: "none", md: "table-cell" }}>
                                        <Checkbox.Root>
                                            <Checkbox.HiddenInput />
                                            <Checkbox.Control />
                                        </Checkbox.Root>
                                    </Table.ColumnHeader>
                                    <Table.ColumnHeader>Product</Table.ColumnHeader>
                                    <Table.ColumnHeader display={{ base: "none", sm: "table-cell" }}>SKU</Table.ColumnHeader>
                                    <Table.ColumnHeader display={{ base: "none", md: "table-cell" }}>Category</Table.ColumnHeader>
                                    <Table.ColumnHeader>Stock</Table.ColumnHeader>
                                    <Table.ColumnHeader display={{ base: "none", lg: "table-cell" }}>Min Stock</Table.ColumnHeader>
                                    <Table.ColumnHeader display={{ base: "table-cell", sm: "table-cell" }}>Status</Table.ColumnHeader>
                                    <Table.ColumnHeader display={{ base: "none", lg: "table-cell" }}>Value</Table.ColumnHeader>
                                    <Table.ColumnHeader display={{ base: "none", md: "table-cell" }}>Last Updated</Table.ColumnHeader>
                                    <Table.ColumnHeader textAlign="right">Actions</Table.ColumnHeader>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {filteredItems.map((item) => (
                                    <Table.Row key={item.id}>
                                        <Table.Cell display={{ base: "none", md: "table-cell" }}>
                                            <Checkbox.Root>
                                                <Checkbox.HiddenInput />
                                                <Checkbox.Control />
                                            </Checkbox.Root>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <VStack align="start" gap={1}>
                                                <Text fontWeight="medium" color={textColor} fontSize={{ base: "sm", md: "md" }}>
                                                    {item.name}
                                                </Text>
                                                <Text fontSize={{ base: "xs", md: "sm" }} color={mutedTextColor} display={{ base: "none", sm: "block" }}>
                                                    {item.supplier}
                                                </Text>
                                            </VStack>
                                        </Table.Cell>
                                        <Table.Cell display={{ base: "none", sm: "table-cell" }}>
                                            <Text fontFamily="mono" fontSize={{ base: "xs", md: "sm" }}>
                                                {item.sku}
                                            </Text>
                                        </Table.Cell>
                                        <Table.Cell display={{ base: "none", md: "table-cell" }}>
                                            <Badge colorPalette="blue" variant="subtle" fontSize={{ base: "xs", md: "sm" }}>
                                                {item.category}
                                            </Badge>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Text fontWeight="bold" color={textColor} fontSize={{ base: "sm", md: "md" }}>
                                                {item.currentStock}
                                            </Text>
                                        </Table.Cell>
                                        <Table.Cell display={{ base: "none", lg: "table-cell" }}>
                                            <Text color={mutedTextColor} fontSize={{ base: "sm", md: "md" }}>
                                                {item.minStock}
                                            </Text>
                                        </Table.Cell>
                                        <Table.Cell display={{ base: "table-cell", sm: "table-cell" }}>
                                            <HStack p={{ base: 1, md: 2 }}>
                                                <Icon color={`${getStatusColor(item.status)}.500`} boxSize={{ base: 3, md: 4 }}>
                                                    {getStatusIcon(item.status)}
                                                </Icon>
                                                <Badge
                                                    colorPalette={getStatusColor(item.status)}
                                                    variant="subtle"
                                                    fontSize={{ base: "xs", md: "sm" }}
                                                    display={{ base: "none", sm: "flex" }}
                                                >
                                                    {item.status.replace('-', ' ')}
                                                </Badge>
                                            </HStack>
                                        </Table.Cell>
                                        <Table.Cell display={{ base: "none", lg: "table-cell" }}>
                                            <Text fontWeight="medium" color="green.500" fontSize={{ base: "sm", md: "md" }}>
                                                GHC {item.totalValue.toLocaleString()}
                                            </Text>
                                        </Table.Cell>
                                        <Table.Cell display={{ base: "none", md: "table-cell" }}>
                                            <Text fontSize={{ base: "xs", md: "sm" }} color={mutedTextColor}>
                                                {new Date(item.lastUpdated).toLocaleDateString()}
                                            </Text>
                                        </Table.Cell>
                                        <Table.Cell textAlign="right">
                                            <HStack gap={1} justify="flex-end">
                                                <IconButton
                                                    size={{ base: "xs", md: "sm" }}
                                                    variant="outline"
                                                    colorPalette="blue"
                                                    aria-label="Edit item"
                                                    onClick={() => {
                                                        setSelectedItem(item);
                                                        setIsDialogOpen(true);
                                                    }}
                                                >
                                                    <FaEdit />
                                                </IconButton>
                                            </HStack>
                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table.Root>
                    </Box>
                </Card.Body>
            </Card.Root>

            {/* Recent Stock Movements */}
            <Card.Root bg={cardBg}>
                <Card.Header>
                    <Card.Title>Recent Stock Movements</Card.Title>
                </Card.Header>
                <Card.Body p={0}>
                    <Box overflowX="auto">
                        <Table.Root size="sm">
                            <Table.Header>
                                <Table.Row>
                                    <Table.ColumnHeader>Product</Table.ColumnHeader>
                                    <Table.ColumnHeader>Type</Table.ColumnHeader>
                                    <Table.ColumnHeader>Quantity</Table.ColumnHeader>
                                    <Table.ColumnHeader>Reason</Table.ColumnHeader>
                                    <Table.ColumnHeader>Date</Table.ColumnHeader>
                                    <Table.ColumnHeader>User</Table.ColumnHeader>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {stockMovements.slice(0, 10).map((movement) => (
                                    <Table.Row key={movement.id}>
                                        <Table.Cell>
                                            <Text fontWeight="medium" color={textColor}>
                                                {movement.itemName}
                                            </Text>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <HStack>
                                                <Icon
                                                    color={movement.type === 'in' ? 'green.500' :
                                                        movement.type === 'out' ? 'red.500' : 'blue.500'}
                                                >
                                                    {movement.type === 'in' ? <FaArrowUp /> :
                                                        movement.type === 'out' ? <FaArrowDown /> : <FaEdit />}
                                                </Icon>
                                                <Badge
                                                    colorPalette={movement.type === 'in' ? 'green' :
                                                        movement.type === 'out' ? 'red' : 'blue'}
                                                    variant="subtle"
                                                >
                                                    {movement.type.toUpperCase()}
                                                </Badge>
                                            </HStack>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Text
                                                fontWeight="bold"
                                                color={movement.type === 'in' ? 'green.500' :
                                                    movement.type === 'out' ? 'red.500' : textColor}
                                            >
                                                {movement.type === 'out' ? '-' : '+'}{movement.quantity}
                                            </Text>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Text color={mutedTextColor}>
                                                {movement.reason}
                                            </Text>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Text fontSize="sm" color={mutedTextColor}>
                                                {new Date(movement.timestamp).toLocaleString()}
                                            </Text>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Text fontSize="sm" color={mutedTextColor}>
                                                {movement.user}
                                            </Text>
                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table.Root>
                    </Box>
                </Card.Body>
            </Card.Root>

            {/* Stock Movement Dialog */ }
            <Dialog.Root open={isMovementDialogOpen} onOpenChange={(e) => setIsMovementDialogOpen(e.open)}>
                <Portal>
                    <Dialog.Backdrop />
                    <Dialog.Positioner w={{ base: "calc(100% - 32px)", md: "auto" }}>
                        <Dialog.Content
                            maxW={{ base: "100%", md: "md" }}
                            mx={{ base: 4, md: 0 }}
                            maxH={{ base: "calc(100vh - 64px)", md: "auto" }}
                            overflowY="auto"
                        >
                            <Dialog.Header>
                                <Dialog.Title fontSize={{ base: "lg", md: "xl" }}>Record Stock Movement</Dialog.Title>
                                <CloseButton size={{ base: "sm", md: "md" }} position="absolute" right={4} top={4} />
                            </Dialog.Header>

                            <Dialog.Body>
                                <VStack gap={4}>
                                    <Field.Root>
                                        <Field.Label fontSize={{ base: "sm", md: "md" }}>Product</Field.Label>
                                        <NativeSelect.Root size={{ base: "sm", md: "md" }}>
                                            <NativeSelect.Field>
                                                <option value="">Select product</option>
                                                {stockItems.map(item => (
                                                    <option key={item.id} value={item.id}>
                                                        {item.name} (SKU: {item.sku})
                                                    </option>
                                                ))}
                                            </NativeSelect.Field>
                                            <NativeSelect.Indicator />
                                        </NativeSelect.Root>
                                    </Field.Root>

                                    <Field.Root>
                                        <Field.Label>Movement Type</Field.Label>
                                        <NativeSelect.Root>
                                            <NativeSelect.Field>
                                                <option value="in">Stock In</option>
                                                <option value="out">Stock Out</option>
                                                <option value="adjustment">Adjustment</option>
                                            </NativeSelect.Field>
                                            <NativeSelect.Indicator />
                                        </NativeSelect.Root>
                                    </Field.Root>

                                    <Field.Root>
                                        <Field.Label>Quantity</Field.Label>
                                        <NumberInput.Root defaultValue="0">
                                            <NumberInput.Control />
                                            <NumberInput.Input />
                                        </NumberInput.Root>
                                    </Field.Root>

                                    <Field.Root>
                                        <Field.Label>Reason</Field.Label>
                                        <Input placeholder="Enter reason for stock movement" />
                                    </Field.Root>
                                </VStack>
                            </Dialog.Body>

                            <Dialog.Footer>
                                <Dialog.ActionTrigger asChild>
                                    <Button variant="outline">Cancel</Button>
                                </Dialog.ActionTrigger>
                                <Button bg="green.500" color="white" _hover={{ bg: 'green.600' }}>
                                    Record Movement
                                </Button>
                            </Dialog.Footer>

                            <Dialog.CloseTrigger asChild>
                                <CloseButton size="sm" />
                            </Dialog.CloseTrigger>
                        </Dialog.Content>
                    </Dialog.Positioner>
                </Portal>
            </Dialog.Root>
        </Box >
    );
}
