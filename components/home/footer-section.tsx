import Link from "next/link";
import { Stack, Text, Button, Box } from "@chakra-ui/react";

export default function FooterSection() {
    return (
        <Stack bg="green.800" p={[6, 8, 12]} align="center" gap={6}>
            <Box textAlign="center" maxWidth="800px">
                <Text fontSize={['3xl', '4xl', '5xl']} fontWeight="bold" color="white" mb={4}>Ready to Order?</Text>
                <Text fontSize={['md', 'lg', 'xl']} color="white" px={[4, 0]} lineHeight="relaxed" opacity={0.9}>
                    Browse our selection of fresh and affordable frozen foods and have them delivered to your doorstep.
                </Text>
            </Box>
            
            <Link href="/shop" passHref>
                <Button 
                    bg="white" 
                    color="green.800" 
                    fontWeight="bold" 
                    _hover={{ bg: 'gray.100', transform: 'translateY(-2px)' }}
                    size={['md', 'lg']}
                    px={[6, 8]}
                    py={[3, 4]}
                    transition="all 0.3s"
                    boxShadow="md"
                >
                    Shop Now
                </Button>
            </Link>
        </Stack>
    );
}