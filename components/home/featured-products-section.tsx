'use client'
import Link from "next/link";
import { FaShoppingBag } from "react-icons/fa";
import { Stack, Flex, Card, Image, Text, Button, Icon, Badge, SimpleGrid, Box } from "@chakra-ui/react";
import { useCart } from "@/contexts/cart-context";
import { toaster } from "@/components/ui/toaster";

export const ProductsDetails = [
    {
        image: "img-1.jpeg",
        title: "Full Chicken",
        category: "Poultry",
        description: "Fresh whole chicken, perfect for roasting or grilling.",
        price: "GHC 200"
    },
    {
        image: "img-1.jpeg",
        title: "Gizzard",
        category: "Meat",
        description: "Fresh chicken gizzards, rich in protein and nutrients.",
        price: "GHC 350"
    },
    {
        image: "img-1.jpeg",
        title: "Salmon",
        category: "SeaFood",
        description: "Premium quality salmon, rich in omega-3 fatty acids.",
        price: "GHC 200"
    },
    {
        image: "img-1.jpeg",
        title: "Goat",
        category: "Meat",
        description: "Tender goat meat, perfect for traditional cooking.",
        price: "GHC 150"
    }
];

export default function FeaturedProductsSection() {
    const { addToCart } = useCart();

    const handleAddToCart = (product: typeof ProductsDetails[0], index: number) => {
        const cartItem = {
            id: `featured-${index}`,
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
        <Stack bg="gray.100" p={[4, 6, 8]} mt={10}>
            <Flex 
                justifyContent="space-between" 
                flexDirection={['column', 'row']} 
                alignItems={['flex-start', 'center']} 
                gap={[3, 0]} mb={4}
            >
                <Text fontSize={['2xl', '3xl']} fontWeight="bold" color="green.700">Featured Products</Text>
                <Link href="/shop" passHref>
                    <Button color="white" bg="green.700" _hover={{ bg: 'green.800' }} size={['sm', 'md']}>
                        <Icon><FaShoppingBag /></Icon>
                        View All
                    </Button>
                </Link>
            </Flex>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} width="100%" gap={[4, 6]} px={[2, 4, 8]}>
                {ProductsDetails.map((product, index) => (
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
                                src={product.image} alt={product.title} 
                                position="absolute" top="0" left="0" 
                                width="100%" height="100%" objectFit="cover" 
                            />
                        </Box>

                        <Card.Body gap="2" flex="1">
                            <Flex justifyContent="space-between" alignItems="center" mb={2}>
                                <Card.Title color="gray.700" fontSize={['md', 'lg']}>{product.title}</Card.Title>
                                <Badge 
                                    colorPalette="yellow" fontSize={['xs', 'sm']} 
                                    borderRadius="full" px={2}
                                >
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
                ))}
            </SimpleGrid>
        </Stack>
    );
}