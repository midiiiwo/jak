// Kowri Payment API Types

export interface KowriConfig {
    appReference: string;
    secret: string;
    appId: string;
    baseUrl: string; // Live: https://posapi.kowri.app/ | UAT: https://kbposapi.mykowri.com/
}

export interface KowriInvoiceItem {
    name: string;
    quantity: number;
    unit_price: number;
    total_price: number;
}

export interface CreateInvoiceRequest {
    merchantOrderId: string;
    amount: number;
    items: KowriInvoiceItem[];
    description?: string;
    customer_name?: string;
    customer_email?: string;
    customer_phone?: string;
    callback_url?: string;
}

export interface CreateInvoiceResponse {
    success: boolean;
    message: string;
    data?: {
        invoice_id: string;
        pay_token: string;
        amount: number;
        merchantOrderId: string;
        status: string;
    };
    error?: string;
}

export interface PaymentStatusResponse {
    success: boolean;
    data?: {
        status: number; // 0: Successful, -1: Technical Error, -2: Customer cancelled
        cust_ref: string; // merchantOrderId
        pay_token: string; // invoice number
        transaction_id?: string; // for successful payments
        amount?: number;
    };
    message?: string;
    error?: string;
}

export interface PayNowRequest {
    pay_token: string;
    amount: number;
    customer_name?: string;
    customer_email?: string;
    customer_phone?: string;
}

export interface PayNowResponse {
    success: boolean;
    message: string;
    data?: {
        payment_url: string;
        pay_token: string;
        transaction_id?: string;
    };
    error?: string;
}

export interface KowriCallbackData {
    status: number; // 0: Successful, -1: Technical Error, -2: Customer cancelled
    cust_ref: string; // merchantOrderId
    pay_token: string; // invoice number
    transaction_id?: string; // transaction ID for successful payment
}

export interface UseKowriPaymentProps {
    config: KowriConfig;
    onSuccess?: (data: KowriCallbackData) => void;
    onError?: (error: string) => void;
    onCancel?: () => void;
}
