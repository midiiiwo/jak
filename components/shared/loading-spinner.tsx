import { Box, VStack, Circle, Icon, Heading, Text, Progress } from '@chakra-ui/react';
import { FaBoxes } from 'react-icons/fa';
import { useColorModeValue } from '@/components/ui/color-mode';

interface LoadingSpinnerProps {
    title?: string;
    subtitle?: string;
    size?: 'sm' | 'md' | 'lg';
}

export default function LoadingSpinner({
    title = "Loading...",
    subtitle = "Please wait",
    size = 'md'
}: LoadingSpinnerProps) {
    const bgColor = useColorModeValue('gray.50', 'gray.900');
    const textColor = useColorModeValue('gray.800', 'white');

    const iconSize = size === 'sm' ? '40px' : size === 'lg' ? '100px' : '60px';
    const headingSize = size === 'sm' ? 'md' : size === 'lg' ? 'xl' : 'lg';

    return (
        <Box p={8} bg={bgColor} minH="50vh">
            <VStack gap={6} justify="center" align="center" minH="50vh">
                <Circle size={iconSize} bg="green.100" color="green.600">
                    <Icon boxSize={size === 'sm' ? 4 : size === 'lg' ? 10 : 6}>
                        <FaBoxes />
                    </Icon>
                </Circle>
                <VStack gap={2}>
                    <Heading size={headingSize} color={textColor}>{title}</Heading>
                    <Text color="gray.500">{subtitle}</Text>
                    <Progress.Root maxW="200px" size="sm" colorPalette="green">
                        <Progress.Track>
                            <Progress.Range />
                        </Progress.Track>
                    </Progress.Root>
                </VStack>
            </VStack>
        </Box>
    );
}
