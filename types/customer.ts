export interface Customer {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    registrationDate: string;
    totalOrders: number;
    totalSpent: number;
    lastOrderDate: string | null;
    status: 'active' | 'inactive';
    customerType: 'regular' | 'premium' | 'vip';
    notes: string;
}

export interface CustomerStats {
    totalCustomers: number;
    activeCustomers: number;
    inactiveCustomers: number;
    vipCustomers: number;
    premiumCustomers: number;
    totalRevenue: number;
    averageOrderValue: number;
    newCustomersThisMonth: number;
}

export interface CustomerFormData {
    name: string;
    email: string;
    phone: string;
    address: string;
    customerType: 'regular' | 'premium' | 'vip';
    notes: string;
}

export interface CustomerFilters {
    searchTerm: string;
    filterStatus: string;
    filterCustomerType: string;
}
