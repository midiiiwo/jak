'use client'

import { useState } from 'react';
import { Box, Container, VStack, Text } from '@chakra-ui/react';
import { useColorModeValue } from '../../ui/color-mode';
import EmptyState  from '../../shared/empty-state';
import  LoadingSpinner  from '../../shared/loading-spinner';
import {
    CustomerStatsGrid,
    CustomerTable,
    CustomerHeader,
    CustomerFormDialog,
    CustomerViewDialog
} from '.';
import { useCustomers } from '../../../hooks/use-customers';
import type { Customer, CustomerFormData, CustomerFilters } from '../../../types/customer';
import { FaUsers } from 'react-icons/fa6';

export default function CustomerManagement() {
    const [filters, setFilters] = useState<CustomerFilters>({
        searchTerm: '',
        filterStatus: '',
        filterCustomerType: ''
    });
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [formData, setFormData] = useState<CustomerFormData>({
        name: '',
        email: '',
        phone: '',
        address: '',
        customerType: 'regular',
        notes: ''
    });

    const {
        customers,
        customerStats,
        loading,
        fetchCustomerData,
        addCustomer,
        updateCustomer,
        deleteCustomer
    } = useCustomers();

    const bgColor = useColorModeValue('gray.50', 'gray.900');

    // Filter customers based on search and filters
    const filteredCustomers = customers.filter(customer => {
        const matchesSearch = !filters.searchTerm ||
            customer.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
            customer.email.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
            customer.phone.toLowerCase().includes(filters.searchTerm.toLowerCase());

        const matchesStatus = !filters.filterStatus || customer.status === filters.filterStatus;
        const matchesType = !filters.filterCustomerType || customer.customerType === filters.filterCustomerType;

        return matchesSearch && matchesStatus && matchesType;
    });

    const handleFiltersChange = (newFilters: Partial<CustomerFilters>) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
    };

    const handleAddCustomer = () => {
        setSelectedCustomer(null);
        setFormData({
            name: '',
            email: '',
            phone: '',
            address: '',
            customerType: 'regular',
            notes: ''
        });
        setIsDialogOpen(true);
    };

    const handleEditCustomer = (customer: Customer) => {
        setSelectedCustomer(customer);
        setFormData({
            name: customer.name,
            email: customer.email,
            phone: customer.phone,
            address: customer.address,
            customerType: customer.customerType,
            notes: customer.notes
        });
        setIsDialogOpen(true);
    };

    const handleViewCustomer = (customer: Customer) => {
        setSelectedCustomer(customer);
        setIsViewDialogOpen(true);
    };

    const handleFormDataChange = (data: Partial<CustomerFormData>) => {
        setFormData(prev => ({ ...prev, ...data }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const success = selectedCustomer
            ? await updateCustomer(selectedCustomer.id, formData)
            : await addCustomer(formData);

        if (success) {
            setIsDialogOpen(false);
            setSelectedCustomer(null);
        }
    };

    const handleDeleteCustomer = async (customerId: string) => {
        await deleteCustomer(customerId);
    };

    if (loading) {
        return (
            <Box p={8} bg={bgColor} minH="100vh">
                <LoadingSpinner />
                <Text>Loading customers...</Text>
            </Box>
        );
    }

    return (
        <Box p={8} bg={bgColor} minH="100vh">
            <Container maxW="full">
                <VStack gap={8} align="stretch">
                    <CustomerHeader
                        filters={filters}
                        onFiltersChange={handleFiltersChange}
                        onAddCustomer={handleAddCustomer}
                        onRefresh={fetchCustomerData}
                        totalCount={customers.length}
                        filteredCount={filteredCustomers.length}
                    />

                    <CustomerStatsGrid stats={customerStats} />

                    {filteredCustomers.length === 0 ? (
                        <EmptyState
                            title="No customers found"
                            description="No customers match your current filters. Try adjusting your search criteria."
                            icon={FaUsers}
                        />
                    ) : (
                        <CustomerTable
                            customers={filteredCustomers}
                            onView={handleViewCustomer}
                            onEdit={handleEditCustomer}
                            onDelete={handleDeleteCustomer}
                        />
                    )}
                </VStack>
            </Container>

            <CustomerFormDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                customer={selectedCustomer}
                formData={formData}
                onFormDataChange={handleFormDataChange}
                onSubmit={handleSubmit}
            />

            <CustomerViewDialog
                isOpen={isViewDialogOpen}
                onClose={() => setIsViewDialogOpen(false)}
                customer={selectedCustomer}
            />
        </Box>
    );
}
