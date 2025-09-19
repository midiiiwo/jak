"use client";

import { useState, useEffect } from "react";
import type {
  Customer,
  CustomerStats,
  CustomerFormData,
} from "@/types/customer";

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customerStats, setCustomerStats] = useState<CustomerStats>({
    totalCustomers: 0,
    activeCustomers: 0,
    inactiveCustomers: 0,
    vipCustomers: 0,
    premiumCustomers: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
    newCustomersThisMonth: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomerData();
  }, []);

  const fetchCustomerData = async () => {
    setLoading(true);
    try {
      // Mock data - replace with actual API calls
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockCustomers: Customer[] = [
        {
          id: "1",
          name: "John Doe",
          email: "john@example.com",
          phone: "+233 123 456 789",
          address: "123 Main St, Accra",
          registrationDate: "2024-01-15",
          totalOrders: 15,
          totalSpent: 2450,
          lastOrderDate: "2024-03-01",
          status: "active",
          customerType: "premium",
          notes: "Loyal customer",
        },
        {
          id: "2",
          name: "Jane Smith",
          email: "jane@example.com",
          phone: "+233 987 654 321",
          address: "456 Oak Ave, Kumasi",
          registrationDate: "2024-02-20",
          totalOrders: 8,
          totalSpent: 1200,
          lastOrderDate: "2024-02-28",
          status: "active",
          customerType: "regular",
          notes: "",
        },
      ];

      const mockStats: CustomerStats = {
        totalCustomers: 247,
        activeCustomers: 198,
        inactiveCustomers: 49,
        vipCustomers: 12,
        premiumCustomers: 45,
        totalRevenue: 125000,
        averageOrderValue: 85.5,
        newCustomersThisMonth: 23,
      };

      setCustomers(mockCustomers);
      setCustomerStats(mockStats);
    } catch (error) {
      console.error("Failed to fetch customer data:", error);
    } finally {
      setLoading(false);
    }
  };

  const addCustomer = async (formData: CustomerFormData) => {
    try {
      const response = await fetch("/api/admin/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchCustomerData();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error adding customer:", error);
      return false;
    }
  };

  const updateCustomer = async (
    customerId: string,
    formData: CustomerFormData
  ) => {
    try {
      const response = await fetch(`/api/admin/customers?id=${customerId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchCustomerData();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error updating customer:", error);
      return false;
    }
  };

  const deleteCustomer = async (customerId: string) => {
    if (!confirm("Are you sure you want to delete this customer?")) {
      return false;
    }

    try {
      const response = await fetch(`/api/admin/customers?id=${customerId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchCustomerData();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error deleting customer:", error);
      return false;
    }
  };

  return {
    customers,
    customerStats,
    loading,
    fetchCustomerData,
    addCustomer,
    updateCustomer,
    deleteCustomer,
  };
}
