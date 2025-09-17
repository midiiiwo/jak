import { JSX } from "react";
import { Stack, Card, Circle, Flex, Text } from "@chakra-ui/react";
import { LuLeaf, LuTruck, LuClock } from "react-icons/lu";

interface FeaturesType {
    icon: JSX.Element;
    title: string;
    description: string;
}

const FeaturesDetails: FeaturesType[] = [
    {
        icon: <LuLeaf size="20px" />,
        title: "Fresh Products",
        description: "We source the freshest products to ensure quality and taste in every purchase.",
    },
    {
        icon: <LuTruck size="20px" />,
        title: "Delivery Available",
        description: "Convenient delivery service to bring your order right to your doorstep.",
    },
    {
        icon: <LuClock size="20px" />,
        title: "Quick Service",
        description: "Fast and efficient service to save you time and ensure satisfaction.",
    },
];

export default function FeaturesSection() {
    return (
        <Stack gap={8} py={10}>
            <Text fontSize={['3xl', '4xl']} fontWeight="bold" color="green.700" textAlign="center">
                Why Choose Frozen Haven?
            </Text>

            <Flex 
                width="100%" direction={["column", "column", "row"]} 
                justifyContent="center" px={[4, 6, 8]} gap={[6, 8]}
            >
                {FeaturesDetails.map((feature, index) => (
                    <Card.Root
                        key={index}
                        maxW="sm"
                        bg="white"
                        borderColor="white"
                        borderRadius="xl"
                        boxShadow="md"
                        mx="auto"
                        transition="transform 0.3s, box-shadow 0.3s"
                        _hover={{ transform: "translateY(-4px)", boxShadow: "lg" }}
                    >
                        <Card.Body textAlign="center" p={[6, 8]} gap={4}>
                            <Circle size="60px" bg="green.100" color="green.700" mx="auto">{feature.icon}</Circle>
                            <Card.Title fontSize={['lg', 'xl']} color="green.700" fontWeight="bold">
                                {feature.title}
                            </Card.Title>
                            <Card.Description color="gray.600" fontSize={['sm', 'md']} lineHeight="relaxed">
                                {feature.description}
                            </Card.Description>
                        </Card.Body>
                    </Card.Root>
                ))}
            </Flex>
        </Stack>
    );
}