'use client';
import { ReactNode } from 'react';
import { Flex, Box } from '@chakra-ui/react';
import { useAdminLayout } from '../../../hooks/use-admin-layout';
import { MobileMenu } from './mobile-menu';
import { Sidebar } from './sidebar';

interface AdminLayoutProps {
    children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const {
        pathname,
        isCollapsed,
        isMobileMenuOpen,
        handleLogout,
        bgColor,
        mainBgColor,
        textColor,
        mutedTextColor,
        hoverBg,
        activeBg,
        activeColor,
        sidebarWidth,
        setIsCollapsed,
        setIsMobileMenuOpen
    } = useAdminLayout();

    return (
        <Flex minH="100vh" bg={mainBgColor}>
            <MobileMenu
                isMobileMenuOpen={isMobileMenuOpen}
                bgColor={bgColor}
                textColor={textColor}
                hoverBg={hoverBg}
                onMenuToggle={() => setIsMobileMenuOpen(true)}
                onMenuClose={() => setIsMobileMenuOpen(false)}
            >
                <Sidebar
                    isCollapsed={isCollapsed}
                    isMobileMenuOpen={isMobileMenuOpen}
                    pathname={pathname}
                    bgColor={bgColor}
                    textColor={textColor}
                    mutedTextColor={mutedTextColor}
                    hoverBg={hoverBg}
                    activeBg={activeBg}
                    activeColor={activeColor}
                    handleLogout={handleLogout}
                    onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
                    onCloseMobile={() => setIsMobileMenuOpen(false)}
                />
            </MobileMenu>

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