"use client";
import { useState, useEffect } from "react";
import {
  SimpleGrid,
  Card,
  Box,
  Flex,
  Badge,
  Button,
  Text,
  Image,
  Icon,
} from "@chakra-ui/react";
import { useCart } from "@/contexts/cart-context";
import { toaster } from "@/components/ui/toaster";
import { TbShoppingBagExclamation } from "react-icons/tb";

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

interface ProductsProps {
  category?: string;
  search?: string;
}

export default function Products({ category, search }: ProductsProps) {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, [category, search]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (category && category !== "all") {
        params.append("category", category);
      }
      if (search) {
        params.append("search", search);
      }
      params.append("limit", "100"); // Get more products for the shop page

      const response = await fetch(`/api/products?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setProducts(data.products);
      } else {
        setError("Failed to load products");
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to load products");
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
      <Box
        textAlign="center"
        py={16}
        px={8}
        color="gray.500"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minH="400px"
      >
        <Text fontSize={["lg", "xl", "2xl"]} fontWeight="bold" mb={4}>
          Loading products...
        </Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        textAlign="center"
        py={16}
        px={8}
        color="red.500"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minH="400px"
      >
        <Text fontSize={["lg", "xl", "2xl"]} fontWeight="bold" mb={4}>
          {error}
        </Text>
        <Button onClick={fetchProducts} colorScheme="red" variant="outline">
          Try Again
        </Button>
      </Box>
    );
  }

  return (
    <SimpleGrid
      columns={{ base: 1, sm: 2, md: 2, lg: 3, xl: 4 }}
      width="100%"
      gap={[3, 4, 6]}
      px={[2, 3, 4, 6]}
      pt={[2, 0]}
      mx={[2, 0]}
    >
      {products.length > 0 ? (
        products.map((product) => (
          <Card.Root
            key={product.id}
            overflow="hidden"
            bg="white"
            boxShadow="md"
            borderColor="white"
            borderRadius="lg"
            transition="transform 0.3s, box-shadow 0.3s"
            _hover={{
              transform: "translateY(-4px)",
              boxShadow: "lg",
              borderColor: "green.100",
            }}
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
            <Card.Body gap="2" flex="1">
              <Flex justifyContent="space-between" alignItems="center" mb={2}>
                <Card.Title color="gray.700" fontSize={["md", "lg"]}>
                  {product.title}
                </Card.Title>
                <Badge
                  colorPalette="yellow"
                  fontSize={["xs", "sm"]}
                  borderRadius="full"
                  px={2}
                >
                  {product.category}
                </Badge>
              </Flex>
              <Card.Description color="gray.600" fontSize={["sm", "md"]}>
                {product.description}
              </Card.Description>
            </Card.Body>
            <Card.Footer
              justifyContent="space-between"
              alignItems="center"
              p={[3, 4]}
              gap="2"
            >
              <Text
                fontSize={["md", "lg"]}
                color="gray.800"
                fontWeight="bold"
                letterSpacing="tight"
              >
                {product.formattedPrice}
              </Text>
              <Button
                bg="green.800"
                color="white"
                size={["sm", "md"]}
                _hover={{ bg: "green.700" }}
                onClick={() => handleAddToCart(product)}
                disabled={!product.inStock}
                opacity={!product.inStock ? 0.6 : 1}
              >
                {product.inStock ? "Add to cart" : "Out of Stock"}
              </Button>
            </Card.Footer>
          </Card.Root>
        ))
      ) : (
        <Box
          gridColumn="1 / -1"
          textAlign="center"
          py={16}
          px={8}
          color="gray.500"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minH="400px"
        >
          <Text fontSize={["2xl", "3xl", "4xl"]} fontWeight="bold" mb={6}>
            No products found
          </Text>
          <Icon boxSize={["60px", "80px", "100px"]} mb={6} color="gray.400">
            <TbShoppingBagExclamation />
          </Icon>
          <Text fontSize={["md", "lg", "xl"]} maxW="400px" lineHeight="relaxed">
            Try adjusting your filters to see more products
          </Text>
        </Box>
      )}
    </SimpleGrid>
  );
}
