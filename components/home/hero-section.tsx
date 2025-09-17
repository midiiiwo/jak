'use client'
import Link from "next/link";
import { Flex, Stack, Text, Button, Image, Box, HStack } from "@chakra-ui/react";

export default function HeroSection() {
    const handleContactScroll = () => {
        const footer = document.getElementById('footer-contact');
        if (footer) {
            footer.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <Flex
            bg="#FFBF00"
            color="gray.900"
            minH={["70vh", "80vh"]}
            width="100%"
            alignItems="center"
            justifyContent="center"
            px={[4, 6, 8]}
            py={[6, 8, 12]}
        >
            <Flex
                justifyContent="space-between"
                direction={['column', 'column', 'row']}
                alignItems="center"
                width="100%"
                maxW="1200px"
                gap={[8, 10, 12]}
            >
                <Stack gap={6} flex="1" textAlign={['center', 'center', 'left']}>
                    <Text 
                        fontSize={['4xl', '5xl', '6xl']} fontWeight="extrabold" 
                        lineHeight="shorter" maxW={['100%', '100%', '600px']}
                    >
                        Fresh & Affordable Frozen Foods
                    </Text>
                    <Text fontSize={['lg', 'xl', '2xl']} maxW={['100%', '100%', '500px']} opacity={0.9}>
                        Quality frozen products delivered to your doorstep. Shop from our wide selection of fresh meats, seafood, and more.
                    </Text>

                    <HStack
                        gap={4}
                        justifyContent={['center', 'center', 'flex-start']}
                        direction={['column', 'row']}
                        width="100%"
                        flexWrap="wrap"
                    >
                        <Link href="/shop" passHref>
                            <Button
                                bg="green.700"
                                color="white"
                                size="lg"
                                px={8}
                                py={3}
                                borderRadius="full"
                                fontWeight="bold"
                                _hover={{
                                    bg: 'green.800',
                                    transform: 'translateY(-2px)',
                                    boxShadow: 'lg'
                                }}
                                transition="all 0.3s"
                            >
                                Shop Now
                            </Button>
                        </Link>
                        <Button
                            onClick={handleContactScroll}
                            variant="outline"
                            borderColor="green.700"
                            color="green.700"
                            size="lg"
                            px={8}
                            py={3}
                            borderRadius="full"
                            fontWeight="bold"
                            _hover={{
                                bg: 'green.700',
                                color: 'white',
                                transform: 'translateY(-2px)',
                                boxShadow: 'lg'
                            }}
                            transition="all 0.3s"
                        >
                            Contact Us
                        </Button>
                    </HStack>
                </Stack>

                <Box flex="1" maxW={['400px', '500px']} width="100%">
                    <Image
                        src="/img-2.png"
                        alt="Fresh frozen foods"
                        borderRadius="2xl"
                        boxShadow="2xl"
                        width="100%"
                        height="auto"
                        objectFit="cover"
                    />
                </Box>
            </Flex>
        </Flex>
    );
}