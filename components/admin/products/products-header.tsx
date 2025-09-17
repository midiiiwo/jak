'use client'

import { createListCollection } from '@chakra-ui/react';
import { FaPlus, FaDownload } from 'react-icons/fa';
import { FilterBar } from '@/components/admin/shared';

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

interface ProductsHeaderProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    categoryFilter: string;
    onCategoryChange: (value: string) => void;
    stockFilter: string;
    onStockChange: (value: string) => void;
    onAddNew: () => void;
    onExport: () => void;
}

export default function ProductsHeader({
    searchTerm,
    onSearchChange,
    categoryFilter,
    onCategoryChange,
    stockFilter,
    onStockChange,
    onAddNew,
    onExport
}: ProductsHeaderProps) {
    const filters = [
        {
            label: "Category",
            value: categoryFilter,
            onChange: onCategoryChange,
            options: categoryOptions.items
        },
        {
            label: "Stock Status",
            value: stockFilter,
            onChange: onStockChange,
            options: stockOptions.items
        }
    ];

    const actions = [
        {
            label: "Export",
            onClick: onExport,
            icon: FaDownload,
            colorPalette: "gray"
        },
        {
            label: "Add Product",
            onClick: onAddNew,
            icon: FaPlus,
            colorPalette: "green"
        }
    ];

    return (
        <FilterBar
            searchTerm={searchTerm}
            onSearchChange={onSearchChange}
            searchPlaceholder="Search products..."
            filters={filters}
            actions={actions}
        />
    );
}
