'use client';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useAdminAuth } from '@/lib/firebase/useAuth';
import { useColorModeValue } from '@/components/ui/color-mode';

export function useAdminLayout() {
    const { user, adminLogout } = useAdminAuth();
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await adminLogout();
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    // Color values
    const bgColor = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const mainBgColor = useColorModeValue('gray.50', 'gray.900');
    const textColor = useColorModeValue('gray.800', 'gray.100');
    const mutedTextColor = useColorModeValue('gray.500', 'gray.400');
    const hoverBg = useColorModeValue('green.50', 'green.900');
    const activeBg = useColorModeValue('green.100', 'green.800');
    const activeColor = useColorModeValue('green.700', 'green.200');

    const sidebarWidth = {
        base: isMobileMenuOpen ? '250px' : '0',
        md: isCollapsed ? '50px' : '250px'
    };

    return {
        user,
        pathname,
        isCollapsed,
        isMobileMenuOpen,
        handleLogout,
        bgColor,
        borderColor,
        mainBgColor,
        textColor,
        mutedTextColor,
        hoverBg,
        activeBg,
        activeColor,
        sidebarWidth,
        setIsCollapsed,
        setIsMobileMenuOpen
    };
}