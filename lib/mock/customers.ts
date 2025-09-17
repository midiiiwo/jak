import { Customer } from "@/types/customer";

export const mockCustomers: Customer[] = [
    {
        id: 'cust_001',
        name: 'John Doe',
        email: 'john.doe@email.com',
        phone: '+233 24 123 4567',
        address: '123 Main St, Accra, Ghana',
        registrationDate: '2024-01-15T08:30:00Z',
        totalOrders: 15,
        totalSpent: 2450.50,
        lastOrderDate: '2024-08-25T14:20:00Z',
        status: 'active',
        customerType: 'premium',
        notes: 'Loyal customer, prefers frozen chicken'
    },
    {
        id: 'cust_002',
        name: 'Jane Smith',
        email: 'jane.smith@email.com',
        phone: '+233 20 987 6543',
        address: '456 Oak Ave, Kumasi, Ghana',
        registrationDate: '2024-02-20T10:15:00Z',
        totalOrders: 8,
        totalSpent: 1320.75,
        lastOrderDate: '2024-08-28T16:45:00Z',
        status: 'active',
        customerType: 'regular',
        notes: 'Frequent seafood orders'
    },
    {
        id: 'cust_003',
        name: 'Michael Johnson',
        email: 'michael.j@email.com',
        phone: '+233 26 555 0123',
        address: '789 Pine Rd, Tamale, Ghana',
        registrationDate: '2024-03-10T12:00:00Z',
        totalOrders: 3,
        totalSpent: 450.25,
        lastOrderDate: '2024-07-15T11:30:00Z',
        status: 'inactive',
        customerType: 'regular',
        notes: 'Seasonal customer'
    },
    {
        id: 'cust_004',
        name: 'Sarah Wilson',
        email: 'sarah.wilson@email.com',
        phone: '+233 24 777 8888',
        address: '321 Elm St, Cape Coast, Ghana',
        registrationDate: '2024-04-05T09:20:00Z',
        totalOrders: 22,
        totalSpent: 3750.80,
        lastOrderDate: '2024-08-29T13:10:00Z',
        status: 'active',
        customerType: 'vip',
        notes: 'VIP customer, bulk orders for restaurant'
    },
    {
        id: 'cust_005',
        name: 'David Brown',
        email: 'david.brown@email.com',
        phone: '+233 55 333 2222',
        address: '654 Maple Dr, Sunyani, Ghana',
        registrationDate: '2024-05-12T15:45:00Z',
        totalOrders: 6,
        totalSpent: 890.40,
        lastOrderDate: '2024-08-20T10:25:00Z',
        status: 'active',
        customerType: 'regular',
        notes: 'Prefers delivery on weekends'
    }
];
