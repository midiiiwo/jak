export interface SystemSettings {
    businessName: string;
    businessEmail: string;
    businessPhone: string;
    businessAddress: string;
    currency: string;
    timezone: string;
    language: string;
    taxRate: number;
    lowStockThreshold: number;
    enableNotifications: boolean;
    enableEmailAlerts: boolean;
    enableSMSAlerts: boolean;
    deliveryRadius: number;
    minOrderAmount: number;
    maxOrderAmount: number;
}

export interface UserSettings {
    compactMode: boolean | undefined;
    autoSave: boolean | undefined;
    theme: 'light' | 'dark' | 'system';
    dateFormat: string;
    timeFormat: string;
    enableSounds: boolean;
    dashboardRefreshInterval: number;
}

export interface PaymentSettings {
    acceptCash: boolean;
    acceptKowri: boolean;
    kowriMerchantId: string;
    kowriApiKey: string;
    enableTestMode: boolean;
}

export interface NotificationSettings {
    lowStockAlerts: boolean;
    orderAlerts: boolean;
    customerAlerts: boolean;
    systemAlerts: boolean;
    emailNotifications: boolean;
    smsNotifications: boolean;
    pushNotifications: boolean;
}

export type SettingsTab = 'system' | 'user' | 'payment' | 'notifications';
