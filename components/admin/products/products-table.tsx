'use client'

import {
    Table,
    Badge,
    IconButton,
    HStack,
    Image,
    Text,
} from '@chakra-ui/react';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import { useColorModeValue } from '@/components/ui/color-mode';
import { Product } from '@/types/admin';

interface ProductsTableProps {
    products: Product[];
    onEdit: (product: Product) => void;
    onDelete: (productId: string) => void;
    onViewStock: (product: Product) => void;
}

export default function ProductsTable({
    products,
    onEdit,
    onDelete,
    onViewStock
}: ProductsTableProps) {
    const tableBg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');

    const getStockBadgeColor = (stock: number, minLevel: number) => {
        if (stock === 0) return 'red';
        if (stock <= minLevel) return 'orange';
        return 'green';
    };

    const getStockStatus = (stock: number, minLevel: number) => {
        if (stock === 0) return 'Out of Stock';
        if (stock <= minLevel) return 'Low Stock';
        return 'In Stock';
    };

    return (
        <Table.Root variant="outline" bg={tableBg} borderColor={borderColor}>
            <Table.Header>
                <Table.Row>
                    <Table.ColumnHeader>Product</Table.ColumnHeader>
                    <Table.ColumnHeader>Category</Table.ColumnHeader>
                    <Table.ColumnHeader>Price</Table.ColumnHeader>
                    <Table.ColumnHeader>Stock</Table.ColumnHeader>
                    <Table.ColumnHeader>Status</Table.ColumnHeader>
                    <Table.ColumnHeader>Actions</Table.ColumnHeader>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {products.map((product) => (
                    <Table.Row key={product.id}>
                        <Table.Cell>
                            <HStack gap={3}>
                                <Image
                                    src={product.image}
                                    alt={product.title}
                                    boxSize="40px"
                                    borderRadius="md"
                                    objectFit="cover"
                                />
                                <Text fontWeight="medium">{product.title}</Text>
                            </HStack>
                        </Table.Cell>
                        <Table.Cell>
                            <Badge variant="outline" colorPalette="blue">
                                {product.category}
                            </Badge>
                        </Table.Cell>
                        <Table.Cell>
                            <Text fontWeight="semibold">GHC {product.price.toFixed(2)}</Text>
                        </Table.Cell>
                        <Table.Cell>
                            <Text>{product.stock} {product.unit}</Text>
                        </Table.Cell>
                        <Table.Cell>
                            <Badge
                                colorPalette={getStockBadgeColor(product.stock, product.minStockLevel)}
                                variant="solid"
                            >
                                {getStockStatus(product.stock, product.minStockLevel)}
                            </Badge>
                        </Table.Cell>
                        <Table.Cell>
                            <HStack gap={2}>
                                <IconButton
                                    aria-label="View stock"
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => onViewStock(product)}
                                >
                                    <FaEye />
                                </IconButton>
                                <IconButton
                                    aria-label="Edit product"
                                    size="sm"
                                    variant="ghost"
                                    colorPalette="blue"
                                    onClick={() => onEdit(product)}
                                >
                                    <FaEdit />
                                </IconButton>
                                <IconButton
                                    aria-label="Delete product"
                                    size="sm"
                                    variant="ghost"
                                    colorPalette="red"
                                    onClick={() => onDelete(product.id)}
                                >
                                    <FaTrash />
                                </IconButton>
                            </HStack>
                        </Table.Cell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table.Root>
    );
}
