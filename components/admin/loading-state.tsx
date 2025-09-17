'use client';

import { Flex, Spinner, Text } from '@chakra-ui/react';

export default function AdminLoadingState() {
    return (
        <Flex
            minH="100vh"
            width="100%"
            alignItems="center"
            justifyContent="center"
            flexDirection="column"
            bg="gray.50"
        >
            <Spinner
                borderWidth="4px"
                animationDuration="0.65s"
                color="blue.500"
                size="xl"
            />
            <Text mt={4} fontSize="lg" color="gray.600">
                Loading...
            </Text>
        </Flex>
    );
}
