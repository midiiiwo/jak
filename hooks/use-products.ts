'use client'

import { useState, useEffect, useCallback } from 'react';
import { Product } from '@/types/admin';

export function useProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchProducts = useCallback(async (searchTerm = '', categoryFilter = '', stockFilter = '') => {
        try {
            const params = new URLSearchParams({
                ...(searchTerm && { search: searchTerm }),
                ...(categoryFilter && { category: categoryFilter }),
                ...(stockFilter && { inStock: stockFilter }),
            });

            // Replace with actual API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Mock data
            const mockProducts: Product[] = [
                {
                    id: '1',
                    title: 'Full Chicken',
                    description: 'Fresh whole chicken',
                    price: 25.99,
                    category: 'Poultry',
                    image: '/img-1.jpeg',
                    stock: 45,
                    inStock: true,
                    sku: 'CHK001',
                    unit: 'piece',
                    minStockLevel: 10,
                    cost: 18.50,
                    isActive: true,
                    isFeatured: true,
                    tags: ['fresh', 'chicken'],
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    createdBy: 'admin',
                    updatedBy: 'admin'
                },
                {
                    id: '2',
                    title: 'Salmon Fillet',
                    description: 'Fresh salmon fillet',
                    price: 35.99,
                    category: 'SeaFood',
                    image: '/img-2.png',
                    stock: 3,
                    inStock: true,
                    sku: 'SAL001',
                    unit: 'kg',
                    minStockLevel: 5,
                    cost: 28.50,
                    isActive: true,
                    isFeatured: false,
                    tags: ['fresh', 'salmon'],
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    createdBy: 'admin',
                    updatedBy: 'admin'
                }
            ];

            // Apply filters
            let filteredProducts = mockProducts;

            if (searchTerm) {
                filteredProducts = filteredProducts.filter(p =>
                    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    p.description.toLowerCase().includes(searchTerm.toLowerCase())
                );
            }

            if (categoryFilter) {
                filteredProducts = filteredProducts.filter(p => p.category === categoryFilter);
            }

            if (stockFilter) {
                const inStock = stockFilter === 'true';
                filteredProducts = filteredProducts.filter(p => p.inStock === inStock);
            }

            setProducts(filteredProducts);
        } catch (error) {
            console.error('Failed to fetch products:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    const updateStock = useCallback(async (productId: string, type: string, quantity: number, reason: string) => {
        try {
            // Replace with actual API call
            await new Promise(resolve => setTimeout(resolve, 500));

            setProducts(prev => prev.map(p => {
                if (p.id === productId) {
                    let newStock = p.stock;

                    switch (type) {
                        case 'in':
                            newStock += quantity;
                            break;
                        case 'out':
                            newStock = Math.max(0, newStock - quantity);
                            break;
                        case 'adjustment':
                            newStock = quantity;
                            break;
                    }

                    return {
                        ...p,
                        stock: newStock,
                        inStock: newStock > 0,
                        updatedAt: new Date()
                    };
                }
                return p;
            }));
        } catch (error) {
            console.error('Failed to update stock:', error);
        }
    }, []);

    const deleteProduct = useCallback(async (productId: string) => {
        try {
            // Replace with actual API call
            await new Promise(resolve => setTimeout(resolve, 500));

            setProducts(prev => prev.filter(p => p.id !== productId));
        } catch (error) {
            console.error('Failed to delete product:', error);
        }
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    return {
        products,
        loading,
        fetchProducts,
        updateStock,
        deleteProduct
    };
}
