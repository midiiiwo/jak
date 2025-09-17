import { KowriConfig, CreateInvoiceRequest, KowriCallbackData } from "@/types/kowri";
import { useKowriPayment } from "./use-kowri";
import { useCart } from "@/contexts/cart-context";
import { toaster } from "@/components/ui/toaster";
import { deductInventory } from "@/lib/utils/inventory";
import { updateOrderStatus } from "@/lib/utils/orders";

export const useCartPayment = () => {
    const { cartItems, getTotalPrice, clearCart } = useCart();

    const kowriConfig: KowriConfig = {
        appReference: process.env.NEXT_PUBLIC_KOWRI_APP_REFERENCE || '',
        secret: process.env.NEXT_PUBLIC_KOWRI_SECRET || '',
        appId: process.env.NEXT_PUBLIC_KOWRI_APP_ID || '',
        baseUrl: process.env.NEXT_PUBLIC_KOWRI_BASE_URL || 'https://kbposapi.mykowri.com/',
    };

    const onPaymentSuccess = async (data: KowriCallbackData) => {
        try {
            const orderId = data.cust_ref;
            if (orderId) {
                await updateOrderStatus(orderId, 'completed', data.transaction_id);
            }

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
        await updateOrderStatus('pending', 'failed', undefined, error);
        toaster.error({
            title: "Payment Failed",
            description: error,
            duration: 5000,
        });
    };

    const onPaymentCancel = async () => {
        await updateOrderStatus('pending', 'cancelled');
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

    return {
        processPayment,
        loading,
        cartItems,
        getTotalPrice
    };
};
