export const API_ENDPOINTS = {
    admin: {
        categories: '/api/admin/categories',
        products: '/api/admin/products',
        orders: '/api/admin/orders',
        customers: '/api/admin/customers',
        stock: '/api/admin/stock',
        settings: '/api/admin/settings',
        dashboard: '/api/admin/dashboard',
    },
    public: {
        products: '/api/products',
    },
} as const;

export const ROUTES = {
    home: '/',
    shop: '/shop',
    cart: '/cart',
    admin: {
        dashboard: '/admin',
        products: '/admin/products',
        categories: '/admin/categories',
        orders: '/admin/orders',
        customers: '/admin/customers',
        stock: '/admin/stock',
        settings: '/admin/settings',
        analytics: '/admin/analytics',
    },
} as const;

export const STORAGE_KEYS = {
    cart: 'frozen-haven-cart',
    theme: 'frozen-haven-theme',
} as const;
