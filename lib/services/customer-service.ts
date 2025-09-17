import { Customer, CustomerStats } from "@/types/customer";
import { mockCustomers } from "@/lib/mock/customers";

export const filterCustomers = (
    customers: Customer[],
    search?: string,
    status?: string,
    customerType?: string
): Customer[] => {
    let filtered = [...customers];

    if (search) {
        const searchLower = search.toLowerCase();
        filtered = filtered.filter(customer =>
            customer.name.toLowerCase().includes(searchLower) ||
            customer.email.toLowerCase().includes(searchLower) ||
            customer.phone.includes(search) ||
            customer.address.toLowerCase().includes(searchLower)
        );
    }

    if (status) {
        filtered = filtered.filter(customer => customer.status === status);
    }

    if (customerType) {
        filtered = filtered.filter(customer => customer.customerType === customerType);
    }

    return filtered;
};

export const sortCustomers = (
    customers: Customer[],
    sortBy: keyof Customer = 'registrationDate',
    sortOrder: 'asc' | 'desc' = 'desc'
): Customer[] => {
    return [...customers].sort((a, b) => {
        let aValue = a[sortBy];
        let bValue = b[sortBy];

        if (sortBy.includes('Date')) {
            aValue = new Date(aValue as string).getTime();
            bValue = new Date(bValue as string).getTime();
        }

        if (sortOrder === 'asc') {
            if (aValue == null && bValue == null) return 0;
            if (aValue == null) return -1;
            if (bValue == null) return 1;
            return aValue > bValue ? 1 : -1;
        } else {
            if (aValue == null && bValue == null) return 0;
            if (aValue == null) return 1;
            if (bValue == null) return -1;
            return aValue < bValue ? 1 : -1;
        }
    });
};

export const calculateCustomerStats = (customers: Customer[]): CustomerStats => {
    const now = new Date();

    return {
        totalCustomers: customers.length,
        activeCustomers: customers.filter(c => c.status === 'active').length,
        inactiveCustomers: customers.filter(c => c.status === 'inactive').length,
        vipCustomers: customers.filter(c => c.customerType === 'vip').length,
        premiumCustomers: customers.filter(c => c.customerType === 'premium').length,
        totalRevenue: customers.reduce((sum, c) => sum + c.totalSpent, 0),
        averageOrderValue: customers.reduce((sum, c) => sum + c.totalSpent, 0) /
            customers.reduce((sum, c) => sum + c.totalOrders, 0),
        newCustomersThisMonth: customers.filter(c => {
            const regDate = new Date(c.registrationDate);
            return regDate.getMonth() === now.getMonth() &&
                regDate.getFullYear() === now.getFullYear();
        }).length
    };
};

export const findCustomerById = (id: string): Customer | undefined => {
    return mockCustomers.find(c => c.id === id);
};

export const validateCustomerData = (data: Partial<Customer>): string[] => {
    const requiredFields = ['name', 'email', 'phone'];
    return requiredFields.filter(field => !data[field as keyof typeof data]);
};
