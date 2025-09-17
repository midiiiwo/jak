'use client'
import { useState, useCallback } from 'react';
import {
    KowriConfig,
    CreateInvoiceRequest,
    CreateInvoiceResponse,
    PayNowRequest,
    PayNowResponse,
    PaymentStatusResponse,
    UseKowriPaymentProps,
    KowriCallbackData
} from '@/types/kowri';

export const useKowriPayment = ({ config, onSuccess, onError, onCancel }: UseKowriPaymentProps) => {
    const [loading, setLoading] = useState(false);
    const [paymentUrl, setPaymentUrl] = useState<string | null>(null);

    const createInvoice = async (invoiceData: CreateInvoiceRequest): Promise<CreateInvoiceResponse> => {
        try {
            const response = await fetch(`${config.baseUrl}invoice/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...invoiceData,
                    app_reference: config.appReference,
                    secret: config.secret,
                    app_id: config.appId,
                }),
            });

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error creating invoice:', error);
            throw new Error('Failed to create invoice');
        }
    };

    const initiatePayment = async (payNowData: PayNowRequest): Promise<PayNowResponse> => {
        try {
            const response = await fetch(`${config.baseUrl}payment/paynow`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...payNowData,
                    app_reference: config.appReference,
                    secret: config.secret,
                    app_id: config.appId,
                }),
            });

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error initiating payment:', error);
            throw new Error('Failed to initiate payment');
        }
    };

    const checkPaymentStatus = async (payToken: string): Promise<PaymentStatusResponse> => {
        try {
            const response = await fetch(`${config.baseUrl}payment/status`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    pay_token: payToken,
                    app_reference: config.appReference,
                    secret: config.secret,
                    app_id: config.appId,
                }),
            });

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error checking payment status:', error);
            throw new Error('Failed to check payment status');
        }
    };

    const processPayment = useCallback(async (invoiceData: CreateInvoiceRequest) => {
        setLoading(true);
        try {
            // Step 1: Create Invoice
            const invoiceResponse = await createInvoice(invoiceData);

            if (!invoiceResponse.success || !invoiceResponse.data) {
                throw new Error(invoiceResponse.message || 'Failed to create invoice');
            }

            const { pay_token, amount } = invoiceResponse.data;

            // Step 2: Initiate Payment
            const paymentResponse = await initiatePayment({
                pay_token,
                amount,
                customer_name: invoiceData.customer_name,
                customer_email: invoiceData.customer_email,
                customer_phone: invoiceData.customer_phone,
            });

            if (!paymentResponse.success || !paymentResponse.data) {
                throw new Error(paymentResponse.message || 'Failed to initiate payment');
            }

            const { payment_url } = paymentResponse.data;
            setPaymentUrl(payment_url);

            // Open payment window
            const paymentWindow = window.open(
                payment_url,
                'kowri-payment',
                'width=500,height=600,scrollbars=yes,resizable=yes'
            );

            // Poll for payment completion
            const pollInterval = setInterval(async () => {
                try {
                    const statusResponse = await checkPaymentStatus(pay_token);

                    if (statusResponse.success && statusResponse.data) {
                        const { status } = statusResponse.data;

                        if (status === 0) {
                            // Payment successful
                            clearInterval(pollInterval);
                            paymentWindow?.close();
                            onSuccess?.(statusResponse.data as KowriCallbackData);
                        } else if (status === -1) {
                            // Technical error
                            clearInterval(pollInterval);
                            paymentWindow?.close();
                            onError?.('Technical error occurred during payment');
                        } else if (status === -2) {
                            // Customer cancelled
                            clearInterval(pollInterval);
                            paymentWindow?.close();
                            onCancel?.();
                        }
                    }
                } catch (error) {
                    console.error('Error polling payment status:', error);
                }
            }, 3000); // Poll every 3 seconds

            // Clean up if window is closed manually
            const checkClosed = setInterval(() => {
                if (paymentWindow?.closed) {
                    clearInterval(pollInterval);
                    clearInterval(checkClosed);
                    onCancel?.();
                }
            }, 1000);

            // Cleanup after 10 minutes
            setTimeout(() => {
                clearInterval(pollInterval);
                clearInterval(checkClosed);
                if (paymentWindow && !paymentWindow.closed) {
                    paymentWindow.close();
                    onCancel?.();
                }
            }, 600000); // 10 minutes timeout

        } catch (error) {
            console.error('Payment process error:', error);
            onError?.(error instanceof Error ? error.message : 'Payment failed');
        } finally {
            setLoading(false);
        }
    }, [config, onSuccess, onError, onCancel]);

    return {
        processPayment,
        loading,
        paymentUrl,
        createInvoice,
        initiatePayment,
        checkPaymentStatus,
    };
};

export default useKowriPayment;
