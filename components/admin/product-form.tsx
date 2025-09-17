'use client'
import { useState } from 'react';
import {
    Box,
    Button,
    Card,
    Field,
    Input,
    Textarea,
    NumberInput,
    Switch,
    VStack,
    HStack,
    Grid,
    Text,
    Image,
    Portal,
    Select,
    createListCollection
} from '@chakra-ui/react';
import { Product } from '@/types/admin';
import { useRouter } from 'next/navigation';

interface ProductFormProps {
    product?: Product;
    isEditing?: boolean;
}

export default function ProductForm({ product, isEditing = false }: ProductFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: product?.title || '',
        description: product?.description || '',
        price: product?.price || 0,
        cost: product?.cost || 0,
        category: product?.category || '',
        sku: product?.sku || '',
        stock: product?.stock || 0,
        minStockLevel: product?.minStockLevel || 5,
        unit: product?.unit || 'piece',
        weight: product?.weight || 0,
        supplier: product?.supplier || '',
        isActive: product?.isActive ?? true,
        isFeatured: product?.isFeatured ?? false,
        tags: product?.tags?.join(', ') || '',
        image: product?.image || ''
    });

    // Create collections for select options
    const categories = createListCollection({
        items: [
            { label: "Select Category", value: "" },
            { label: "Poultry", value: "Poultry" },
            { label: "Meat", value: "Meat" },
            { label: "SeaFood", value: "SeaFood" },
            { label: "Turkey", value: "Turkey" },
            { label: "Processed Meat", value: "Processed" },
            { label: "Beef", value: "Beef" },
        ],
    });

    const units = createListCollection({
        items: [
            { label: "Piece", value: "piece" },
            { label: "Kilogram", value: "kg" },
            { label: "Pack", value: "pack" },
        ],
    }); const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const productData = {
                ...formData,
                tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
                price: Number(formData.price),
                cost: Number(formData.cost),
                stock: Number(formData.stock),
                minStockLevel: Number(formData.minStockLevel),
                weight: Number(formData.weight)
            };

            const url = isEditing ? `/api/admin/products/${product?.id}` : '/api/admin/products';
            const method = isEditing ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData)
            });

            const data = await response.json();

            if (data.success) {
                router.push('/admin/products');
            } else {
                alert('Failed to save product: ' + data.error);
            }
        } catch (error) {
            alert('Failed to save product');
            console.error('Error saving product:', error);
        } finally {
            setLoading(false);
        }
    };

    const generateSKU = () => {
        const prefix = formData.category.substring(0, 3).toUpperCase();
        const timestamp = Date.now().toString().slice(-6);
        setFormData({ ...formData, sku: `${prefix}${timestamp}` });
    };

    return (
        <Box p={6} bg="gray.50" minH="100vh">
            <VStack align="start" gap={6} maxW="4xl" mx="auto">
                <HStack justify="space-between" w="100%">
                    <Text fontSize="2xl" fontWeight="bold">
                        {isEditing ? 'Edit Product' : 'Add New Product'}
                    </Text>
                    <Button variant="outline" onClick={() => router.back()}>
                        Cancel
                    </Button>
                </HStack>

                <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                    <VStack gap={6}>
                        {/* Basic Information */}
                        <Card.Root bg="white" shadow="sm" w="100%">
                            <Card.Header>
                                <Text fontSize="lg" fontWeight="semibold">Basic Information</Text>
                            </Card.Header>
                            <Card.Body>
                                <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
                                    <Field.Root required>
                                        <Field.Label>Product Name</Field.Label>
                                        <Input
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            placeholder="Enter product name"
                                        />
                                    </Field.Root>

                                    <Field.Root required>
                                        <Field.Label>Category</Field.Label>
                                        <Select.Root
                                            collection={categories}
                                            value={[formData.category]}
                                            onValueChange={(e) => setFormData({ ...formData, category: e.value[0] })}
                                        >
                                            <Select.HiddenSelect />
                                            <Select.Control>
                                                <Select.Trigger>
                                                    <Select.ValueText placeholder="Select Category" />
                                                </Select.Trigger>
                                                <Select.IndicatorGroup>
                                                    <Select.Indicator />
                                                </Select.IndicatorGroup>
                                            </Select.Control>
                                            <Portal>
                                                <Select.Positioner>
                                                    <Select.Content>
                                                        {categories.items.map((category) => (
                                                            <Select.Item item={category} key={category.value}>
                                                                {category.label}
                                                                <Select.ItemIndicator />
                                                            </Select.Item>
                                                        ))}
                                                    </Select.Content>
                                                </Select.Positioner>
                                            </Portal>
                                        </Select.Root>
                                    </Field.Root>

                                    <Field.Root required gridColumn={{ base: '1', md: 'span 2' }}>
                                        <Field.Label>Description</Field.Label>
                                        <Textarea
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            placeholder="Enter product description"
                                            rows={3}
                                        />
                                    </Field.Root>
                                </Grid>
                            </Card.Body>
                        </Card.Root>

                        {/* Pricing & Inventory */}
                        <Card.Root bg="white" shadow="sm" w="100%">
                            <Card.Header>
                                <Text fontSize="lg" fontWeight="semibold">Pricing & Inventory</Text>
                            </Card.Header>
                            <Card.Body>
                                <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={4}>
                                    <Field.Root required>
                                        <Field.Label>Selling Price (GHC)</Field.Label>
                                        <NumberInput.Root
                                            value={formData.price.toString()}
                                            onValueChange={(e) => setFormData({ ...formData, price: Number(e.value) })}
                                            min={0}
                                        >
                                            <NumberInput.Control />
                                            <NumberInput.Input />
                                        </NumberInput.Root>
                                    </Field.Root>

                                    <Field.Root required>
                                        <Field.Label>Cost Price (GHC)</Field.Label>
                                        <NumberInput.Root
                                            value={formData.cost.toString()}
                                            onValueChange={(e) => setFormData({ ...formData, cost: Number(e.value) })}
                                            min={0}
                                        >
                                            <NumberInput.Control />
                                            <NumberInput.Input />
                                        </NumberInput.Root>
                                    </Field.Root>

                                    <Field.Root>
                                        <Field.Label>Profit Margin</Field.Label>
                                        <Text fontWeight="bold" color="green.600" p={2} bg="green.50" borderRadius="md">
                                            {formData.price && formData.cost
                                                ? `${(((formData.price - formData.cost) / formData.cost) * 100).toFixed(1)}%`
                                                : '0%'
                                            }
                                        </Text>
                                    </Field.Root>

                                    <Field.Root required>
                                        <Field.Label>Current Stock</Field.Label>
                                        <NumberInput.Root
                                            value={formData.stock.toString()}
                                            onValueChange={(e) => setFormData({ ...formData, stock: Number(e.value) })}
                                            min={0}
                                        >
                                            <NumberInput.Control />
                                            <NumberInput.Input />
                                        </NumberInput.Root>
                                    </Field.Root>

                                    <Field.Root required>
                                        <Field.Label>Unit</Field.Label>
                                        <Select.Root
                                            collection={units}
                                            value={[formData.unit]}
                                            onValueChange={(e) => setFormData({ ...formData, unit: e.value[0] as 'kg' | 'piece' | 'pack' })}
                                        >
                                            <Select.HiddenSelect />
                                            <Select.Control>
                                                <Select.Trigger>
                                                    <Select.ValueText />
                                                </Select.Trigger>
                                                <Select.IndicatorGroup>
                                                    <Select.Indicator />
                                                </Select.IndicatorGroup>
                                            </Select.Control>
                                            <Portal>
                                                <Select.Positioner>
                                                    <Select.Content>
                                                        {units.items.map((unit) => (
                                                            <Select.Item item={unit} key={unit.value}>
                                                                {unit.label}
                                                                <Select.ItemIndicator />
                                                            </Select.Item>
                                                        ))}
                                                    </Select.Content>
                                                </Select.Positioner>
                                            </Portal>
                                        </Select.Root>
                                    </Field.Root>

                                    <Field.Root required>
                                        <Field.Label>Low Stock Alert Level</Field.Label>
                                        <NumberInput.Root
                                            value={formData.minStockLevel.toString()}
                                            onValueChange={(e) => setFormData({ ...formData, minStockLevel: Number(e.value) })}
                                            min={0}
                                        >
                                            <NumberInput.Control />
                                            <NumberInput.Input />
                                        </NumberInput.Root>
                                    </Field.Root>
                                </Grid>
                            </Card.Body>
                        </Card.Root>

                        {/* Product Details */}
                        <Card.Root bg="white" shadow="sm" w="100%">
                            <Card.Header>
                                <Text fontSize="lg" fontWeight="semibold">Product Details</Text>
                            </Card.Header>
                            <Card.Body>
                                <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
                                    <Field.Root required>
                                        <Field.Label>
                                            SKU (Stock Keeping Unit)
                                            <Button size="xs" ml={2} onClick={generateSKU}>
                                                Generate
                                            </Button>
                                        </Field.Label>
                                        <Input
                                            value={formData.sku}
                                            onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                                            placeholder="e.g., POU001"
                                            fontFamily="mono"
                                        />
                                    </Field.Root>

                                    <Field.Root>
                                        <Field.Label>Weight (kg)</Field.Label>
                                        <NumberInput.Root
                                            value={formData.weight.toString()}
                                            onValueChange={(e) => setFormData({ ...formData, weight: Number(e.value) })}
                                            min={0}
                                        >
                                            <NumberInput.Control />
                                            <NumberInput.Input />
                                        </NumberInput.Root>
                                    </Field.Root>

                                    <Field.Root>
                                        <Field.Label>Supplier</Field.Label>
                                        <Input
                                            value={formData.supplier}
                                            onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                                            placeholder="Enter supplier name"
                                        />
                                    </Field.Root>

                                    <Field.Root>
                                        <Field.Label>Tags (comma separated)</Field.Label>
                                        <Input
                                            value={formData.tags}
                                            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                            placeholder="fresh, organic, premium"
                                        />
                                    </Field.Root>

                                    <Field.Root gridColumn={{ base: '1', md: 'span 2' }}>
                                        <Field.Label>Product Image URL</Field.Label>
                                        <Input
                                            value={formData.image}
                                            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                            placeholder="/img-1.jpeg or full URL"
                                        />
                                        {formData.image && (
                                            <Box mt={2}>
                                                <Image
                                                    src={formData.image}
                                                    alt="Preview"
                                                    boxSize="100px"
                                                    objectFit="cover"
                                                    borderRadius="md"
                                                />
                                            </Box>
                                        )}
                                    </Field.Root>
                                </Grid>
                            </Card.Body>
                        </Card.Root>

                        {/* Settings */}
                        <Card.Root bg="white" shadow="sm" w="100%">
                            <Card.Header>
                                <Text fontSize="lg" fontWeight="semibold">Settings</Text>
                            </Card.Header>
                            <Card.Body>
                                <VStack align="start" gap={4}>
                                    <HStack justify="space-between" w="100%">
                                        <VStack align="start" gap={0}>
                                            <Text fontWeight="medium">Active Status</Text>
                                            <Text fontSize="sm" color="gray.600">
                                                Product will be visible to customers
                                            </Text>
                                        </VStack>
                                        <Switch.Root
                                            checked={formData.isActive}
                                            onCheckedChange={(e) => setFormData({ ...formData, isActive: !!e.checked })}
                                            colorPalette="green"
                                        >
                                            <Switch.HiddenInput />
                                            <Switch.Control />
                                        </Switch.Root>
                                    </HStack>

                                    <HStack justify="space-between" w="100%">
                                        <VStack align="start" gap={0}>
                                            <Text fontWeight="medium">Featured Product</Text>
                                            <Text fontSize="sm" color="gray.600">
                                                Show in featured products section
                                            </Text>
                                        </VStack>
                                        <Switch.Root
                                            checked={formData.isFeatured}
                                            onCheckedChange={(e) => setFormData({ ...formData, isFeatured: !!e.checked })}
                                            colorPalette="blue"
                                        >
                                            <Switch.HiddenInput />
                                            <Switch.Control />
                                        </Switch.Root>
                                    </HStack>

                                    {formData.stock <= formData.minStockLevel && (
                                        <Box p={3} bg="orange.50" borderRadius="md" borderLeft="4px" borderColor="orange.400">
                                            <Text color="orange.800">
                                                Warning: Current stock ({formData.stock}) is at or below the low stock alert level ({formData.minStockLevel})
                                            </Text>
                                        </Box>
                                    )}
                                </VStack>
                            </Card.Body>
                        </Card.Root>

                        {/* Actions */}
                        <Card.Root bg="white" shadow="sm" w="100%">
                            <Card.Body>
                                <HStack justify="space-between">
                                    <Button variant="outline" onClick={() => router.back()}>
                                        Cancel
                                    </Button>
                                    <HStack>
                                        <Button
                                            type="submit"
                                            bg="green.600"
                                            color="white"
                                            loading={loading}
                                            loadingText={isEditing ? "Updating..." : "Creating..."}
                                        >
                                            {isEditing ? 'Update Product' : 'Create Product'}
                                        </Button>
                                    </HStack>
                                </HStack>
                            </Card.Body>
                        </Card.Root>
                    </VStack>
                </form>
            </VStack>
        </Box>
    );
}
