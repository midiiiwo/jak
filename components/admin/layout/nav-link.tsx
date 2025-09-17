'use client';
import Link from 'next/link';
import { HStack, Box, Text, Badge } from '@chakra-ui/react';
import { ReactNode } from 'react';

interface NavLinkProps {
    href: string;
    icon: ReactNode;
    children: ReactNode;
    badge?: number;
    isCollapsed?: boolean;
    isActive: boolean;
    hoverBg: string;
    activeBg: string;
    activeColor: string;
    mutedTextColor: string;
}

export function NavLink({ 
    href, 
    icon, 
    children, 
    badge, 
    isCollapsed, 
    isActive, 
    hoverBg, 
    activeBg, 
    activeColor, 
    mutedTextColor 
}: NavLinkProps) {
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
}