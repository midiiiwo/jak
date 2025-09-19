"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { FaShoppingBag } from "react-icons/fa";
import {
  Stack,
  Flex,
  Card,
  Image,
  Text,
  Button,
  Icon,
  Badge,
  SimpleGrid,
  Box,
} from "@chakra-ui/react";
import { useCart } from "@/contexts/cart-context";
import { toaster } from "@/components/ui/toaster";

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  formattedPrice: string;
  category: string;
  image: string;
  inStock: boolean;
  stock: number;
}

export default function FeaturedProductsSection() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      setLoading(true);

      // Fetch featured products from the API
      const response = await fetch(
        "/api/products?limit=4&sortBy=createdAt&sortOrder=desc"
      );
      const data = await response.json();

      if (data.success) {
        setProducts(data.products.slice(0, 4)); // Take first 4 for featured section
      } else {
        console.error("Failed to fetch featured products");
        // Fallback to empty array if API fails
        setProducts([]);
      }
    } catch (err) {
      console.error("Error fetching featured products:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product: Product) => {
    const cartItem = {
      id: product.id,
      title: product.title,
      price: product.formattedPrice,
      image: product.image,
      category: product.category,
      description: product.description,
    };

    addToCart(cartItem);
    toaster.success({
      title: "Added to Cart",
      description: `${product.title} has been added to your cart`,
      duration: 3000,
    });
  };

  if (loading) {
    return (
      <Box py={16} textAlign="center">
        <Text fontSize="lg" color="gray.500">
          Loading featured products...
        </Text>
      </Box>
    );
  }

  return (
    <Box py={[12, 16]} px={[4, 6, 8]} bg="gray.50">
      <Stack gap={[8, 12]} align="center">
        <Stack gap={4} textAlign="center" maxW="600px">
          <Text
            fontSize={["2xl", "3xl", "4xl"]}
            fontWeight="bold"
            color="gray.800"
          >
            Featured Products
          </Text>
          <Text fontSize={["md", "lg"]} color="gray.600" lineHeight="relaxed">
            Discover our hand-picked selection of premium quality products
          </Text>
        </Stack>

        {products.length > 0 ? (
          <SimpleGrid
            columns={{ base: 1, sm: 2, lg: 4 }}
            gap={6}
            w="100%"
            maxW="1200px"
          >
            {products.map((product) => (
              <Card.Root
                key={product.id}
                overflow="hidden"
                bg="white"
                boxShadow="md"
                borderRadius="lg"
                transition="transform 0.3s, box-shadow 0.3s"
                _hover={{ transform: "translateY(-4px)", boxShadow: "lg" }}
                h="100%"
                display="flex"
                flexDirection="column"
              >
                <Box position="relative" paddingTop="60%" overflow="hidden">
                  <Image
                    src={product.image}
                    alt={product.title}
                    position="absolute"
                    top="0"
                    left="0"
                    width="100%"
                    height="100%"
                    objectFit="cover"
                  />
                  {!product.inStock && (
                    <Box
                      position="absolute"
                      top="2"
                      right="2"
                      bg="red.500"
                      color="white"
                      px="2"
                      py="1"
                      borderRadius="md"
                      fontSize="xs"
                      fontWeight="bold"
                    >
                      Out of Stock
                    </Box>
                  )}
                </Box>
                <Card.Body gap="3" flex="1">
                  <Flex justifyContent="space-between" alignItems="center">
                    <Card.Title color="gray.700" fontSize="lg">
                      {product.title}
                    </Card.Title>
                    <Badge
                      colorPalette="yellow"
                      fontSize="sm"
                      borderRadius="full"
                      px={2}
                    >
                      {product.category}
                    </Badge>
                  </Flex>
                  <Card.Description color="gray.600" fontSize="sm">
                    {product.description}
                  </Card.Description>
                  <Text fontSize="lg" color="gray.800" fontWeight="bold">
                    {product.formattedPrice}
                  </Text>
                </Card.Body>
                <Card.Footer p={4}>
                  <Button
                    w="100%"
                    bg="green.800"
                    color="white"
                    _hover={{ bg: "green.700" }}
                    onClick={() => handleAddToCart(product)}
                    disabled={!product.inStock}
                    opacity={!product.inStock ? 0.6 : 1}
                  >
                    <Icon mr={2}>
                      <FaShoppingBag />
                    </Icon>
                    {product.inStock ? "Add to Cart" : "Out of Stock"}
                  </Button>
                </Card.Footer>
              </Card.Root>
            ))}
          </SimpleGrid>
        ) : (
          <Box textAlign="center" py={8}>
            <Text fontSize="lg" color="gray.500">
              No featured products available
            </Text>
          </Box>
        )}

        <Flex justifyContent="center" pt={[4, 8]}>
          <Link href="/shop">
            <Button
              size="lg"
              bg="green.800"
              color="white"
              _hover={{ bg: "green.700" }}
              px={8}
              py={6}
              fontSize="lg"
              fontWeight="bold"
            >
              View All Products
            </Button>
          </Link>
        </Flex>
      </Stack>
    </Box>
  );
}
