'use client';

import { useState } from 'react';
import { useAdminAuth } from '@/lib/firebase/useAuth';
import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
  Card,
  Alert,
  Field,
  Fieldset,
  Input,
  Circle,
} from '@chakra-ui/react';
import { ColorModeButton, useColorModeValue } from '@/components/ui/color-mode';
import { FaLeaf } from 'react-icons/fa';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { adminSignIn, error, loading } = useAdminAuth();

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminSignIn(email, password);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box minH="100vh" bg={bgColor} py={12} position="relative">
      {/* Color mode toggle */}
      <Box position="absolute" top={4} right={4}>
        <ColorModeButton />
      </Box>

      <Container maxW="lg">
        <VStack p={8}>
          {/* Logo and Title */}
          <VStack p={3}>
            <Circle size="60px" bg="green.700" color="white" cursor="pointer">
              <FaLeaf size={'30px'} />
            </Circle>
            <Heading
              fontSize="2xl"
              fontWeight="bold"
              textAlign="center"
              color={textColor}
            >
              Frozen Haven Admin
            </Heading>
            <Text fontSize="md" color="gray.500" textAlign="center">
              Sign in to access your admin dashboard
            </Text>
          </VStack>

          {/* Login Card */}
          <Card.Root
            w="full"
            bg={cardBg}
            borderWidth="1px"
            borderColor={borderColor}
            borderRadius="xl"
            boxShadow="xl"
            overflow="hidden"
          >
            <Card.Body>
              <form onSubmit={handleSubmit}>
                <VStack p={4} align="stretch">
                  {error && (
                    <Alert.Root status="error" borderRadius="md">
                      {error}
                    </Alert.Root>
                  )}

                  <Fieldset.Root size="lg">
                    <Fieldset.Legend>Admin Login</Fieldset.Legend>
                    <Fieldset.Content>
                      <Field.Root required>
                        <Field.Label>Email address</Field.Label>
                        <Input
                          type="email"
                          placeholder="admin@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </Field.Root>

                      <Field.Root required>
                        <Field.Label>Password</Field.Label>
                        <Input
                          type="password"
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </Field.Root>
                    </Fieldset.Content>
                  </Fieldset.Root>

                  <Button
                    mt={4}
                    type="submit"
                    colorPalette="green"
                    size="lg"
                    width="full"
                    loading={loading}
                    loadingText="Signing in..."
                    borderRadius="md"
                  >
                    Sign In
                  </Button>
                </VStack>
              </form>
            </Card.Body>
          </Card.Root>

          {/* Footer */}
          <Text fontSize="sm" color="gray.500">
            © {new Date().getFullYear()} Frozen Haven. All rights reserved.
          </Text>
        </VStack>
      </Container>
    </Box>
  );
}
