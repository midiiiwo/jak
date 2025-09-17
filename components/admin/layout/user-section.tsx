'use client';
import { useAdminAuth } from '@/lib/firebase/useAuth';
import { Box, VStack, HStack, Text, Button, IconButton, Separator } from '@chakra-ui/react';
import { FaSignOutAlt } from 'react-icons/fa';

interface UserSectionProps {
    isCollapsed: boolean;
    textColor: string;
    mutedTextColor: string;
    handleLogout: () => void;
}

export function UserSection({ isCollapsed, textColor, mutedTextColor, handleLogout }: UserSectionProps) {
    const { user } = useAdminAuth();
    
    return (
        <Box mt="auto" w="100%">
            <Separator mb={4} />
            <VStack align={isCollapsed ? "center" : "start"} gap={2} w="100%">
                {!isCollapsed ? (
                    <>
                        <HStack justify="space-between" w="100%">
                            <VStack align="start" gap={0}>
                                <Text fontSize="sm" fontWeight="medium" color={textColor}>
                                    Administrator
                                </Text>
                                <Text fontSize="xs" color={mutedTextColor}>
                                    {user?.email || 'Admin User'}
                                </Text>
                            </VStack>
                        </HStack>
                        <Button
                            size="sm"
                            variant="outline"
                            colorPalette="red"
                            w="100%"
                            onClick={handleLogout}
                        >
                            <FaSignOutAlt />
                            Logout
                        </Button>
                    </>
                ) : (
                    <IconButton
                        aria-label="Logout"
                        size="sm"
                        onClick={handleLogout}
                        variant="outline"
                        colorPalette="red"
                    >
                        <FaSignOutAlt />
                    </IconButton>
                )}
            </VStack>
        </Box>
    );
}