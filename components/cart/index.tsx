'use client'
import { Box, Stack, Circle, Icon, Heading, Button, Flex, Text, Image, HStack, VStack, IconButton, Badge, Separator } from "@chakra-ui/react";
import { BiSolidShoppingBags } from "react-icons/bi";
import { FaCartPlus, FaPlus, FaMinus, FaTrash } from "react-icons/fa6";
import { useCart } from "@/contexts/cart-context";
import Link from "next/link";
import { toaster } from "@/components/ui/toaster";
import { useKowriPayment } from "@/hooks/use-kowri";
import { KowriConfig, CreateInvoiceRequest, KowriCallbackData } from "@/types/kowri";

export default function CartPage() {
    const { cartItems, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCart();

    // Kowri configuration
    const kowriConfig: KowriConfig = {
        appReference: process.env.NEXT_PUBLIC_KOWRI_APP_REFERENCE || '',
        secret: process.env.NEXT_PUBLIC_KOWRI_SECRET || '',
        appId: process.env.NEXT_PUBLIC_KOWRI_APP_ID || '',
        baseUrl: process.env.NEXT_PUBLIC_KOWRI_BASE_URL || 'https://kbposapi.mykowri.com/',
    };

    // Helper function to deduct inventory after successful payment
    const deductInventory = async (items: Array<{ title: string; quantity: number; price: number }>, transactionId: string) => {
        for (const item of items) {
            try {
                // First, get the current stock item to get its ID
                const stockResponse = await fetch('/api/admin/stock');
                const stockData = await stockResponse.json();

                // Find the stock item that matches this cart item
                const stockItem = stockData.find((stock: { name: string }) =>
                    stock.name === item.title ||
                    stock.name.toLowerCase() === item.title.toLowerCase()
                );

                if (stockItem) {
                    // Update the stock quantity
                    const updateResponse = await fetch(`/api/admin/stock/${stockItem.id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            currentStock: Math.max(0, stockItem.currentStock - item.quantity),
                            lastUpdated: new Date().toISOString()
                        })
                    });

                    if (updateResponse.ok) {
                        // Log the stock movement
                        await fetch('/api/admin/stock/movements', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                itemId: stockItem.id,
                                itemName: stockItem.name,
                                type: 'out',
                                quantity: item.quantity,
                                reason: `Customer purchase - Transaction: ${transactionId}`,
                                user: 'System (Customer Order)'
                            })
                        });
                    }
                }
            } catch (error) {
                console.error(`Error updating inventory for ${item.title}:`, error);
            }
        }
    };

    const onPaymentSuccess = async (data: KowriCallbackData) => {
        try {
            // Extract order ID from the transaction
            const orderId = data.cust_ref;

            // Update order status to completed
            if (orderId) {
                await fetch(`/api/admin/orders/${orderId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        status: 'completed',
                        paymentId: data.transaction_id,
                        completedAt: new Date().toISOString()
                    })
                });
            }

            // Deduct inventory for each item in the cart
            await deductInventory(
                cartItems.map(item => ({
                    title: item.title,
                    quantity: item.quantity,
                    price: parseFloat(item.price.replace('GHC ', ''))
                })),
                data.cust_ref
            );

            toaster.success({
                title: "Payment Successful!",
                description: `Thank you for your purchase. Transaction ID: ${data.transaction_id}`,
                duration: 5000,
            });
            clearCart();
        } catch (error) {
            console.error('Error updating inventory:', error);
            toaster.warning({
                title: "Payment Successful, Inventory Update Failed",
                description: `Payment processed successfully, but there was an issue updating inventory. Transaction ID: ${data.transaction_id}`,
                duration: 7000,
            });
            clearCart();
        }
    };

    const onPaymentError = async (error: string) => {
        try {
            // Try to find and update the pending order to failed status
            // Note: This is a simplified approach - in production you'd want to track the order ID more carefully
            const ordersResponse = await fetch('/api/admin/orders');
            if (ordersResponse.ok) {
                const orders = await ordersResponse.json();
                const pendingOrder = orders.find((order: { status: string; orderDate: string }) =>
                    order.status === 'pending' &&
                    Math.abs(new Date(order.orderDate).getTime() - Date.now()) < 5 * 60 * 1000 // Within last 5 minutes
                );

                if (pendingOrder) {
                    await fetch(`/api/admin/orders/${pendingOrder.id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            status: 'failed',
                            failureReason: error,
                            failedAt: new Date().toISOString()
                        })
                    });
                }
            }
        } catch (err) {
            console.error('Error updating failed order status:', err);
        }

        toaster.error({
            title: "Payment Failed",
            description: error,
            duration: 5000,
        });
    };

    const onPaymentCancel = async () => {
        try {
            // Try to find and update the pending order to cancelled status
            const ordersResponse = await fetch('/api/admin/orders');
            if (ordersResponse.ok) {
                const orders = await ordersResponse.json();
                const pendingOrder = orders.find((order: { status: string; orderDate: string }) =>
                    order.status === 'pending' &&
                    Math.abs(new Date(order.orderDate).getTime() - Date.now()) < 5 * 60 * 1000 // Within last 5 minutes
                );

                if (pendingOrder) {
                    await fetch(`/api/admin/orders/${pendingOrder.id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            status: 'cancelled',
                            cancelledAt: new Date().toISOString()
                        })
                    });
                }
            }
        } catch (err) {
            console.error('Error updating cancelled order status:', err);
        }

        toaster.info({
            title: "Payment Cancelled",
            description: "You can continue shopping and try again later.",
            duration: 3000,
        });
    };

    const { processPayment, loading } = useKowriPayment({
        config: kowriConfig,
        onSuccess: onPaymentSuccess,
        onError: onPaymentError,
        onCancel: onPaymentCancel,
    });

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
            // First, create the order in the admin system
            const orderResponse = await fetch('/api/admin/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: orderId,
                    customer: {
                        name: "Customer", // You can make this dynamic later
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

            // Prepare invoice data for Kowri payment
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
                customer_name: "Customer", // You can make this dynamic later
                customer_email: "customer@example.com", // You can make this dynamic later
                customer_phone: "+233123456789", // You can make this dynamic later
            };

            // Process payment with Kowri
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
                        <Button onClick={handleClearCart} colorPalette="red" variant="outline" size={['sm', 'md']} _hover={{ color: 'white' }}>
                            Clear Cart
                        </Button>
                    </Flex>

                    <VStack w="100%">
                        {cartItems.map((item) => (
                            <Box
                                key={item.id}
                                p={[4, 6]}
                                bg="white"
                                borderRadius="lg"
                                boxShadow="md"
                                w="100%"
                                border="1px solid"
                                borderColor="gray.200"
                            >
                                <Flex direction={['column', 'row']} gap={[4, 6]} align={['center', 'flex-start']}>
                                    <Box
                                        width={['100%', '150px']}
                                        height={['200px', '150px']}
                                        borderRadius="md"
                                        overflow="hidden"
                                        flexShrink={0}
                                    >
                                        <Image
                                            src={item.image} alt={item.title}
                                            objectFit="cover" width="100%"
                                            height="100%"
                                        />
                                    </Box>

                                    <VStack align={['center', 'flex-start']} flex={1} textAlign={['center', 'left']}>
                                        <Flex
                                            justify={['center', 'space-between']}
                                            align="center" w="100%"
                                            direction={['column', 'row']}
                                            gap={[2, 0]}
                                        >
                                            <Heading size="md" color="gray.700">{item.title}</Heading>
                                            <Badge colorPalette="yellow" fontSize="sm">{item.category}</Badge>
                                        </Flex>
                                        <Text color="gray.600" fontSize="sm">{item.description}</Text>
                                        <Text fontSize="xl" fontWeight="bold" color="green.600">{item.price}</Text>
                                    </VStack>

                                    <VStack align="center">
                                        <Text fontSize="sm" color="gray.600" fontWeight="medium">Quantity</Text>
                                        <HStack>
                                            <IconButton
                                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                                aria-label="Decrease quantity"
                                                size="sm"
                                                colorPalette="gray"
                                                variant="outline"
                                            >
                                                <FaMinus />
                                            </IconButton>
                                            <Text minW="40px" textAlign="center" fontSize="lg" fontWeight="bold">
                                                {item.quantity}
                                            </Text>
                                            <IconButton
                                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                                aria-label="Increase quantity"
                                                size="sm"
                                                colorPalette="green"
                                                variant="outline"
                                            >
                                                <FaPlus />
                                            </IconButton>
                                            <IconButton
                                                onClick={() => handleRemoveItem(item.id, item.title)}
                                                aria-label="Remove item"
                                                size="sm"
                                                colorPalette="red"
                                                variant="outline"
                                            >
                                                <FaTrash />
                                            </IconButton>
                                        </HStack>
                                    </VStack>
                                </Flex>
                            </Box>
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