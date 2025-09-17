// Payment Gateway Types
export interface PaymentConfig {
    reference: string;
    email: string;
    amount: number;
    publicKey: string;
    currency: string;
    metadata?: Record<string, any>;
}

export interface PaymentResponse {
    reference: string;
    transaction?: string;
    status: string;
    message?: string;
}

export interface PaymentHookReturn {
    initializePayment: (callbacks: PaymentCallbacks) => void;
    loading: boolean;
    error: string | null;
}

export interface PaymentCallbacks {
    onSuccess: (response: PaymentResponse) => void;
    onClose: () => void;
    onError?: (error: string) => void;
}

// Specific providers
export type PaymentProvider = 'kowri' | 'hubtel' | 'flutterwave' | 'paystack';

export interface KowriConfig extends PaymentConfig {
    // Add Kowri-specific configuration here when available
}

export interface HubtelConfig extends PaymentConfig {
    // Add Hubtel-specific configuration here
    clientReference?: string;
}
