import { Stack, Text, Box, HStack, Image, Heading, List, Flex } from "@chakra-ui/react";
import { TbCircleCheck } from "react-icons/tb";

const products = [
    { id: 1, name: "Gizzard", image: "/img-1.jpeg" },
    { id: 2, name: "Sausage", image: "/img-2.png" },
    { id: 3, name: "Salmon", image: "/img-1.jpeg" },
    { id: 4, name: "Turkey", image: "/img-2.png" },
    { id: 5, name: "Goat Meat", image: "/img-1.jpeg" },
    { id: 6, name: "Beef", image: "/img-2.png" },
    { id: 7, name: "Chicken Wings", image: "/img-1.jpeg" },
    { id: 8, name: "Fish Fillet", image: "/img-2.png" },
    { id: 9, name: "Prawns", image: "/img-1.jpeg" },
    { id: 10, name: "Duck", image: "/img-2.png" },
    { id: 11, name: "Lamb", image: "/img-1.jpeg" },
    { id: 12, name: "Crab", image: "/img-2.png" },
];

type Product = { id: number; name: string; image: string; };
type ProductListProps = { items: Product[] };

function ProductList({ items }: ProductListProps) {
    return (
        <List.Root gap="4" variant="plain">
            {items.map((product) => (
                <List.Item key={product.id}>
                    <HStack width="100%">
                        <List.Indicator asChild color="green.500"><TbCircleCheck /></List.Indicator>
                        <Box width="50px" height="50px" borderRadius="md" overflow="hidden" flexShrink={0}>
                            <Image src={product.image} alt={product.name} objectFit="cover" width="100%" height="100%" />
                        </Box>
                        <Heading size="sm" fontWeight="semibold" color="green.700">{product.name}</Heading>
                    </HStack>
                </List.Item>
            ))}
        </List.Root>
    );
}

export default function ProductsAvailable() {
    const firstColumnProducts = products.slice(0, 6);
    const secondColumnProducts = products.slice(6, 12);
    
    return (
        <Stack bg="orange.200" p={[6, 8, 12]} alignItems="center" justifyContent="center" gap={8}>
            <Text fontSize={['2xl', '3xl', '4xl']} fontWeight="bold" color="green.700" textAlign="center">
                Available Products
            </Text>

            <Box bg="white" borderRadius="xl" shadow="lg" width="100%" maxWidth="1000px" p={[6, 8, 10]} overflow="hidden">
                <Flex direction={["column", "column", "row"]} gap={[8, 8, 12]} align="flex-start" justify="center">
                    <Box flex={1} width="100%"><ProductList items={firstColumnProducts} /></Box>
                    <Box flex={1} width="100%"><ProductList items={secondColumnProducts} /></Box>
                </Flex>
            </Box>
        </Stack>
    );
}