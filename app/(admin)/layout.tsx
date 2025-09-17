'use client'
import { ReactNode, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Box,
    Flex,
    VStack,
    HStack,
    Text,
    Button,
    Badge,
    Separator,
    Circle,
    IconButton,
} from '@chakra-ui/react';
import { useColorModeValue, ColorModeButton } from "@/components/ui/color-mode"
import {
    FaTachometerAlt,
    FaBoxes,
    FaShoppingCart,
    FaUsers,
    FaChartBar,
    FaCog,
    FaSignOutAlt,
    FaStore,
    FaLeaf,
    FaBars,
    FaTimes
} from 'react-icons/fa';

interface AdminLayoutProps {
    children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Enhanced color mode values for better dark mode support
    const bgColor = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const mainBgColor = useColorModeValue('gray.50', 'gray.900');
    const textColor = useColorModeValue('gray.800', 'gray.100');
    const mutedTextColor = useColorModeValue('gray.500', 'gray.400');
    const hoverBg = useColorModeValue('green.50', 'green.900');
    const activeBg = useColorModeValue('green.100', 'green.800');
    const activeColor = useColorModeValue('green.700', 'green.200');

    // Responsive sidebar width
    const sidebarWidth = {
        base: isMobileMenuOpen ? '250px' : '0',
        md: isCollapsed ? '50px' : '250px'
    };

    const NavLink = ({ href, icon, children, badge }: {
        href: string;
        icon: ReactNode;
        children: ReactNode;
        badge?: number;
    }) => {
        const isActive = pathname === href || pathname.startsWith(href + '/');

        return (
            <Link href={href} style={{ textDecoration: 'none', width: '100%' }}>
                <HStack
                    p={3}
                    borderRadius="lg"
                    bg={isActive ? activeBg : 'transparent'}
                    color={isActive ? activeColor : mutedTextColor}
                    _hover={{ bg: hoverBg, color: activeColor }}
                    transition="all 0.2s"
                    justify={isCollapsed ? "center" : "space-between"}
                    cursor="pointer"
                    position="relative"
                >
                    <HStack gap={isCollapsed ? 0 : 3}>
                        <Box>{icon}</Box>
                        {!isCollapsed && (
                            <Text fontWeight={isActive ? 'semibold' : 'medium'}>{children}</Text>
                        )}
                    </HStack>
                    {!isCollapsed && badge && badge > 0 && (
                        <Badge colorPalette="red" borderRadius="full" minW="20px" textAlign="center">
                            {badge}
                        </Badge>
                    )}
                    {isCollapsed && badge && badge > 0 && (
                        <Badge
                            colorPalette="red"
                            borderRadius="full"
                            minW="16px"
                            h="16px"
                            fontSize="xs"
                            position="absolute"
                            top="1"
                            right="1"
                        >
                            {badge}
                        </Badge>
                    )}
                </HStack>
            </Link>
        );
    };

