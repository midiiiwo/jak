import {
    Card,
    VStack,
    HStack,
    Circle,
    Icon,
    Text,
    Heading
} from '@chakra-ui/react';
import { IoTrendingDown, IoTrendingUp } from "react-icons/io5";
import { useColorModeValue } from '@/components/ui/color-mode';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ComponentType;
    color: string;
    trend?: number;
    subtitle?: string;
}

export default function StatCard({
    title,
    value,
    icon,
    color,
    trend,
    subtitle
}: StatCardProps) {
    const cardBg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');

    return (
        <Card.Root
            bg={cardBg}
            shadow="lg"
            borderRadius="xl"
            border="1px solid"
            borderColor={borderColor}
            transition="all 0.3s"
            _hover={{
                transform: "translateY(-4px)",
                shadow: "xl",
                borderColor: `${color}.300`
            }}
        >
            <Card.Body p={6}>
                <VStack align="start" gap={4} h="100%">
                    <HStack justify="space-between" w="100%">
                        <Circle size="60px" bg={`${color}.100`} color={`${color}.600`}>
                            <Icon as={icon} boxSize={6} />
                        </Circle>
                        {trend !== undefined && (
                            <HStack gap={1}>
                                <Icon
                                    color={trend > 0 ? 'green.500' : 'red.500'}
                                    boxSize={4}
                                >
                                    {trend > 0 ? <IoTrendingUp /> : <IoTrendingDown />}
                                </Icon>
                                <Text
                                    fontSize="sm"
                                    fontWeight="bold"
                                    color={trend > 0 ? 'green.500' : 'red.500'}
                                >
                                    {trend > 0 ? '+' : ''}{trend}%
                                </Text>
                            </HStack>
                        )}
                    </HStack>

                    <VStack align="start" gap={1} flex={1}>
                        <Text fontSize="sm" color="gray.500" fontWeight="medium">
                            {title}
                        </Text>
                        <Heading size="2xl" color={`${color}.600`} fontWeight="bold">
                            {value}
                        </Heading>
                        {subtitle && (
                            <Text fontSize="xs" color="gray.400">
                                {subtitle}
                            </Text>
                        )}
                    </VStack>
                </VStack>
            </Card.Body>
        </Card.Root>
    );
}
