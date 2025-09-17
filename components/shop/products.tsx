'use client'
import { SimpleGrid, Card, Box, Flex, Badge, Button, Text, Image, Icon } from "@chakra-ui/react";
import { ProductsDetails } from "../home/featured-products-section";
import { useCart } from "@/contexts/cart-context";
import { toaster } from "@/components/ui/toaster";
import { TbShoppingBagExclamation } from "react-icons/tb";

interface ProductsProps {
    filteredProducts?: typeof ProductsDetails;
}

export default function Products({ filteredProducts = ProductsDetails }: ProductsProps) {
    const { addToCart } = useCart();

    const handleAddToCart = (product: typeof ProductsDetails[0], index: number) => {
        const cartItem = {
            id: `shop-${index}`,
            title: product.title,
            price: product.price,
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

    return (
        <SimpleGrid 
            columns={{ base: 1, sm: 2, md: 2, lg: 3, xl: 4 }} width="100%" 
            gap={[3, 4, 6]} px={[2, 3, 4, 6]} pt={[2, 0]} mx={[2, 0]}
        >
            {filteredProducts.length > 0 ? (
                filteredProducts.map((product, index) => (
                    <Card.Root
                        key={index}
                        overflow="hidden"
                        bg="white"
                        boxShadow="md"
                        borderColor="white"
                        borderRadius="lg"
                        transition="transform 0.3s, box-shadow 0.3s"
                        _hover={{ transform: "translateY(-4px)", boxShadow: "lg", borderColor: "green.100" }}
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
                        </Box>
                        <Card.Body gap="2" flex="1">
                            <Flex justifyContent="space-between" alignItems="center" mb={2}>
                                <Card.Title color="gray.700" fontSize={['md', 'lg']}>{product.title}</Card.Title>
                                <Badge colorPalette="yellow" fontSize={['xs', 'sm']} borderRadius="full" px={2}>
                                    {product.category}
                                </Badge>
                            </Flex>
                            <Card.Description color="gray.600" fontSize={['sm', 'md']}>
                                {product.description}
                            </Card.Description>
                        </Card.Body>
                        <Card.Footer justifyContent="space-between" alignItems="center" p={[3, 4]} gap="2">
                            <Text fontSize={['md', 'lg']} color="gray.800" fontWeight="bold" letterSpacing="tight">
                                {product.price}
                            </Text>
                            <Button
                                bg="green.800"
                                color="white"
                                size={['sm', 'md']}
                                _hover={{ bg: 'green.700' }}
                                onClick={() => handleAddToCart(product, index)}
                            >
                                Add to cart
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
                    <Text fontSize={["2xl", "3xl", "4xl"]} fontWeight="bold" mb={6}>No products found</Text>
                    <Icon boxSize={["60px", "80px", "100px"]} mb={6} color="gray.400">
                        <TbShoppingBagExclamation />
                    </Icon>
                    <Text fontSize={["md", "lg", "xl"]} maxW="400px" lineHeight="relaxed">
                        Try adjusting your filters to see more products
                    </Text>
                </Box>
            )}
        </SimpleGrid>
    )
}