import { NextRequest, NextResponse } from 'next/server';

// Mock customer data
const mockCustomers = [
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

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search')?.toLowerCase() || '';
        const status = searchParams.get('status') || '';
        const customerType = searchParams.get('customerType') || '';
        const sortBy = searchParams.get('sortBy') || 'registrationDate';
        const sortOrder = searchParams.get('sortOrder') || 'desc';

        let filteredCustomers = [...mockCustomers];

        // Apply search filter
        if (search) {
            filteredCustomers = filteredCustomers.filter(customer =>
                customer.name.toLowerCase().includes(search) ||
                customer.email.toLowerCase().includes(search) ||
                customer.phone.includes(search) ||
                customer.address.toLowerCase().includes(search)
            );
        }

        // Apply status filter
        if (status) {
            filteredCustomers = filteredCustomers.filter(customer => customer.status === status);
        }

        // Apply customer type filter
        if (customerType) {
            filteredCustomers = filteredCustomers.filter(customer => customer.customerType === customerType);
        }

        // Apply sorting
        filteredCustomers.sort((a, b) => {
            let aValue = a[sortBy as keyof typeof a];
            let bValue = b[sortBy as keyof typeof b];

            // Convert dates to timestamps for comparison
            if (sortBy.includes('Date')) {
                aValue = new Date(aValue as string).getTime();
                bValue = new Date(bValue as string).getTime();
            }

            if (sortOrder === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });

        // Calculate summary statistics
        const stats = {
            totalCustomers: mockCustomers.length,
            activeCustomers: mockCustomers.filter(c => c.status === 'active').length,
            inactiveCustomers: mockCustomers.filter(c => c.status === 'inactive').length,
            vipCustomers: mockCustomers.filter(c => c.customerType === 'vip').length,
            premiumCustomers: mockCustomers.filter(c => c.customerType === 'premium').length,
            totalRevenue: mockCustomers.reduce((sum, c) => sum + c.totalSpent, 0),
            averageOrderValue: mockCustomers.reduce((sum, c) => sum + c.totalSpent, 0) / mockCustomers.reduce((sum, c) => sum + c.totalOrders, 0),
            newCustomersThisMonth: mockCustomers.filter(c => {
                const regDate = new Date(c.registrationDate);
                const now = new Date();
                return regDate.getMonth() === now.getMonth() && regDate.getFullYear() === now.getFullYear();
            }).length
        };

        return NextResponse.json({
            customers: filteredCustomers,
            stats,
            pagination: {
                page: 1,
                limit: 50,
                total: filteredCustomers.length,
                pages: Math.ceil(filteredCustomers.length / 50)
            }
        });

    } catch (error) {
        console.error('Error fetching customers:', error);
        return NextResponse.json(
            { error: 'Failed to fetch customers' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const customerData = await request.json();

        // Validate required fields
        const requiredFields = ['name', 'email', 'phone'];
        const missingFields = requiredFields.filter(field => !customerData[field]);

        if (missingFields.length > 0) {
            return NextResponse.json(
                { error: `Missing required fields: ${missingFields.join(', ')}` },
                { status: 400 }
            );
        }

        // Create new customer
        const newCustomer = {
            id: `cust_${Date.now()}`,
            name: customerData.name,
            email: customerData.email,
            phone: customerData.phone,
            address: customerData.address || '',
            registrationDate: new Date().toISOString(),
            totalOrders: 0,
            totalSpent: 0,
            lastOrderDate: null,
            status: 'active',
            customerType: customerData.customerType || 'regular',
            notes: customerData.notes || ''
        };

        // In a real app, you would save to database
        console.log('Creating new customer:', newCustomer);

        return NextResponse.json({
            message: 'Customer created successfully',
            customer: newCustomer
        }, { status: 201 });

    } catch (error) {
        console.error('Error creating customer:', error);
        return NextResponse.json(
            { error: 'Failed to create customer' },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const customerId = searchParams.get('id');
        const updateData = await request.json();

        if (!customerId) {
            return NextResponse.json(
                { error: 'Customer ID is required' },
                { status: 400 }
            );
        }

        // Find customer
        const customerIndex = mockCustomers.findIndex(c => c.id === customerId);
        if (customerIndex === -1) {
            return NextResponse.json(
                { error: 'Customer not found' },
                { status: 404 }
            );
        }

        // Update customer
        const updatedCustomer = {
            ...mockCustomers[customerIndex],
            ...updateData,
            id: customerId // Ensure ID doesn't change
        };

        // In a real app, you would update in database
        console.log('Updating customer:', updatedCustomer);

        return NextResponse.json({
            message: 'Customer updated successfully',
            customer: updatedCustomer
        });

    } catch (error) {
        console.error('Error updating customer:', error);
        return NextResponse.json(
            { error: 'Failed to update customer' },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const customerId = searchParams.get('id');

        if (!customerId) {
            return NextResponse.json(
                { error: 'Customer ID is required' },
                { status: 400 }
            );
        }

        // Find customer
        const customerIndex = mockCustomers.findIndex(c => c.id === customerId);
        if (customerIndex === -1) {
            return NextResponse.json(
                { error: 'Customer not found' },
                { status: 404 }
            );
        }

        // In a real app, you would delete from database
        console.log('Deleting customer:', customerId);

        return NextResponse.json({
            message: 'Customer deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting customer:', error);
        return NextResponse.json(
            { error: 'Failed to delete customer' },
            { status: 500 }
        );
    }
}
