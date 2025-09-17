import { Card, HStack, Heading, Circle, Icon, Stack, Button } from '@chakra-ui/react';
import { FaPlus, FaExclamationTriangle, FaWarehouse } from 'react-icons/fa';
import { useColorModeValue } from '@/components/ui/color-mode';
import { ROUTES } from '@/lib/utils';
import Link from 'next/link';

export default function QuickActions() {
    const cardBg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const textColor = useColorModeValue('gray.800', 'white');

    return (
        <Card.Root
            bg={cardBg}
            shadow="lg"
            borderRadius="xl"
            border="1px solid"
            borderColor={borderColor}
        >
            <Card.Header pb={2}>
                <HStack justify="space-between">
                    <Heading size="md" color={textColor}>Quick Actions</Heading>
                    <Circle size="40px" bg="green.100" color="green.600">
                        <Icon boxSize={4}>
                            <FaPlus />
                        </Icon>
                    </Circle>
                </HStack>
            </Card.Header>
            <Card.Body pt={2}>
                <Stack gap={3}>
                    <Link href={`${ROUTES.admin.products}/new`}>
                        <Button
                            w="100%"
                            bg="green.600"
                            color="white"
                            _hover={{ bg: 'green.700', transform: 'translateY(-2px)' }}
                            transition="all 0.2s"
                        >
                            <FaPlus />
                            Add New Product
                        </Button>
                    </Link>
                    <Link href={`${ROUTES.admin.products}?filter=lowStock`}>
                        <Button
                            w="100%"
                            bg="orange.600"
                            color="white"
                            _hover={{ bg: 'orange.700', transform: 'translateY(-2px)' }}
                            transition="all 0.2s"
                        >
                            <FaExclamationTriangle />
                            Check Low Stock
                        </Button>
                    </Link>
                    <Link href={ROUTES.admin.stock}>
                        <Button
                            w="100%"
                            bg="blue.600"
                            color="white"
                            _hover={{ bg: 'blue.700', transform: 'translateY(-2px)' }}
                            transition="all 0.2s"
                        >
                            <FaWarehouse />
                            Manage Inventory
                        </Button>
                    </Link>
                </Stack>
            </Card.Body>
        </Card.Root>
    );
}
