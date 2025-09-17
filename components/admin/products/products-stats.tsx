'use client'

import { Grid } from '@chakra-ui/react';
import { FaBoxes, FaExclamationTriangle } from 'react-icons/fa';
import { StatCard } from '@/components/admin/shared';
import { Product } from '@/types/admin';

interface ProductsStatsProps {
    products: Product[];
}

export default function ProductsStats({ products }: ProductsStatsProps) {
    const totalProducts = products.length;
    const inStockProducts = products.filter(p => p.stock > 0).length;
    const lowStockProducts = products.filter(p => p.stock > 0 && p.stock <= p.minStockLevel).length;
    const outOfStockProducts = products.filter(p => p.stock === 0).length;

    return (
        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }} gap={6} mb={8}>
            <StatCard
                title="Total Products"
                value={totalProducts.toString()}
                icon={FaBoxes}
                color="blue"
            />
            <StatCard
                title="In Stock"
                value={inStockProducts.toString()}
                icon={FaBoxes}
                color="green"
            />
            <StatCard
                title="Low Stock"
                value={lowStockProducts.toString()}
                icon={FaExclamationTriangle}
                color="orange"
            />
            <StatCard
                title="Out of Stock"
                value={outOfStockProducts.toString()}
                icon={FaExclamationTriangle}
                color="red"
            />
        </Grid>
    );
}
