"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import ProductForm from "@/components/admin/product-form";
import { Product } from "@/types/admin";
import { Box, Text, Spinner } from "@chakra-ui/react";

export default function EditProductPage() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchProduct(params.id as string);
    }
  }, [params.id]);

  const fetchProduct = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/products/${id}`);
      const data = await response.json();
      if (data.success) {
        setProduct(data.product);
      }
    } catch (error) {
      console.error("Failed to fetch product:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box p={6} textAlign="center">
        <Spinner size="lg" />
        <Text mt={4}>Loading product...</Text>
      </Box>
    );
  }

  if (!product) {
    return (
      <Box p={6} textAlign="center">
        <Text>Product not found</Text>
      </Box>
    );
  }

  return <ProductForm product={product} isEditing={true} />;
}
