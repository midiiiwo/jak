'use client';
import { VStack, HStack, Circle, IconButton, Separator, Text, Button } from '@chakra-ui/react';
import Link from 'next/link';
import { FaLeaf, FaTimes, FaBars, FaStore, FaTachometerAlt, FaChartBar, FaBoxes, FaShoppingCart, FaUsers, FaCog } from 'react-icons/fa';
import { ColorModeButton } from "@/components/ui/color-mode";
import { NavLink } from './nav-link';
import { UserSection } from './user-section';

interface SidebarProps {
    isCollapsed: boolean;
    isMobileMenuOpen: boolean;
    pathname: string;
    bgColor: string;
    textColor: string;
    mutedTextColor: string;
    hoverBg: string;
    activeBg: string;
    activeColor: string;
    handleLogout: () => void;
    onToggleCollapse: () => void;
    onCloseMobile: () => void;
}

export function Sidebar({ 
    isCollapsed, 
    isMobileMenuOpen, 
    pathname, 
    bgColor, 
    textColor, 
    mutedTextColor, 
    hoverBg, 
    activeBg, 
    activeColor, 
    handleLogout, 
    onToggleCollapse, 
    onCloseMobile 
}: SidebarProps) {
    return (
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
                onClick={onCloseMobile}
            >
                <FaTimes />
            </IconButton>

            {/* Logo & Toggle */}
            {!isCollapsed ? (
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
                    <IconButton
                        aria-label="Collapse sidebar"
                        size="sm"
                        variant="ghost"
                        display={{ base: 'none', md: 'flex' }}
                        onClick={onToggleCollapse}
                    >
                        <FaTimes />
                    </IconButton>
                </HStack>
            ) : (
                <VStack gap={3} w="100%">
                    <Link href="/" style={{ textDecoration: 'none' }}>
                        <Circle size="40px" bg="green.700" color="white" cursor="pointer">
                            <FaLeaf />
                        </Circle>
                    </Link>
                    <IconButton
                        aria-label="Expand sidebar"
                        size="sm"
                        variant="ghost"
                        onClick={onToggleCollapse}
                    >
                        <FaBars />
                    </IconButton>
                </VStack>
            )}

            {!isCollapsed && <ColorModeButton size="sm" alignSelf="flex-end" />}

            <Separator />

            {/* Navigation Sections */}
            <VStack align={isCollapsed ? "center" : "start"} gap={2} w="100%">
                {!isCollapsed && (
                    <Text fontSize="xs" fontWeight="bold" color={mutedTextColor} textTransform="uppercase">
                        Dashboard
                    </Text>
                )}
                <NavLink 
                    href="/admin" 
                    icon={<FaTachometerAlt />}
                    isActive={pathname === '/admin' || pathname.startsWith('/admin/')}
                    isCollapsed={isCollapsed}
                    hoverBg={hoverBg}
                    activeBg={activeBg}
                    activeColor={activeColor}
                    mutedTextColor={mutedTextColor}
                >
                    Overview
                </NavLink>
                <NavLink 
                    href="/admin/analytics" 
                    icon={<FaChartBar />}
                    isActive={pathname === '/admin/analytics'}
                    isCollapsed={isCollapsed}
                    hoverBg={hoverBg}
                    activeBg={activeBg}
                    activeColor={activeColor}
                    mutedTextColor={mutedTextColor}
                >
                    Analytics
                </NavLink>
            </VStack>

            {/* Add other navigation sections similarly */}

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

            <UserSection 
                isCollapsed={isCollapsed}
                textColor={textColor}
                mutedTextColor={mutedTextColor}
                handleLogout={handleLogout}
            />
        </VStack>
    );
}