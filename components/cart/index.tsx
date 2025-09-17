'use client'
import { Box, Stack, Circle, Icon, Heading, Button, Flex, Text, VStack, Separator } from "@chakra-ui/react";
import { BiSolidShoppingBags } from "react-icons/bi";
import { FaCartPlus } from "react-icons/fa6";
import { useCart } from "@/contexts/cart-context";
import Link from "next/link";
import { toaster } from "@/components/ui/toaster";
import { useCartPayment } from "@/hooks/use-cart-payment";
import { CartItem } from "./cart-item";
import { CreateInvoiceRequest } from "@/types/kowri";

export default function CartPage() {
    const { cartItems, updateQuantity, removeFromCart, clearCart } = useCart();
    const { processPayment, loading, getTotalPrice } = useCartPayment();

    const handleCheckout = async () => {
        if (cartItems.length === 0) {
            toaster.error({
                title: "Cart is Empty",
                description: "Please add items to your cart before checkout.",
                duration: 3000,
            });
            return;
        }

        const orderId = `ORDER_${Date.now()}`;

        try {
            const orderResponse = await fetch('/api/admin/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: orderId,
                    customer: {
                        name: "Customer",
                        email: "customer@example.com",
                        phone: "+233123456789"
                    },
                    items: cartItems.map(item => ({
                        productId: item.id,
                        name: item.title,
                        quantity: item.quantity,
                        unitPrice: parseFloat(item.price.replace('GHC ', '')),
                        total: parseFloat(item.price.replace('GHC ', '')) * item.quantity,
                    })),
                    total: getTotalPrice(),
                    status: 'pending',
                    paymentMethod: 'kowri',
                    orderDate: new Date().toISOString()
                })
            });

            if (!orderResponse.ok) {
                throw new Error('Failed to create order');
            }

            const invoiceData: CreateInvoiceRequest = {
                merchantOrderId: orderId,
                amount: getTotalPrice(),
                items: cartItems.map(item => ({
                    name: item.title,
                    quantity: item.quantity,
                    unit_price: parseFloat(item.price.replace('GHC ', '')),
                    total_price: parseFloat(item.price.replace('GHC ', '')) * item.quantity,
                })),
                description: `Order for ${cartItems.length} items from Frozen Haven`,
                customer_name: "Customer",
                customer_email: "customer@example.com",
                customer_phone: "+233123456789",
            };

            await processPayment(invoiceData);
        } catch (err) {
            console.error('Checkout error:', err);
            toaster.error({
                title: "Checkout Failed",
                description: "There was an error processing your order. Please try again.",
                duration: 5000,
            });
        }
    };

    const handleQuantityChange = (id: string, newQuantity: number) => {
        if (newQuantity <= 0) {
            removeFromCart(id);
            toaster.info({
                title: "Item Removed",
                description: "Item has been removed from your cart",
                duration: 2000,
            });
        } else {
            updateQuantity(id, newQuantity);
        }
    };

    const handleRemoveItem = (id: string, title: string) => {
        removeFromCart(id);
        toaster.info({
            title: "Item Removed",
            description: `${title} has been removed from your cart`,
            duration: 2000,
        });
    };

    const handleClearCart = () => {
        clearCart();
        toaster.info({
            title: "Cart Cleared",
            description: "All items have been removed from your cart",
            duration: 2000,
        });
    };

    if (cartItems.length === 0) {
        return (
            <>
                <Box bg="white" h={20}></Box>
                <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" px={4}>
                    <Stack
                        justifyContent="center"
                        alignItems="center"
                        p={[8, 12, 16]}
                        bg="gray.50"
                        maxW="600px"
                        width={['95%', '100%']}
                        border="3px solid"
                        borderColor="gray.200"
                        borderRadius="2xl"
                    >
                        <Circle bg="gray.100" size={['100px', '120px', '140px']} mb={6}>
                            <Icon color="gray.600" boxSize={['50px', '60px', '70px']}><FaCartPlus /></Icon>
                        </Circle>
                        <Heading color="gray.600" size={['xl', '2xl', '3xl']} textAlign="center" mb={4} fontWeight="bold">
                            Your cart is empty
                        </Heading>
                        <Text
                            color="gray.500" fontSize={['md', 'lg', 'xl']}
                            textAlign="center" mb={8} maxW="400px"
                            lineHeight="relaxed"
                        >
                            Start adding some delicious frozen foods to your cart
                        </Text>
                        <Link href="/shop" passHref style={{ textDecoration: 'none' }}>
                            <Button
                                bg="green.800"
                                color="white"
                                variant="subtle"
                                size={['lg', 'xl']}
                                px={[6, 8]}
                                py={[3, 4]}
                                fontSize={['md', 'lg']}
                                _hover={{ bg: 'green.700', transform: 'translateY(-2px)' }}
                                transition="all 0.3s"
                                boxShadow="md"
                                _active={{ transform: 'translateY(0)' }}
                            >
                                <Icon mr={3} boxSize={['20px', '24px']}><BiSolidShoppingBags /></Icon>
                                Shop Now
                            </Button>
                        </Link>
                    </Stack>
                </Box>
            </>
        );
    }

    return (
        <>
            <Box bg="white" h={20}></Box>
            <Box minH="100vh" p={[4, 6, 8]}>
                <VStack maxW="1200px" mx="auto">
                    <Flex justify="space-between" align="center" w="100%" direction={['column', 'row']} gap={[4, 0]}>
                        <Heading color="gray.700" size={['lg', 'xl']}>
                            Shopping Cart ({cartItems.length} items)
                        </Heading>
                        <Button onClick={handleClearCart} colorScheme="red" variant="outline" size={['sm', 'md']} _hover={{ color: 'white' }}>
                            Clear Cart
                        </Button>
                    </Flex>

                    <VStack w="100%">
                        {cartItems.map((item) => (
                            <CartItem
                                key={item.id}
                                {...item}
                                onQuantityChange={handleQuantityChange}
                                onRemove={handleRemoveItem}
                            />
                        ))}
                    </VStack>

                    <Separator />

                    <Box p={6} bg="green.50" borderRadius="lg" w="100%" border="2px solid" borderColor="green.200">
                        <VStack>
                            <Heading size="md" color="green.700">Order Summary</Heading>
                            <Flex justify="space-between" w="100%" fontSize="lg">
                                <Text fontWeight="medium">Total Items:</Text>
                                <Text fontWeight="bold">{cartItems.reduce((sum, item) => sum + item.quantity, 0)}</Text>
                            </Flex>
                            <Flex justify="space-between" w="100%" fontSize="xl">
                                <Text fontWeight="bold">Total Price:</Text>
                                <Text fontWeight="bold" color="green.600">GHC {getTotalPrice().toFixed(2)}</Text>
                            </Flex>
                            <Button
                                onClick={handleCheckout}
                                bg="green.700"
                                color="white"
                                size="lg"
                                w={['100%', 'auto']}
                                _hover={{ bg: 'green.800' }}
                                mt={4}
                                loading={loading}
                                loadingText="Processing Payment..."
                            >
                                Proceed to Checkout
                            </Button>
                        </VStack>
                    </Box>
                </VStack>
            </Box>
        </>
    );
}