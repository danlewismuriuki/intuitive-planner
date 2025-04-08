import axios from "axios";
import { Customer } from "../types/models";

const API_URL = process.env.QUASAR_APP_API_URL;

export const customerService = {
  async getAllCustomers(): Promise<Customer[]> {
    try {
      const response = await axios.get<Customer[]>(`${API_URL}/customer`);
      return response.data;
    } catch (error) {
      console.error("Error fetching customers:", error);
      throw error;
    }
  },

  async getCustomerById(id: number): Promise<Customer> {
    try {
      const response = await axios.get<Customer>(`${API_URL}/customer/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching customer with id ${id}:`, error);
      throw error;
    }
  },

  async createCustomer(customer: Omit<Customer, "id">): Promise<Customer> {
    try {
      const response = await axios.post<Customer>(
        `${API_URL}/customer`,
        customer
      );
      return response.data;
    } catch (error) {
      console.error("Error creating customer:", error);
      throw error;
    }
  },

  async updateCustomer(
    id: number,
    customer: Partial<Customer>
  ): Promise<Customer> {
    try {
      const response = await axios.put<Customer>(
        `${API_URL}/customer/${id}`,
        customer
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating customer with id ${id}:`, error);
      throw error;
    }
  },

  async deleteCustomer(id: number): Promise<void> {
    try {
      await axios.delete(`${API_URL}/customer/${id}`);
    } catch (error) {
      console.error(`Error deleting customer with id ${id}:`, error);
      throw error;
    }
  },
};
