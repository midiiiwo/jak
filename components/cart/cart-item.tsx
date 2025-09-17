import { Box, Flex, VStack, Image, Text, IconButton, HStack, Heading, Badge } from "@chakra-ui/react";
import { FaPlus, FaMinus, FaTrash } from "react-icons/fa6";

interface CartItemProps {
    id: string;
    title: string;
    price: string;
    quantity: number;
    image?: string;
    category?: string;
    description?: string;
    onQuantityChange: (id: string, quantity: number) => void;
    onRemove: (id: string, title: string) => void;
}

export const CartItem = ({
    id,
    title,
    price,
    quantity,
    image,
    category,
    description,
    onQuantityChange,
    onRemove
}: CartItemProps) => {
    return (
        <Box
            p={[4, 6]}
            bg="white"
            borderRadius="lg"
            boxShadow="md"
            w="100%"
            border="1px solid"
            borderColor="gray.200"
        >
            <Flex direction={['column', 'row']} gap={[4, 6]} align={['center', 'flex-start']}>
                {image && (
                    <Box
                        width={['100%', '150px']}
                        height={['200px', '150px']}
                        borderRadius="md"
                        overflow="hidden"
                        flexShrink={0}
                    >
                        <Image
                            src={image}
                            alt={title}
                            objectFit="cover"
                            width="100%"
                            height="100%"
                        />
                    </Box>
                )}

                <VStack align={['center', 'flex-start']} flex={1} textAlign={['center', 'left']}>
                    <Flex
                        justify={['center', 'space-between']}
                        align="center"
                        w="100%"
                        direction={['column', 'row']}
                        gap={[2, 0]}
                    >
                        <Heading size="md" color="gray.700">{title}</Heading>
                        {category && <Badge colorScheme="yellow" fontSize="sm">{category}</Badge>}
                    </Flex>
                    {description && <Text color="gray.600" fontSize="sm">{description}</Text>}
                    <Text fontSize="xl" fontWeight="bold" color="green.600">{price}</Text>
                </VStack>

                <VStack align="center">
                    <Text fontSize="sm" color="gray.600" fontWeight="medium">Quantity</Text>
                    <HStack>
                        <IconButton
                            aria-label="Decrease quantity"
                            size="sm"
                            colorScheme="gray"
                            variant="outline"
                            onClick={() => onQuantityChange(id, quantity - 1)}
                        >
                            <FaMinus />
                        </IconButton>
                        <Text minW="40px" textAlign="center" fontSize="lg" fontWeight="bold">
                            {quantity}
                        </Text>
                        <IconButton
                            aria-label="Increase quantity"
                            size="sm"
                            colorScheme="green"
                            variant="outline"
                            onClick={() => onQuantityChange(id, quantity + 1)}
                        >
                            <FaPlus />
                        </IconButton>
                        <IconButton
                            aria-label="Remove item"
                            size="sm"
                            colorScheme="red"
                            variant="outline"
                            onClick={() => onRemove(id, title)}
                        >
                            <FaTrash />
                        </IconButton>
                    </HStack>
                </VStack>
            </Flex>
        </Box>
    );
};