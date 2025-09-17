'use client'

import { useState } from 'react';
import { Box, VStack, Text, Alert } from '@chakra-ui/react';
import { useColorModeValue } from '@/components/ui/color-mode';
import { LoadingSpinner, EmptyState } from '@/components/shared';
import {
    ProductsStats,
    ProductsHeader,
    ProductsTable,
    StockManagementDialog
} from '@/components/admin/products';
import { useProducts } from '@/hooks/use-products';
import { Product } from '@/types/admin';
import { FaBoxes } from 'react-icons/fa';

export default function ProductManagement() {
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [stockFilter, setStockFilter] = useState('');
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isStockOpen, setIsStockOpen] = useState(false);

    const { products, loading, updateStock, deleteProduct } = useProducts();

    const bgColor = useColorModeValue('gray.50', 'gray.900');
    const cardBg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const alertBg = useColorModeValue('orange.50', 'orange.900');

    // Filter products based on search and filters
    const filteredProducts = products.filter(product => {
        const matchesSearch = !searchTerm ||
            product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory = !categoryFilter || product.category === categoryFilter;

        const matchesStock = !stockFilter ||
            (stockFilter === 'true' && product.inStock) ||
            (stockFilter === 'false' && !product.inStock);

        return matchesSearch && matchesCategory && matchesStock;
    });

    const lowStockProducts = products.filter(p => p.stock > 0 && p.stock <= p.minStockLevel);

    const handleSearchChange = (value: string) => {
        setSearchTerm(value);
    };

    const handleCategoryChange = (value: string) => {
        setCategoryFilter(value);
    };

    const handleStockChange = (value: string) => {
        setStockFilter(value);
    };

    const handleAddNew = () => {
        // Navigate to add new product page
        window.location.href = '/admin/products/new';
    };

    const handleExport = () => {
        // Export functionality
        console.log('Exporting products...');
    };

    const handleEdit = (product: Product) => {
        // Navigate to edit page
        window.location.href = `/admin/products/${product.id}/edit`;
    };

    const handleDelete = async (productId: string) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            await deleteProduct(productId);
        }
    };

    const handleViewStock = (product: Product) => {
        setSelectedProduct(product);
        setIsStockOpen(true);
    };

    const handleUpdateStock = async (productId: string, type: string, quantity: number, reason: string) => {
        await updateStock(productId, type, quantity, reason);
        setIsStockOpen(false);
        setSelectedProduct(null);
    };

    if (loading) {
        return (
            <Box p={8} bg={bgColor} minH="100vh">
                <LoadingSpinner />
                <Text color="gray.600">Loading products...</Text>
            </Box>
        );
    }

    return (
        <Box p={8} bg={bgColor} minH="100vh">
            <VStack align="stretch" gap={6}>
                {/* Page Title */}
                <VStack align="start" gap={2}>
                    <Text fontSize="3xl" fontWeight="bold">
                        Product Management
                    </Text>
                    <Text color="gray.600">
                        Manage your product inventory and stock levels
                    </Text>
                </VStack>

                {/* Low Stock Alert */}
                {lowStockProducts.length > 0 && (
                    <Alert.Root status="warning" bg={alertBg} borderRadius="md">
                        <Alert.Indicator />
                        <Alert.Title>Low Stock Alert!</Alert.Title>
                        <Alert.Description>
                            {lowStockProducts.length} product(s) are running low on stock.
                        </Alert.Description>
                    </Alert.Root>
                )}

                {/* Stats */}
                <ProductsStats products={products} />

                {/* Header with search and filters */}
                <ProductsHeader
                    searchTerm={searchTerm}
                    onSearchChange={handleSearchChange}
                    categoryFilter={categoryFilter}
                    onCategoryChange={handleCategoryChange}
                    stockFilter={stockFilter}
                    onStockChange={handleStockChange}
                    onAddNew={handleAddNew}
                    onExport={handleExport}
                />

                {/* Products Table */}
                <Box bg={cardBg} borderRadius="xl" borderColor={borderColor} border="1px solid" overflow="hidden">
                    {filteredProducts.length > 0 ? (
                        <ProductsTable
                            products={filteredProducts}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onViewStock={handleViewStock}
                        />
                    ) : (
                        <EmptyState
                            title="No products found"
                            description="Try adjusting your search or filters, or add a new product."
                            actionLabel="Add Product"
                            onAction={handleAddNew}
                            icon={FaBoxes}
                        />
                    )}
                </Box>

                {/* Stock Management Dialog */}
                <StockManagementDialog
                    isOpen={isStockOpen}
                    onClose={() => {
                        setIsStockOpen(false);
                        setSelectedProduct(null);
                    }}
                    product={selectedProduct}
                    onUpdateStock={handleUpdateStock}
                />
            </VStack>
        </Box>
    );
}
