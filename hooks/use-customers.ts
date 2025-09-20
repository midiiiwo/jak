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
      // Fetch actual customer data from API
      const response = await fetch("/api/admin/customers");

      if (!response.ok) {
        throw new Error(`Failed to fetch customers: ${response.status}`);
      }

      const data = await response.json();

      // Set customers and stats from API response
      setCustomers(data.customers || []);
      setCustomerStats(
        data.stats || {
          totalCustomers: 0,
          activeCustomers: 0,
          inactiveCustomers: 0,
          vipCustomers: 0,
          premiumCustomers: 0,
          totalRevenue: 0,
          averageOrderValue: 0,
          newCustomersThisMonth: 0,
        }
      );
    } catch (error) {
      console.error("Failed to fetch customer data:", error);
      // Set empty state on error
      setCustomers([]);
      setCustomerStats({
        totalCustomers: 0,
        activeCustomers: 0,
        inactiveCustomers: 0,
        vipCustomers: 0,
        premiumCustomers: 0,
        totalRevenue: 0,
        averageOrderValue: 0,
        newCustomersThisMonth: 0,
      });
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
