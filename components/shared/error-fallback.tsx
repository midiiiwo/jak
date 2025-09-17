import { Box, VStack, Circle, Icon, Heading, Text, Button } from '@chakra-ui/react';
import { FaExclamationTriangle } from 'react-icons/fa';
import { useColorModeValue } from '@/components/ui/color-mode';

interface ErrorFallbackProps {
    title?: string;
    message?: string;
    onRetry?: () => void;
    retryText?: string;
}

export default function ErrorFallback({
    title = "Something went wrong",
    message = "We encountered an error while loading this page",
    onRetry,
    retryText = "Try Again"
}: ErrorFallbackProps) {
    const bgColor = useColorModeValue('gray.50', 'gray.900');
    const textColor = useColorModeValue('gray.800', 'white');

    return (
        <Box p={8} bg={bgColor} minH="50vh">
            <VStack gap={6} justify="center" align="center" minH="50vh">
                <Circle size="80px" bg="red.100" color="red.600">
                    <Icon boxSize={8}>
                        <FaExclamationTriangle />
                    </Icon>
                </Circle>
                <VStack gap={2}>
                    <Heading size="lg" color={textColor}>{title}</Heading>
                    <Text color="gray.500" textAlign="center">{message}</Text>
                    {onRetry && (
                        <Button onClick={onRetry} colorPalette="red" variant="outline" mt={4}>
                            {retryText}
                        </Button>
                    )}
                </VStack>
            </VStack>
        </Box>
    );
}
