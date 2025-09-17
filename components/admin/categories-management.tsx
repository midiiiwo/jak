'use client'
import { useState, useEffect } from 'react';
import {
    Box,
    VStack,
    HStack,
    Text,
    Button,
    Icon,
    Badge,
    Portal,
    Dialog,
    CloseButton,
    Input,
    Textarea,
    Card,
    Grid,
    Separator,
    IconButton,
} from '@chakra-ui/react';
import { useColorModeValue } from "@/components/ui/color-mode";
import { toaster } from "@/components/ui/toaster";
import {
    FaPlus,
    FaEdit,
    FaTrash,
    FaTag,
    FaBoxes,
    FaEye,
    FaEyeSlash,
} from 'react-icons/fa';

interface Category {
    id: string;
    name: string;
    description: string;
    slug: string;
    isActive: boolean;
    productCount: number;
    createdAt: string;
    updatedAt: string;
}

export default function CategoriesManagement() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterActive, setFilterActive] = useState<boolean | null>(null);

    // Color mode values
    const bgColor = useColorModeValue('gray.50', 'gray.900');
    const cardBg = useColorModeValue('white', 'gray.800');
    const textColor = useColorModeValue('gray.800', 'white');
    const mutedColor = useColorModeValue('gray.600', 'gray.400');
    const borderColor = useColorModeValue('gray.200', 'gray.700');

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/admin/categories');
            const data = await response.json();
            if (data.success) {
                setCategories(data.categories);
            }
        } catch (error) {
            console.error('Failed to fetch categories:', error);
            toaster.error({
                title: "Error",
                description: "Failed to fetch categories",
                duration: 3000,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCreateCategory = () => {
        setEditingCategory(null);
        setIsDialogOpen(true);
    };

    const handleEditCategory = (category: Category) => {
        setEditingCategory(category);
        setIsDialogOpen(true);
    };

    const handleDeleteCategory = async (categoryId: string) => {
        if (!confirm('Are you sure you want to delete this category?')) return;

        try {
            const response = await fetch(`/api/admin/categories/${categoryId}`, {
                method: 'DELETE',
            });
            const data = await response.json();

            if (data.success) {
                toaster.success({
                    title: "Success",
                    description: "Category deleted successfully",
                    duration: 3000,
                });
                fetchCategories();
            } else {
                throw new Error(data.error);
            }
        } catch (error) {
            console.error('Delete category error:', error);
            toaster.error({
                title: "Error",
                description: "Failed to delete category",
                duration: 3000,
            });
        }
    };

    const handleToggleStatus = async (categoryId: string, isActive: boolean) => {
        try {
            const response = await fetch(`/api/admin/categories/${categoryId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isActive: !isActive }),
            });
            const data = await response.json();

            if (data.success) {
                toaster.success({
                    title: "Success",
                    description: `Category ${!isActive ? 'activated' : 'deactivated'} successfully`,
                    duration: 3000,
                });
                fetchCategories();
            } else {
                throw new Error(data.error);
            }
        } catch (error) {
            console.error('Toggle status error:', error);
            toaster.error({
                title: "Error",
                description: "Failed to update category status",
                duration: 3000,
            });
        }
    };

    const filteredCategories = categories.filter(category => {
        const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            category.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterActive === null || category.isActive === filterActive;
        return matchesSearch && matchesFilter;
    });

    if (loading) {
        return (
            <Box p={8} bg={bgColor} minH="100vh">
                <VStack gap={4} align="center" justify="center" minH="400px">
                    <Text fontSize="lg" color={mutedColor}>Loading categories...</Text>
                </VStack>
            </Box>
        );
    }

    return (
        <Box p={8} bg={bgColor} minH="100vh">
            <VStack gap={8} align="stretch">
                {/* Header */}
                <HStack justify="space-between" align="center">
                    <VStack align="start" gap={2}>
                        <Text fontSize="3xl" fontWeight="bold" color={textColor}>
                            Categories Management
                        </Text>
                        <Text color={mutedColor}>
                            Manage your product categories and organize your inventory
                        </Text>
                    </VStack>
                    <Button
                        onClick={handleCreateCategory}
                        bg="green.600"
                        color="white"
                        _hover={{ bg: 'green.700' }}
                        size="lg"
                    >
                        <FaPlus />
                        Add Category
                    </Button>
                </HStack>

                {/* Stats Cards */}
                <Grid templateColumns={{ base: "1fr", md: "repeat(4, 1fr)" }} gap={6}>
                    <Card.Root bg={cardBg} borderColor={borderColor}>
                        <Card.Body p={6}>
                            <HStack justify="space-between">
                                <VStack align="start" gap={1}>
                                    <Text fontSize="sm" color={mutedColor}>Total Categories</Text>
                                    <Text fontSize="2xl" fontWeight="bold" color={textColor}>
                                        {categories.length}
                                    </Text>
                                </VStack>
                                <Icon color="blue.500" boxSize={8}>
                                    <FaTag />
                                </Icon>
                            </HStack>
                        </Card.Body>
                    </Card.Root>

                    <Card.Root bg={cardBg} borderColor={borderColor}>
                        <Card.Body p={6}>
                            <HStack justify="space-between">
                                <VStack align="start" gap={1}>
                                    <Text fontSize="sm" color={mutedColor}>Active Categories</Text>
                                    <Text fontSize="2xl" fontWeight="bold" color="green.500">
                                        {categories.filter(c => c.isActive).length}
                                    </Text>
                                </VStack>
                                <Icon color="green.500" boxSize={8}>
                                    <FaEye />
                                </Icon>
                            </HStack>
                        </Card.Body>
                    </Card.Root>

                    <Card.Root bg={cardBg} borderColor={borderColor}>
                        <Card.Body p={6}>
                            <HStack justify="space-between">
                                <VStack align="start" gap={1}>
                                    <Text fontSize="sm" color={mutedColor}>Inactive Categories</Text>
                                    <Text fontSize="2xl" fontWeight="bold" color="red.500">
                                        {categories.filter(c => !c.isActive).length}
                                    </Text>
                                </VStack>
                                <Icon color="red.500" boxSize={8}>
                                    <FaEyeSlash />
                                </Icon>
                            </HStack>
                        </Card.Body>
                    </Card.Root>

                    <Card.Root bg={cardBg} borderColor={borderColor}>
                        <Card.Body p={6}>
                            <HStack justify="space-between">
                                <VStack align="start" gap={1}>
                                    <Text fontSize="sm" color={mutedColor}>Total Products</Text>
                                    <Text fontSize="2xl" fontWeight="bold" color={textColor}>
                                        {categories.reduce((sum, c) => sum + c.productCount, 0)}
                                    </Text>
                                </VStack>
                                <Icon color="purple.500" boxSize={8}>
                                    <FaBoxes />
                                </Icon>
                            </HStack>
                        </Card.Body>
                    </Card.Root>
                </Grid>

                {/* Filters and Search */}
                <Card.Root bg={cardBg} borderColor={borderColor}>
                    <Card.Body p={6}>
                        <HStack gap={4} flexWrap="wrap">
                            <Box flex="1" minW="300px">
                                <Input
                                    placeholder="Search categories..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </Box>
                            <HStack gap={2}>
                                <Button
                                    variant={filterActive === null ? "solid" : "outline"}
                                    onClick={() => setFilterActive(null)}
                                    size="sm"
                                >
                                    All
                                </Button>
                                <Button
                                    variant={filterActive === true ? "solid" : "outline"}
                                    colorPalette="green"
                                    onClick={() => setFilterActive(true)}
                                    size="sm"
                                >
                                    Active
                                </Button>
                                <Button
                                    variant={filterActive === false ? "solid" : "outline"}
                                    colorPalette="red"
                                    onClick={() => setFilterActive(false)}
                                    size="sm"
                                >
                                    Inactive
                                </Button>
                            </HStack>
                        </HStack>
                    </Card.Body>
                </Card.Root>

                {/* Categories Grid */}
                {filteredCategories.length === 0 ? (
                    <Card.Root bg={cardBg} borderColor={borderColor}>
                        <Card.Body p={12}>
                            <VStack gap={4} align="center">
                                <Icon color={mutedColor} boxSize={16}>
                                    <FaTag />
                                </Icon>
                                <Text fontSize="xl" fontWeight="semibold" color={textColor}>
                                    No categories found
                                </Text>
                                <Text color={mutedColor} textAlign="center">
                                    {searchTerm || filterActive !== null
                                        ? "Try adjusting your search or filter criteria"
                                        : "Get started by creating your first category"
                                    }
                                </Text>
                                {!searchTerm && filterActive === null && (
                                    <Button
                                        onClick={handleCreateCategory}
                                        bg="green.600"
                                        color="white"
                                        _hover={{ bg: 'green.700' }}
                                    >
                                        <FaPlus />
                                        Create Category
                                    </Button>
                                )}
                            </VStack>
                        </Card.Body>
                    </Card.Root>
                ) : (
                    <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} gap={6}>
                        {filteredCategories.map((category) => (
                            <Card.Root
                                key={category.id}
                                bg={cardBg}
                                borderColor={borderColor}
                                transition="all 0.2s"
                                _hover={{ transform: "translateY(-2px)", shadow: "lg" }}
                            >
                                <Card.Body p={6}>
                                    <VStack align="start" gap={4}>
                                        <HStack justify="space-between" w="100%">
                                            <Badge
                                                colorPalette={category.isActive ? "green" : "red"}
                                                fontSize="xs"
                                            >
                                                {category.isActive ? "Active" : "Inactive"}
                                            </Badge>
                                            <HStack gap={1}>
                                                <IconButton
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => handleEditCategory(category)}
                                                    aria-label="Edit category"
                                                >
                                                    <FaEdit />
                                                </IconButton>
                                                <IconButton
                                                    size="sm"
                                                    variant="ghost"
                                                    colorPalette={category.isActive ? "red" : "green"}
                                                    onClick={() => handleToggleStatus(category.id, category.isActive)}
                                                    aria-label={category.isActive ? "Deactivate" : "Activate"}
                                                >
                                                    {category.isActive ? <FaEyeSlash /> : <FaEye />}
                                                </IconButton>
                                                <IconButton
                                                    size="sm"
                                                    variant="ghost"
                                                    colorPalette="red"
                                                    onClick={() => handleDeleteCategory(category.id)}
                                                    aria-label="Delete category"
                                                >
                                                    <FaTrash />
                                                </IconButton>
                                            </HStack>
                                        </HStack>

                                        <VStack align="start" gap={2} w="100%">
                                            <Text fontSize="lg" fontWeight="bold" color={textColor}>
                                                {category.name}
                                            </Text>
                                            <Text fontSize="sm" color={mutedColor}>
                                                {category.description}
                                            </Text>
                                        </VStack>

                                        <Separator />

                                        <HStack justify="space-between" w="100%">
                                            <VStack align="start" gap={0}>
                                                <Text fontSize="xs" color={mutedColor}>Products</Text>
                                                <Text fontSize="lg" fontWeight="semibold" color={textColor}>
                                                    {category.productCount}
                                                </Text>
                                            </VStack>
                                            <VStack align="end" gap={0}>
                                                <Text fontSize="xs" color={mutedColor}>Slug</Text>
                                                <Text fontSize="sm" color={textColor} fontFamily="mono">
                                                    {category.slug}
                                                </Text>
                                            </VStack>
                                        </HStack>
                                    </VStack>
                                </Card.Body>
                            </Card.Root>
                        ))}
                    </Grid>
                )}
            </VStack>

            {/* Category Dialog */}
            <CategoryDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                category={editingCategory}
                onSave={fetchCategories}
            />
        </Box>
    );
}

// Category Dialog Component
interface CategoryDialogProps {
    isOpen: boolean;
    onClose: () => void;
    category: Category | null;
    onSave: () => void;
}

function CategoryDialog({ isOpen, onClose, category, onSave }: CategoryDialogProps) {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        isActive: true,
    });
    const [loading, setLoading] = useState(false);

    const cardBg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');

    useEffect(() => {
        if (category) {
            setFormData({
                name: category.name,
                description: category.description,
                isActive: category.isActive,
            });
        } else {
            setFormData({
                name: '',
                description: '',
                isActive: true,
            });
        }
    }, [category, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const url = category
                ? `/api/admin/categories/${category.id}`
                : '/api/admin/categories';

            const method = category ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (data.success) {
                toaster.success({
                    title: "Success",
                    description: `Category ${category ? 'updated' : 'created'} successfully`,
                    duration: 3000,
                });
                onSave();
                onClose();
            } else {
                throw new Error(data.error);
            }
        } catch (error) {
            console.error('Save category error:', error);
            toaster.error({
                title: "Error",
                description: `Failed to ${category ? 'update' : 'create'} category`,
                duration: 3000,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog.Root open={isOpen} onOpenChange={({ open }) => !open && onClose()}>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content maxW="500px" bg={cardBg} borderColor={borderColor}>
                        <Dialog.Header>
                            <Dialog.Title>
                                {category ? 'Edit Category' : 'Create New Category'}
                            </Dialog.Title>
                        </Dialog.Header>

                        <Dialog.Body>
                            <form onSubmit={handleSubmit}>
                                <VStack gap={4}>
                                    <Box w="100%">
                                        <Text fontSize="sm" mb={2}>Category Name</Text>
                                        <Input
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="Enter category name"
                                            required
                                        />
                                    </Box>

                                    <Box w="100%">
                                        <Text fontSize="sm" mb={2}>Description</Text>
                                        <Textarea
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            placeholder="Enter category description"
                                            rows={3}
                                        />
                                    </Box>

                                    <HStack justify="space-between" w="100%">
                                        <Text fontSize="sm">Status</Text>
                                        <Badge colorPalette={formData.isActive ? "green" : "red"}>
                                            {formData.isActive ? "Active" : "Inactive"}
                                        </Badge>
                                        <Button
                                            type="button"
                                            size="sm"
                                            variant="outline"
                                            onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                                        >
                                            Toggle
                                        </Button>
                                    </HStack>
                                </VStack>
                            </form>
                        </Dialog.Body>

                        <Dialog.Footer>
                            <Dialog.ActionTrigger asChild>
                                <Button variant="outline" onClick={onClose}>
                                    Cancel
                                </Button>
                            </Dialog.ActionTrigger>
                            <Button
                                onClick={handleSubmit}
                                bg="green.600"
                                color="white"
                                _hover={{ bg: 'green.700' }}
                                loading={loading}
                            >
                                {category ? 'Update' : 'Create'} Category
                            </Button>
                        </Dialog.Footer>

                        <Dialog.CloseTrigger asChild>
                            <CloseButton size="sm" />
                        </Dialog.CloseTrigger>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
}
