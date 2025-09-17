import { Flex, Stack, Text, Link, VStack, HStack, Icon } from "@chakra-ui/react";
import { FaPhoneAlt, FaMapMarkerAlt, FaRegClock, FaTruck } from "react-icons/fa";
import NextLink from 'next/link';
import { TiHome } from "react-icons/ti";
import { MdShoppingCart } from "react-icons/md";

const WorkingHours = [
    "Monday - Friday: 8:00 AM - 6:00 PM",
    "Saturday: 9:00 AM - 5:00 PM",
    "Sunday: 10:00 AM - 2:00 PM",
];

export default function FooterPage() {
    return (
        <Stack id="footer-contact" bg="green.800" p={[4, 6, 8]} align="center">
            <Flex
                width="100%"
                direction={["column", "column", "row"]}
                justifyContent="center"
                alignItems={["center", "center", "flex-start"]}
                pb={[6, 8]}
                px={[4, 6, 12]}
                gap={[8, 10]}
                maxWidth="1200px"
            >
                <VStack align={["center", "center", "flex-start"]} width={["100%", "100%", "auto"]}>
                    <Text 
                        fontSize={["lg", "xl"]} fontWeight="bold" 
                        color="white" textAlign={["center", "center", "left"]}
                    >
                        Quick Links
                    </Text>
                    <VStack align={["center", "center", "flex-start"]} gap={3} width="100%">
                        <Link 
                            as={NextLink} href="/" 
                            color="white" 
                            _hover={{ color: 'gray.300', textDecoration: 'none' }} 
                            _focus={{ outline: 'none' }} display="flex" 
                            alignItems="center" gap={2}
                        >
                            <Icon color="white" boxSize={[4, 5]}><TiHome /></Icon>
                            <Text>Home</Text>
                        </Link>
                        <Link as={NextLink} href="/shop" color="white" _hover={{ color: 'gray.300', textDecoration: 'none' }} _focus={{ outline: 'none' }} display="flex" alignItems="center" gap={2}>
                            <Icon color="white" boxSize={[4, 5]}><MdShoppingCart /></Icon>
                            <Text>Shop</Text>
                        </Link>
                    </VStack>
                </VStack>

                <VStack align={["center", "center", "flex-start"]} width={["100%", "100%", "auto"]}>
                    <Text 
                        fontSize={["lg", "xl"]} fontWeight="bold" 
                        color="white" textAlign={["center", "center", "left"]}
                    >
                        Contact Info
                    </Text>
                    <VStack align={["center", "center", "flex-start"]} gap={3}>
                        <HStack alignItems="center">
                            <Icon color="white" boxSize={[4, 5]}><FaPhoneAlt /></Icon>
                            <Text color="white" fontSize={["sm", "md"]}>(+233) 123-456-789</Text>
                        </HStack>
                        <HStack alignItems="center">
                            <Icon color="white" boxSize={[4, 5]}><FaMapMarkerAlt /></Icon>
                            <Link 
                                href="https://maps.google.com" color="white" 
                                _hover={{ color: 'gray.300', textDecoration: 'none' }} 
                                _focus={{ outline: 'none' }}
                            >
                                <Text color="white" fontSize={["sm", "md"]} textAlign={["center", "center", "left"]}>
                                    Off Fiapre Odumase Road near Kyenky3 hene&apos;s House
                                </Text>
                            </Link>
                        </HStack>
                        <HStack alignItems="center">
                            <Icon color="white" boxSize={[4, 5]}><FaTruck /></Icon>
                            <Text color="white" fontSize={["sm", "md"]}>Delivery Available</Text>
                        </HStack>
                    </VStack>
                </VStack>

                <VStack align={["center", "center", "flex-start"]} width={["100%", "100%", "auto"]}>
                    <Text 
                        fontSize={["lg", "xl"]} 
                        fontWeight="bold" 
                        color="white" 
                        textAlign={["center", "center", "left"]}
                    >
                        Business Hours
                    </Text>
                    <VStack align={["center", "center", "flex-start"]} gap={2}>
                        <HStack alignItems="center">
                            <Icon color="white" boxSize={[4, 5]}><FaRegClock /></Icon>
                            <Text color="white" fontSize={["sm", "md"]} fontWeight="medium">Operating Hours</Text>
                        </HStack>
                        {WorkingHours.map((hour, index) => (
                            <Text 
                                key={index} color="white" fontSize={["xs", "sm"]} 
                                textAlign={["center", "center", "left"]}
                            >
                                {hour}
                            </Text>
                        ))}
                    </VStack>
                </VStack>
            </Flex>

            <Text 
                color="gray.300" fontSize={["xs", "sm"]} 
                textAlign="center" pt={[4, 6]} fontStyle={'italic'}
                borderTop="1px solid" borderColor="green.700"
            >
                © 2025 Frozen Haven. All rights reserved.
            </Text>
        </Stack>
    );
}