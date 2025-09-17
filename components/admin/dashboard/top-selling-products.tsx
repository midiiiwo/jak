import {
    Card,
    HStack,
    VStack,
    Heading,
    Text,
    Button,
    Table,
    Box,
    Badge,
    Circle
} from '@chakra-ui/react';
import { FaEye } from 'react-icons/fa';
import { useColorModeValue } from '@/components/ui/color-mode';
import { DashboardStats } from '@/types/admin';
import { formatCurrency } from '@/lib/utils';

interface TopSellingProductsProps {
    stats: DashboardStats;
}

export default function TopSellingProducts({ stats }: TopSellingProductsProps) {
    const cardBg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const textColor = useColorModeValue('gray.800', 'white');
    const hoverBg = useColorModeValue('gray.100', 'gray.700');

    return (
        <Card.Root
            bg={cardBg}
            shadow="lg"
            borderRadius="xl"
            border="1px solid"
            borderColor={borderColor}
            w="100%"
        >
            <Card.Header>
                <HStack justify="space-between">
                    <VStack align="start" gap={1}>
                        <Heading size="lg" color={textColor}>Top Selling Products</Heading>
                        <Text color="gray.500" fontSize="sm">Best performing items this month</Text>
                    </VStack>
                    <Button
                        variant="outline"
                        size="sm"
                        _hover={{ bg: hoverBg }}
                    >
                        <FaEye />
                        View All
                    </Button>
                </HStack>
            </Card.Header>
            <Card.Body>
                <Table.Root>
                    <Table.Header>
                        <Table.Row>
                            <Table.ColumnHeader color={textColor} fontWeight="bold">Product</Table.ColumnHeader>
                            <Table.ColumnHeader color={textColor} fontWeight="bold">Category</Table.ColumnHeader>
                            <Table.ColumnHeader color={textColor} fontWeight="bold">Quantity Sold</Table.ColumnHeader>
                            <Table.ColumnHeader color={textColor} fontWeight="bold">Revenue</Table.ColumnHeader>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {stats.topSellingProducts.map((item, index) => (
                            <Table.Row key={index} _hover={{ bg: hoverBg }}>
                                <Table.Cell>
                                    <HStack gap={3}>
                                        <Box
                                            w="50px" h="50px"
                                            bg="gray.200"
                                            borderRadius="lg"
                                            backgroundImage={`url(${item.product.image})`}
                                            backgroundSize="cover"
                                            backgroundPosition="center"
                                            shadow="md"
                                        />
                                        <VStack align="start" gap={1}>
                                            <Text fontWeight="semibold" color={textColor}>
                                                {item.product.title}
                                            </Text>
                                            <Text fontSize="xs" color="gray.500">
                                                ID: {item.product.id || index + 1}
                                            </Text>
                                        </VStack>
                                    </HStack>
                                </Table.Cell>
                                <Table.Cell>
                                    <Badge
                                        colorPalette="green"
                                        variant="subtle"
                                        fontSize="xs"
                                        px={3}
                                        py={1}
                                        borderRadius="full"
                                    >
                                        {item.product.category}
                                    </Badge>
                                </Table.Cell>
                                <Table.Cell>
                                    <HStack gap={2}>
                                        <Circle size="30px" bg="blue.100" color="blue.600">
                                            <Text fontSize="xs" fontWeight="bold">{item.quantitySold}</Text>
                                        </Circle>
                                        <Text color={textColor} fontWeight="medium">units</Text>
                                    </HStack>
                                </Table.Cell>
                                <Table.Cell>
                                    <Text fontWeight="bold" color="green.600" fontSize="lg">
                                        {formatCurrency(item.revenue)}
                                    </Text>
                                </Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table.Root>
            </Card.Body>
        </Card.Root>
    );
}
