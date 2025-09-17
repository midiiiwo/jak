'use client';
import { Box, IconButton } from '@chakra-ui/react';
import { FaBars } from 'react-icons/fa';

interface MobileMenuProps {
    isMobileMenuOpen: boolean;
    bgColor: string;
    textColor: string;
    hoverBg: string;
    // sidebarWidth: any;
    onMenuToggle: () => void;
    onMenuClose: () => void;
    children: React.ReactNode;
}

export function MobileMenu({ 
    isMobileMenuOpen, 
    bgColor, 
    textColor, 
    hoverBg, 
    // sidebarWidth, 
    onMenuToggle, 
    onMenuClose, 
    children 
}: MobileMenuProps) {
    return (
        <>
            {/* Mobile Menu Toggle */}
            <IconButton
                aria-label="Open menu"
                display={{ base: 'flex', md: 'none' }}
                position="fixed"
                top={4}
                left={4}
                zIndex={20}
                onClick={onMenuToggle}
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
                onClick={onMenuClose}
                transition="opacity 0.2s"
                opacity={isMobileMenuOpen ? 1 : 0}
                backdropFilter="blur(2px)"
            />

            {/* Sidebar */}
            <Box
                w={'250px'}
                bg={bgColor}
                borderRight="1px solid"
                borderColor="gray.200"
                p={{ base: 6, md: isMobileMenuOpen ? 2 : 6 }}
                position="fixed"
                h="100vh"
                overflowY="auto"
                transition="all 0.3s ease"
                zIndex={1000}
                transform={{ base: isMobileMenuOpen ? 'translateX(0)' : 'translateX(-100%)', md: 'translateX(0)' }}
                display={{ base: 'block', md: 'block' }}
                boxShadow={{ base: isMobileMenuOpen ? '4px 0 8px rgba(0, 0, 0, 0.1)' : 'none', md: 'none' }}
            >
                {children}
            </Box>
        </>
    );
}