    return (
        <Flex minH="100vh" bg={mainBgColor}>
            {/* Mobile Menu Toggle */}
            <IconButton
                aria-label="Open menu"
                display={{ base: 'flex', md: 'none' }}
                position="fixed"
                top={4}
                left={4}
                zIndex={20}
                onClick={() => setIsMobileMenuOpen(true)}
                bg={bgColor}
                size="md"
                shadow="md"
                color={textColor}
                _hover={{ bg: hoverBg }}
            >
                <FaBars />
            </IconButton>

            {/* Mobile Menu Backdrop */}
            <Box
                position="fixed"
                top={0}
                left={0}
                right={0}
                bottom={0}
                bg="blackAlpha.600"
                zIndex={15}
                display={{ base: isMobileMenuOpen ? 'block' : 'none', md: 'none' }}
                onClick={() => setIsMobileMenuOpen(false)}
                transition="opacity 0.2s"
                opacity={isMobileMenuOpen ? 1 : 0}
                backdropFilter="blur(2px)"
            />

            {/* Sidebar */}
            <Box
                w={sidebarWidth}
                bg={bgColor}
                borderRight="1px solid"
                borderColor={borderColor}
                p={{ base: 6, md: isCollapsed ? 2 : 6 }}
                position="fixed"
                h="100vh"
                overflowY="auto" 
                transition="all 0.3s ease"
                zIndex={1000}
                transform={{ base: isMobileMenuOpen ? 'translateX(0)' : 'translateX(-100%)', md: 'translateX(0)' }}
                display={{ base: 'block', md: 'block' }}
                boxShadow={{ base: isMobileMenuOpen ? '4px 0 8px rgba(0, 0, 0, 0.1)' : 'none', md: 'none' }}
            >
                <VStack align={isCollapsed ? "center" : "start"} gap={6} position="relative">
                    {/* Mobile Close Button */}
                    <IconButton
                        aria-label="Close menu"
                        position="absolute"
                        right={0}
                        top={0}
                        size="sm"
                        variant="ghost"
                        display={{ base: 'flex', md: 'none' }}
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        <FaTimes />
                    </IconButton>

                    {/* Logo & Toggle */}
                    {!isCollapsed ? (
                        // Horizontal layout when expanded
                        <HStack justify="space-between" w="100%" mt={{ base: 8, md: 0 }}>
                            <Link href="/" style={{ textDecoration: 'none' }}>
                                <HStack cursor="pointer">
                                    <Circle size={{ base: "36px", md: "40px" }} bg="green.700" color="white">
                                        <FaLeaf />
                                    </Circle>
                                    <VStack align="start" gap={0}>
                                        <Text fontSize={{ base: "md", md: "lg" }} fontWeight="bold" color="green.700">
                                            Frozen Haven
                                        </Text>
                                    </VStack>
                                </HStack>
                            </Link>

                            {/* Toggle Button - Hidden on mobile */}
                            <IconButton
                                aria-label="Collapse sidebar"
                                size="sm"
                                variant="ghost"
                                display={{ base: 'none', md: 'flex' }}
                                onClick={() => setIsCollapsed(!isCollapsed)}
                            >
                                <FaTimes />
                            </IconButton>
                        </HStack>
                    ) : (
                        // Vertical layout when collapsed
                        <VStack gap={3} w="100%">
                            <Link href="/" style={{ textDecoration: 'none' }}>
                                <Circle size="40px" bg="green.700" color="white" cursor="pointer">
                                    <FaLeaf />
                                </Circle>
                            </Link>

                            {/* Toggle Button */}
                            <IconButton
                                aria-label="Expand sidebar"
                                size="sm"
                                variant="ghost"
                                onClick={() => setIsCollapsed(!isCollapsed)}
                            >
                                <FaBars />
                            </IconButton>
                        </VStack>
                    )}

                    {!isCollapsed && <ColorModeButton size="sm" alignSelf="flex-end" />}

                    <Separator />

                    {/* Navigation */}
                    <VStack align={isCollapsed ? "center" : "start"} gap={2} w="100%">
                        {!isCollapsed && (
                            <Text fontSize="xs" fontWeight="bold" color={mutedTextColor} textTransform="uppercase">
                                Dashboard
                            </Text>
                        )}
                        <NavLink href="/admin" icon={<FaTachometerAlt />}>
                            Overview
                        </NavLink>
                        <NavLink href="/admin/analytics" icon={<FaChartBar />}>
                            Analytics
                        </NavLink>
                    </VStack>

                    <VStack align={isCollapsed ? "center" : "start"} gap={2} w="100%">
                        {!isCollapsed && (
                            <Text fontSize="xs" fontWeight="bold" color={mutedTextColor} textTransform="uppercase">
                                Inventory
                            </Text>
                        )}
                        <NavLink href="/admin/products" icon={<FaBoxes />} badge={3}>
                            Products
                        </NavLink>
                        <NavLink href="/admin/categories" icon={<FaStore />}>
                            Categories
                        </NavLink>
                        <NavLink href="/admin/stock" icon={<FaBoxes />}>
                            Stock Management
                        </NavLink>
                    </VStack>

                    <VStack align={isCollapsed ? "center" : "start"} gap={2} w="100%">
                        {!isCollapsed && (
                            <Text fontSize="xs" fontWeight="bold" color={mutedTextColor} textTransform="uppercase">
                                Orders & Customers
                            </Text>
                        )}
                        <NavLink href="/admin/orders" icon={<FaShoppingCart />} badge={23}>
                            Orders
                        </NavLink>
                        <NavLink href="/admin/customers" icon={<FaUsers />}>
                            Customers
                        </NavLink>
                    </VStack>

                    <VStack align={isCollapsed ? "center" : "start"} gap={2} w="100%">
                        {!isCollapsed && (
                            <Text fontSize="xs" fontWeight="bold" color={mutedTextColor} textTransform="uppercase">
                                System
                            </Text>
                        )}
                        <NavLink href="/admin/settings" icon={<FaCog />}>
                            Settings
                        </NavLink>
                    </VStack>

                    <Separator />

                    {/* Quick Actions */}
                    {!isCollapsed && (
                        <VStack align="start" gap={2} w="100%">
                            <Text fontSize="xs" fontWeight="bold" color={mutedTextColor} textTransform="uppercase">
                                Quick Actions
                            </Text>
                            <Link href="/admin/products/new" style={{ width: '100%' }}>
                                <Button size="sm" bg="green.600" color="white" w="100%" _hover={{ bg: 'green.700' }}>
                                    Add Product
                                </Button>
                            </Link>
                            <Link href="/" style={{ width: '100%' }}>
                                <Button size="sm" variant="outline" w="100%">
                                    <FaStore style={{ marginRight: '8px' }} />
                                    View Store
                                </Button>
                            </Link>
                        </VStack>
                    )}

                    {/* User Section */}
                    <Box mt="auto" w="100%">
                        <Separator mb={4} />
                        <VStack align={isCollapsed ? "center" : "start"} gap={2} w="100%">
                            {!isCollapsed ? (
                                <>
                                    <HStack justify="space-between" w="100%">
                                        <VStack align="start" gap={0}>
                                            <Text fontSize="sm" fontWeight="medium" color={textColor}>Admin User</Text>
                                            <Text fontSize="xs" color={mutedTextColor}>admin@frozenhaven.com</Text>
                                        </VStack>
                                    </HStack>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        colorPalette="red"
                                        w="100%"
                                    >
                                        <FaSignOutAlt />
                                        Logout
                                    </Button>
                                </>
                            ) : (
                                <IconButton
                                    aria-label="Logout"
                                    size="sm"
                                    variant="outline"
                                    colorPalette="red"
                                >
                                    <FaSignOutAlt />
                                </IconButton>
                            )}
                        </VStack>
                    </Box>
                </VStack>
            </Box>

            {/* Main Content */}
            <Box
                flex="1"
                ml={{ base: isMobileMenuOpen ? '250px' : '0', md: sidebarWidth }}
                transition="margin-left 0.3s ease"
                w="full"
                p={{ base: 4, md: 6 }}
                mt={{ base: 16, md: 0 }}
                minW="0"
                overflowX="hidden"
                position="relative"
            >
                {children}
            </Box>
        </Flex>
    );
}
