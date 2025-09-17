'use client'
import { useState, useEffect, useCallback } from 'react';
import {
    Box,
    Button,
    Card,
    Flex,
    Grid,
    HStack,
    Input,
    Portal,
    Select,
    Text,
    VStack,
    Badge,
    IconButton,
    Image,
    Table,
    Dialog,
    CloseButton,
    Field,
    Textarea,
    NumberInput,
    Alert,
    createListCollection,
    Spinner,
    Container,
    Circle,
    Icon
} from '@chakra-ui/react';
import { useColorModeValue } from '@/components/ui/color-mode';
import {
    FaEdit,
    FaTrash,
    FaPlus,
    FaSearch,
    FaFilter,
    FaExclamationTriangle,
    FaBox,
    FaWarehouse,
    FaTags,
    FaDollarSign,
    FaEye,
    FaDownload
} from 'react-icons/fa';
import { Product } from '@/types/admin';
import Link from 'next/link';

export default function ProductManagement() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [stockFilter, setStockFilter] = useState('');
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isStockOpen, setIsStockOpen] = useState(false);
    const [, setIsEditOpen] = useState(false);

    // Color mode values
    const bgColor = useColorModeValue('gray.50', 'gray.900');
    const cardBg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const textColor = useColorModeValue('gray.700', 'gray.200');
    const mutedTextColor = useColorModeValue('gray.500', 'gray.400');
    const headerBg = useColorModeValue('white', 'gray.800');
    const shadowColor = useColorModeValue('lg', 'dark-lg');
    const alertBg = useColorModeValue('orange.50', 'orange.900');
    const tableBg = useColorModeValue('white', 'gray.800');
    const productBg = useColorModeValue('gray.50', 'gray.700');
    const productTextColor = useColorModeValue('gray.600', 'gray.300');

    const categoryOptions = createListCollection({
        items: [
            { label: "All Categories", value: "" },
            { label: "Poultry", value: "Poultry" },
            { label: "Meat", value: "Meat" },
            { label: "SeaFood", value: "SeaFood" },
            { label: "Processed", value: "Processed" },
        ],
    });

    const stockOptions = createListCollection({
        items: [
            { label: "All Products", value: "" },
            { label: "In Stock", value: "true" },
            { label: "Out of Stock", value: "false" },
        ],
    });

    const stockTypeOptions = createListCollection({
        items: [
            { label: "Stock In (Add)", value: "in" },
            { label: "Stock Out (Remove)", value: "out" },
            { label: "Adjustment (Set Exact)", value: "adjustment" },
        ],
    });

    const fetchProducts = useCallback(async () => {
        try {
            const params = new URLSearchParams({
                ...(searchTerm && { search: searchTerm }),
                ...(categoryFilter && { category: categoryFilter }),
                ...(stockFilter && { inStock: stockFilter })
            });

            const response = await fetch(`/api/admin/products?${params}`);
            const data = await response.json();
            if (data.products) {
                setProducts(data.products);
            }
        } catch (error) {
            console.error('Failed to fetch products:', error);
        } finally {
            setLoading(false);
        }
    }, [searchTerm, categoryFilter, stockFilter]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handleDeleteProduct = async (productId: string) => {
        if (!confirm('Are you sure you want to delete this product?')) return;

        try {
            const response = await fetch(`/api/admin/products/${productId}`, {
                method: 'DELETE'
            });
            const data = await response.json();
            if (data.success) {
                fetchProducts();
            }
        } catch (error) {
            console.error('Failed to delete product:', error);
        }
    };

    const handleStockUpdate = async (productId: string, type: string, quantity: number, reason: string) => {
        try {
            const response = await fetch('/api/admin/stock', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId, type, quantity, reason })
            });
            const data = await response.json();
            if (data.success) {
                fetchProducts();
                setIsStockOpen(false);
            }
        } catch (error) {
            console.error('Failed to update stock:', error);
        }
    };

    const StockUpdateModal = () => {
        const [stockType, setStockType] = useState('in');
        const [quantity, setQuantity] = useState(0);
        const [reason, setReason] = useState('');

        return (
            <Dialog.Root open={isStockOpen} onOpenChange={(e) => setIsStockOpen(e.open)}>
                <Portal>
                    <Dialog.Backdrop bg="blackAlpha.600" backdropFilter="blur(4px)" />
                    <Dialog.Positioner>
                        <Dialog.Content
                            bg={cardBg}
                            border="1px solid"
                            borderColor={borderColor}
                            borderRadius="xl"
                            shadow={shadowColor}
                            maxW="md"
                        >
                            <Dialog.Header
                                bg={useColorModeValue('blue.50', 'blue.900')}
                                borderTopRadius="xl"
                                p={6}
                            >
                                <Dialog.Title color="blue.600" fontSize="lg" fontWeight="bold">
                                    <HStack>
                                        <Circle size="10" bg="blue.100" color="blue.600">
                                            <Icon><FaBox /></Icon>
                                        </Circle>
                                        <Text>Update Stock - {selectedProduct?.title}</Text>
                                    </HStack>
                                </Dialog.Title>
                            </Dialog.Header>
                            <Dialog.Body p={6}>
                                <VStack gap={5}>
                                    <Box
                                        w="100%"
                                        p={4}
                                        bg={useColorModeValue('gray.50', 'gray.700')}
                                        borderRadius="lg"
                                        border="1px solid"
                                        borderColor={borderColor}
                                    >
                                        <Text fontSize="sm" color={mutedTextColor} mb={1}>Current Stock</Text>
                                        <Text fontSize="2xl" fontWeight="bold" color={selectedProduct?.inStock ? 'green.500' : 'red.500'}>
                                            {selectedProduct?.stock} {selectedProduct?.unit}
                                        </Text>
                                        <Text fontSize="xs" color={mutedTextColor}>
                                            Minimum: {selectedProduct?.minStockLevel} {selectedProduct?.unit}
                                        </Text>
                                    </Box>

                                    <Field.Root w="100%">
                                        <Field.Label color={textColor} fontWeight="medium">Stock Movement Type</Field.Label>
                                        <Select.Root
                                            collection={stockTypeOptions}
                                            value={[stockType]}
                                            onValueChange={(e) => setStockType(e.value[0] || 'in')}
                                        >
                                            <Select.HiddenSelect />
                                            <Select.Control>
                                                <Select.Trigger
                                                    bg={cardBg}
                                                    border="1px solid"
                                                    borderColor={borderColor}
                                                    _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px blue.500' }}
                                                >
                                                    <Select.ValueText placeholder="Select stock type" />
                                                </Select.Trigger>
                                                <Select.IndicatorGroup>
                                                    <Select.Indicator />
                                                </Select.IndicatorGroup>
                                            </Select.Control>
                                            <Portal>
                                                <Select.Positioner>
                                                    <Select.Content bg={cardBg} border="1px solid" borderColor={borderColor}>
                                                        {stockTypeOptions.items.map((item) => (
                                                            <Select.Item item={item} key={item.value}>
                                                                {item.label}
                                                                <Select.ItemIndicator />
                                                            </Select.Item>
                                                        ))}
                                                    </Select.Content>
                                                </Select.Positioner>
                                            </Portal>
                                        </Select.Root>
                                    </Field.Root>

                                    <Field.Root w="100%">
                                        <Field.Label color={textColor} fontWeight="medium">Quantity</Field.Label>
                                        <NumberInput.Root
                                            value={quantity.toString()}
                                            onValueChange={(e) => setQuantity(Number(e.value))}
                                            min={0}
                                        >
                                            <NumberInput.Control>
                                                <NumberInput.Input
                                                    bg={cardBg}
                                                    border="1px solid"
                                                    borderColor={borderColor}
                                                    _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px blue.500' }}
                                                />
                                            </NumberInput.Control>
                                        </NumberInput.Root>
                                    </Field.Root>

                                    <Field.Root w="100%">
                                        <Field.Label color={textColor} fontWeight="medium">Reason</Field.Label>
                                        <Textarea
                                            value={reason}
                                            onChange={(e) => setReason(e.target.value)}
                                            placeholder="Enter reason for stock update..."
                                            bg={cardBg}
                                            border="1px solid"
                                            borderColor={borderColor}
                                            _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px blue.500' }}
                                        />
                                    </Field.Root>
                                </VStack>
                            </Dialog.Body>
                            <Dialog.Footer p={6} bg={useColorModeValue('gray.50', 'gray.700')} borderBottomRadius="xl">
                                <HStack w="100%" justify="flex-end" gap={3}>
                                    <Dialog.ActionTrigger asChild>
                                        <Button
                                            variant="outline"
                                            onClick={() => setIsStockOpen(false)}
                                            borderColor={borderColor}
                                            color={textColor}
                                        >
                                            Cancel
                                        </Button>
                                    </Dialog.ActionTrigger>
                                    <Button
                                        bg="blue.500"
                                        color="white"
                                        _hover={{ bg: 'blue.600' }}
                                        onClick={() => selectedProduct && handleStockUpdate(selectedProduct.id, stockType, quantity, reason)}
                                        disabled={!reason.trim() || quantity <= 0}
                                        loadingText="Updating..."
                                    >
                                        Update Stock
                                    </Button>
                                </HStack>
                            </Dialog.Footer>
                            <Dialog.CloseTrigger asChild>
                                <CloseButton
                                    position="absolute"
                                    top="4"
                                    right="4"
                                    size="sm"
                                    color={mutedTextColor}
                                />
                            </Dialog.CloseTrigger>
                        </Dialog.Content>
                    </Dialog.Positioner>
                </Portal>
            </Dialog.Root>
        );
    };

    if (loading) {
        return (
            <Box bg={bgColor} minH="100vh" display="flex" alignItems="center" justifyContent="center">
                <VStack gap={4}>
                    <Spinner size="xl" color="blue.500" />
                    <Text color={textColor} fontSize="lg">Loading products...</Text>
                </VStack>
            </Box>
        );
    }

    const lowStockProducts = products.filter(p => p.stock <= p.minStockLevel);
    const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);
    const outOfStockCount = products.filter(p => !p.inStock).length;

    return (
        <Box bg={bgColor} minH="100vh">
            <Container maxW="full" p={6}>
                <VStack align="stretch" gap={6}>
                    {/* Header Section */}
                    <Box
                        bg={headerBg}
                        p={6}
                        borderRadius="xl"
                        shadow={shadowColor}
                        border="1px solid"
                        borderColor={borderColor}
                    >
                        <Flex justify="space-between" align="center" direction={['column', 'row']} gap={4}>
                            <VStack align={['center', 'start']} gap={1}>
                                <HStack>
                                    <Circle size="12" bg="blue.100" color="blue.600">
                                        <Icon><FaWarehouse /></Icon>
                                    </Circle>
                                    <Text fontSize="3xl" fontWeight="bold" color={textColor}>
                                        Product Management
                                    </Text>
                                </HStack>
                                <Text color={mutedTextColor} fontSize="lg">
                                    Manage your inventory, track stock levels, and update product information
                                </Text>
                            </VStack>
                            <VStack gap={2}>
                                <Link href="/admin/products/new">
                                    <Button
                                        bg="blue.500"
                                        color="white"
                                        size="lg"
                                        _hover={{ bg: 'blue.600', transform: 'translateY(-1px)' }}
                                        transition="all 0.2s"
                                        shadow="md"
                                    >
                                        <FaPlus />
                                        Add New Product
                                    </Button>
                                </Link>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    borderColor={borderColor}
                                    color={textColor}
                                >
                                    <FaDownload />
                                    Export CSV
                                </Button>
                            </VStack>
                        </Flex>
                    </Box>

                    {/* Stats Cards */}
                    <Grid templateColumns={['1fr', '1fr', 'repeat(4, 1fr)']} gap={4}>
                        <Card.Root
                            bg={cardBg}
                            border="1px solid"
                            borderColor={borderColor}
                            shadow={shadowColor}
                            _hover={{ transform: 'translateY(-2px)', shadow: 'xl' }}
                            transition="all 0.2s"
                        >
                            <Card.Body p={6}>
                                <HStack justify="space-between">
                                    <VStack align="start" gap={1}>
                                        <Text color={mutedTextColor} fontSize="sm" fontWeight="medium">
                                            Total Products
                                        </Text>
                                        <Text fontSize="2xl" fontWeight="bold" color="blue.500">
                                            {products.length}
                                        </Text>
                                    </VStack>
                                    <Circle size="12" bg="blue.100" color="blue.500">
                                        <Icon><FaTags /></Icon>
                                    </Circle>
                                </HStack>
                            </Card.Body>
                        </Card.Root>

                        <Card.Root
                            bg={cardBg}
                            border="1px solid"
                            borderColor={borderColor}
                            shadow={shadowColor}
                            _hover={{ transform: 'translateY(-2px)', shadow: 'xl' }}
                            transition="all 0.2s"
                        >
                            <Card.Body p={6}>
                                <HStack justify="space-between">
                                    <VStack align="start" gap={1}>
                                        <Text color={mutedTextColor} fontSize="sm" fontWeight="medium">
                                            Low Stock Items
                                        </Text>
                                        <Text fontSize="2xl" fontWeight="bold" color="orange.500">
                                            {lowStockProducts.length}
                                        </Text>
                                    </VStack>
                                    <Circle size="12" bg="orange.100" color="orange.500">
                                        <Icon><FaExclamationTriangle /></Icon>
                                    </Circle>
                                </HStack>
                            </Card.Body>
                        </Card.Root>

                        <Card.Root
                            bg={cardBg}
                            border="1px solid"
                            borderColor={borderColor}
                            shadow={shadowColor}
                            _hover={{ transform: 'translateY(-2px)', shadow: 'xl' }}
                            transition="all 0.2s"
                        >
                            <Card.Body p={6}>
                                <HStack justify="space-between">
                                    <VStack align="start" gap={1}>
                                        <Text color={mutedTextColor} fontSize="sm" fontWeight="medium">
                                            Out of Stock
                                        </Text>
                                        <Text fontSize="2xl" fontWeight="bold" color="red.500">
                                            {outOfStockCount}
                                        </Text>
                                    </VStack>
                                    <Circle size="12" bg="red.100" color="red.500">
                                        <Icon><FaBox /></Icon>
                                    </Circle>
                                </HStack>
                            </Card.Body>
                        </Card.Root>

                        <Card.Root
                            bg={cardBg}
                            border="1px solid"
                            borderColor={borderColor}
                            shadow={shadowColor}
                            _hover={{ transform: 'translateY(-2px)', shadow: 'xl' }}
                            transition="all 0.2s"
                        >
                            <Card.Body p={6}>
                                <HStack justify="space-between">
                                    <VStack align="start" gap={1}>
                                        <Text color={mutedTextColor} fontSize="sm" fontWeight="medium">
                                            Inventory Value
                                        </Text>
                                        <Text fontSize="2xl" fontWeight="bold" color="green.500">
                                            GHC {totalValue.toFixed(2)}
                                        </Text>
                                    </VStack>
                                    <Circle size="12" bg="green.100" color="green.500">
                                        <Icon><FaDollarSign /></Icon>
                                    </Circle>
                                </HStack>
                            </Card.Body>
                        </Card.Root>
                    </Grid>

                    {/* Filters Section */}
                    <Card.Root
                        bg={cardBg}
                        shadow={shadowColor}
                        border="1px solid"
                        borderColor={borderColor}
                        borderRadius="xl"
                    >
                        <Card.Body p={6}>
                            <VStack gap={4}>
                                <HStack w="100%" justify="space-between">
                                    <HStack>
                                        <Circle size="8" bg="purple.100" color="purple.600">
                                            <Icon><FaFilter /></Icon>
                                        </Circle>
                                        <Text fontSize="lg" fontWeight="semibold" color={textColor}>
                                            Filter & Search
                                        </Text>
                                    </HStack>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={fetchProducts}
                                        borderColor={borderColor}
                                        color={textColor}
                                    >
                                        <FaSearch />
                                        Refresh
                                    </Button>
                                </HStack>

                                <Grid templateColumns={['1fr', '1fr', 'repeat(3, 1fr)']} gap={4} w="100%">
                                    <Field.Root>
                                        <Field.Label color={textColor} fontWeight="medium" fontSize="sm">
                                            Search Products
                                        </Field.Label>
                                        <Input
                                            placeholder="Search by name, SKU..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            bg={cardBg}
                                            border="1px solid"
                                            borderColor={borderColor}
                                            _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px blue.500' }}
                                            size="lg"
                                        />
                                    </Field.Root>

                                    <Field.Root>
                                        <Field.Label color={textColor} fontWeight="medium" fontSize="sm">
                                            Category
                                        </Field.Label>
                                        <Select.Root
                                            collection={categoryOptions}
                                            value={categoryFilter ? [categoryFilter] : []}
                                            onValueChange={(e) => setCategoryFilter(e.value[0] || '')}
                                        >
                                            <Select.HiddenSelect />
                                            <Select.Control>
                                                <Select.Trigger
                                                    bg={cardBg}
                                                    border="1px solid"
                                                    borderColor={borderColor}
                                                    _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px blue.500' }}
                                                >
                                                    <Select.ValueText placeholder="All Categories" />
                                                </Select.Trigger>
                                                <Select.IndicatorGroup>
                                                    <Select.Indicator />
                                                </Select.IndicatorGroup>
                                            </Select.Control>
                                            <Portal>
                                                <Select.Positioner>
                                                    <Select.Content bg={cardBg} border="1px solid" borderColor={borderColor}>
                                                        {categoryOptions.items.map((item) => (
                                                            <Select.Item item={item} key={item.value}>
                                                                {item.label}
                                                                <Select.ItemIndicator />
                                                            </Select.Item>
                                                        ))}
                                                    </Select.Content>
                                                </Select.Positioner>
                                            </Portal>
                                        </Select.Root>
                                    </Field.Root>

                                    <Field.Root>
                                        <Field.Label color={textColor} fontWeight="medium" fontSize="sm">
                                            Stock Status
                                        </Field.Label>
                                        <Select.Root
                                            collection={stockOptions}
                                            value={stockFilter ? [stockFilter] : []}
                                            onValueChange={(e) => setStockFilter(e.value[0] || '')}
                                        >
                                            <Select.HiddenSelect />
                                            <Select.Control>
                                                <Select.Trigger
                                                    bg={cardBg}
                                                    border="1px solid"
                                                    borderColor={borderColor}
                                                    _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px blue.500' }}
                                                >
                                                    <Select.ValueText placeholder="All Products" />
                                                </Select.Trigger>
                                                <Select.IndicatorGroup>
                                                    <Select.Indicator />
                                                </Select.IndicatorGroup>
                                            </Select.Control>
                                            <Portal>
                                                <Select.Positioner>
                                                    <Select.Content bg={cardBg} border="1px solid" borderColor={borderColor}>
                                                        {stockOptions.items.map((item) => (
                                                            <Select.Item item={item} key={item.value}>
                                                                {item.label}
                                                                <Select.ItemIndicator />
                                                            </Select.Item>
                                                        ))}
                                                    </Select.Content>
                                                </Select.Positioner>
                                            </Portal>
                                        </Select.Root>
                                    </Field.Root>
                                </Grid>
                            </VStack>
                        </Card.Body>
                    </Card.Root>

                    {/* Stock Alerts */}
                    {lowStockProducts.length > 0 && (
                        <Alert.Root
                            status="warning"
                            title="Low Stock Alert"
                            bg={alertBg}
                            border="1px solid"
                            borderColor="orange.200"
                            borderRadius="xl"
                        >
                            <Alert.Indicator />
                            <VStack align="start" gap={2}>
                                <Alert.Title color="orange.600" fontWeight="bold">
                                    {lowStockProducts.length} products are running low on stock
                                </Alert.Title>
                                <Text color="orange.600" fontSize="sm">
                                    Products: {lowStockProducts.map(p => p.title).join(', ')}
                                </Text>
                            </VStack>
                        </Alert.Root>
                    )}

                    {/* Products Table */}
                    <Card.Root
                        bg={cardBg}
                        shadow={shadowColor}
                        border="1px solid"
                        borderColor={borderColor}
                        borderRadius="xl"
                        overflow="hidden"
                    >
                        <Card.Body p={0}>
                            <Box overflowX="auto">
                                <Table.Root>
                                    <Table.Header bg={tableBg}>
                                        <Table.Row>
                                            <Table.ColumnHeader color={textColor} fontWeight="bold" py={4} px={6}>
                                                Product
                                            </Table.ColumnHeader>
                                            <Table.ColumnHeader color={textColor} fontWeight="bold">
                                                SKU
                                            </Table.ColumnHeader>
                                            <Table.ColumnHeader color={textColor} fontWeight="bold">
                                                Category
                                            </Table.ColumnHeader>
                                            <Table.ColumnHeader color={textColor} fontWeight="bold">
                                                Price
                                            </Table.ColumnHeader>
                                            <Table.ColumnHeader color={textColor} fontWeight="bold">
                                                Stock
                                            </Table.ColumnHeader>
                                            <Table.ColumnHeader color={textColor} fontWeight="bold">
                                                Status
                                            </Table.ColumnHeader>
                                            <Table.ColumnHeader color={textColor} fontWeight="bold">
                                                Actions
                                            </Table.ColumnHeader>
                                        </Table.Row>
                                    </Table.Header>
                                    <Table.Body>
                                        {products.map((product, index) => (
                                            <Table.Row
                                                key={product.id}
                                                bg={index % 2 === 0 ? cardBg : productBg}
                                                _hover={{ bg: productTextColor }}
                                                transition="background 0.2s"
                                            >
                                                <Table.Cell py={4} px={6}>
                                                    <HStack gap={3}>
                                                        <Box position="relative">
                                                            <Image
                                                                src={product.image}
                                                                alt={product.title}
                                                                boxSize="60px"
                                                                objectFit="cover"
                                                                borderRadius="lg"
                                                                border="1px solid"
                                                                borderColor={borderColor}
                                                            />
                                                            {!product.inStock && (
                                                                <Box
                                                                    position="absolute"
                                                                    top="0"
                                                                    left="0"
                                                                    right="0"
                                                                    bottom="0"
                                                                    bg="blackAlpha.600"
                                                                    borderRadius="lg"
                                                                    display="flex"
                                                                    alignItems="center"
                                                                    justifyContent="center"
                                                                >
                                                                    <Text color="white" fontSize="xs" fontWeight="bold">
                                                                        OUT
                                                                    </Text>
                                                                </Box>
                                                            )}
                                                        </Box>
                                                        <VStack align="start" gap={1}>
                                                            <Text fontWeight="semibold" color={textColor}>
                                                                {product.title}
                                                            </Text>
                                                            <Text fontSize="sm" color={mutedTextColor}>
                                                                {product.description.substring(0, 50)}...
                                                            </Text>
                                                        </VStack>
                                                    </HStack>
                                                </Table.Cell>
                                                <Table.Cell>
                                                    <Text fontFamily="mono" fontSize="sm" color={mutedTextColor} bg={productBg} px={2} py={1} borderRadius="md">
                                                        {product.sku}
                                                    </Text>
                                                </Table.Cell>
                                                <Table.Cell>
                                                    <Badge
                                                        colorPalette="blue"
                                                        px={3}
                                                        py={1}
                                                        borderRadius="full"
                                                        fontSize="xs"
                                                        fontWeight="medium"
                                                    >
                                                        {product.category}
                                                    </Badge>
                                                </Table.Cell>
                                                <Table.Cell>
                                                    <VStack align="start" gap={1}>
                                                        <Text fontWeight="bold" color="green.500" fontSize="lg">
                                                            GHC {product.price}
                                                        </Text>
                                                        <Text fontSize="xs" color={mutedTextColor}>
                                                            Cost: GHC {product.cost}
                                                        </Text>
                                                    </VStack>
                                                </Table.Cell>
                                                <Table.Cell>
                                                    <VStack align="start" gap={2}>
                                                        <HStack>
                                                            <Text
                                                                fontWeight="bold"
                                                                color={product.stock <= product.minStockLevel ? 'red.500' : 'green.500'}
                                                                fontSize="lg"
                                                            >
                                                                {product.stock}
                                                            </Text>
                                                            <Text color={mutedTextColor} fontSize="sm">
                                                                {product.unit}
                                                            </Text>
                                                            {product.stock <= product.minStockLevel && (
                                                                <Circle size="5" bg="orange.100" color="orange.500">
                                                                    <Icon fontSize="xs"><FaExclamationTriangle /></Icon>
                                                                </Circle>
                                                            )}
                                                        </HStack>
                                                        <Text fontSize="xs" color={mutedTextColor}>
                                                            Min: {product.minStockLevel}
                                                        </Text>
                                                    </VStack>
                                                </Table.Cell>
                                                <Table.Cell>
                                                    <VStack align="start" gap={2}>
                                                        <Badge
                                                            colorPalette={product.inStock ? 'green' : 'red'}
                                                            px={3}
                                                            py={1}
                                                            borderRadius="full"
                                                            fontSize="xs"
                                                            fontWeight="medium"
                                                        >
                                                            {product.inStock ? 'In Stock' : 'Out of Stock'}
                                                        </Badge>
                                                        <Badge
                                                            colorPalette={product.isActive ? 'blue' : 'gray'}
                                                            px={3}
                                                            py={1}
                                                            borderRadius="full"
                                                            fontSize="xs"
                                                            fontWeight="medium"
                                                        >
                                                            {product.isActive ? 'Active' : 'Inactive'}
                                                        </Badge>
                                                    </VStack>
                                                </Table.Cell>
                                                <Table.Cell>
                                                    <HStack gap={2}>
                                                        <IconButton
                                                            size="sm"
                                                            variant="outline"
                                                            colorPalette="blue"
                                                            aria-label="View product"
                                                            borderColor={borderColor}
                                                            _hover={{ bg: 'blue.50', borderColor: 'blue.300' }}
                                                        >
                                                            <FaEye />
                                                        </IconButton>
                                                        <IconButton
                                                            size="sm"
                                                            variant="outline"
                                                            colorPalette="purple"
                                                            aria-label="Edit product"
                                                            borderColor={borderColor}
                                                            _hover={{ bg: 'purple.50', borderColor: 'purple.300' }}
                                                            onClick={() => {
                                                                setSelectedProduct(product);
                                                                setIsEditOpen(true);
                                                            }}
                                                        >
                                                            <FaEdit />
                                                        </IconButton>
                                                        <IconButton
                                                            size="sm"
                                                            variant="outline"
                                                            colorPalette="green"
                                                            aria-label="Update stock"
                                                            borderColor={borderColor}
                                                            _hover={{ bg: 'green.50', borderColor: 'green.300' }}
                                                            onClick={() => {
                                                                setSelectedProduct(product);
                                                                setIsStockOpen(true);
                                                            }}
                                                        >
                                                            <FaBox />
                                                        </IconButton>
                                                        <IconButton
                                                            size="sm"
                                                            variant="outline"
                                                            colorPalette="red"
                                                            aria-label="Delete product"
                                                            borderColor={borderColor}
                                                            _hover={{ bg: 'red.50', borderColor: 'red.300' }}
                                                            onClick={() => handleDeleteProduct(product.id)}
                                                        >
                                                            <FaTrash />
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

                    {/* Empty State */}
                    {products.length === 0 && (
                        <Card.Root
                            bg={cardBg}
                            shadow={shadowColor}
                            border="1px solid"
                            borderColor={borderColor}
                            borderRadius="xl"
                        >
                            <Card.Body textAlign="center" py={16}>
                                <VStack gap={4}>
                                    <Circle size="20" bg={productBg} color={mutedTextColor}>
                                        <Icon fontSize="2xl"><FaBox /></Icon>
                                    </Circle>
                                    <VStack gap={2}>
                                        <Text fontSize="xl" fontWeight="bold" color={textColor}>
                                            No products found
                                        </Text>
                                        <Text color={mutedTextColor} maxW="md">
                                            Try adjusting your filters or add some products to get started
                                        </Text>
                                    </VStack>
                                    <Link href="/admin/products/new">
                                        <Button
                                            bg="blue.500"
                                            color="white"
                                            _hover={{ bg: 'blue.600' }}
                                            mt={4}
                                        >
                                            <FaPlus />
                                            Add Your First Product
                                        </Button>
                                    </Link>
                                </VStack>
                            </Card.Body>
                        </Card.Root>
                    )}
                </VStack>
            </Container>

            <StockUpdateModal />
        </Box>
    );
}
