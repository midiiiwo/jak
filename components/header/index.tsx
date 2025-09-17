'use client'
import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Box, Circle, HStack, IconButton, Text, Badge } from '@chakra-ui/react';
import { IoCartOutline } from 'react-icons/io5';
import { LuLeaf } from 'react-icons/lu';
import { useCart } from '@/contexts/cart-context';

interface NavLinkProps {
    href: string;
    children: ReactNode;
    fontSize?: string;
}

function NavLink({ href, children, fontSize = 'sm' }: NavLinkProps) {
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
        <Link href={href} passHref style={{ textDecoration: 'none' }}>
            <Text
                color={isActive ? 'white' : 'green.800'}
                bg={isActive ? 'green.800' : 'transparent'}
                p={[1, 1, 2]}
                borderRadius={isActive ? 'lg' : 'none'}
                transform={isActive ? "translateY(-4px)" : "none"}
                fontSize={isActive ? ['lg', 'xl', '2xl'] : ['xs', 'sm', fontSize]}
                cursor="pointer"
                transition="all 0.3s ease-in-out"
                _hover={{
                    bg: isActive ? 'transparent' : 'green.800',
                    color: isActive ? 'green.800' : 'white',
                    transform: "translateY(-4px)",
                    fontSize: ['lg', 'xl', '2xl'],
                    borderRadius: 'lg',
                }}
            >
                {children}
            </Text>
        </Link>
    );
}

export default function HeaderPage() {
    const pathname = usePathname();
    const { getTotalItems } = useCart();
    const totalItems = getTotalItems();

    return (
        <Box
            color="gray.700"
            bg="whiteAlpha.500"
            p={[2, 3, 4]}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            position="fixed"
            top={0}
            left={0}
            right={0}
            zIndex={1000}
            backdropFilter="blur(10px)"
        >
            <Link href="/" passHref style={{ textDecoration: 'none' }}>
                <HStack as="span" cursor="pointer">
                    <Circle size={["30px", "35px", "40px"]} bg="green.700" color="white"><LuLeaf /></Circle>
                    <Text 
                        fontSize={['lg', 'xl', '2xl']} 
                        fontWeight="bold" color="green.700" 
                        display={['none', 'block', 'block']}
                    >
                        Frozen Haven
                    </Text>
                </HStack>
            </Link>

            <HStack gap={4}>
                <NavLink href="/"><Text fontWeight="bold">Home</Text></NavLink>
                <NavLink href="/shop"><Text fontWeight="bold">Shop</Text></NavLink>
            </HStack>

            <Link href="/cart" passHref style={{ textDecoration: 'none' }}>
                <HStack 
                    as="span" cursor="pointer" 
                    transition="transform 0.3s ease-in-out" 
                    _hover={{ transform: "translateY(-2px)" }} 
                    position="relative"
                >
                    <IconButton
                        transition="all 0.3s ease-in-out"
                        bg={pathname === "/cart" ? 'green.800' : 'transparent'}
                        _hover={{ bg: 'green.800', color: 'white', transform: "scale(1.1)" }}
                        aria-label="Cart"
                        variant="ghost"
                        color={pathname === "/cart" ? 'white' : 'green.700'}
                        size={["md", "md", "lg"]}
                        position="relative"
                    >
                        <IoCartOutline />
                        {totalItems > 0 && (
                            <Badge
                                position="absolute" top="-1" right="-1" bg="red.500" color="white"
                                borderRadius="full" minW="20px" h="20px" fontSize="xs"
                                display="flex" alignItems="center" justifyContent="center"
                            >
                                {totalItems}
                            </Badge>
                        )}
                    </IconButton>
                </HStack>
            </Link>
        </Box>
    );
}