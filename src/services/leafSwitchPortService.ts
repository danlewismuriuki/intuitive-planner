import axios from "axios";
import { LeafSwitchPort } from "src/types/models";

const API_URL = process.env.QUASAR_APP_API_URL;

export const leafSwitchPortService = {
  async getAllLeafSwitchPorts(): Promise<LeafSwitchPort[]> {
    try {
      const response = await axios.get<LeafSwitchPort[]>(`${API_URL}/leafSwitchPort`);
      return response.data;
    } catch (error) {
      console.error("Error fetching leafSwitchPorts:", error);
      throw error;
    }
  },

  async getLeafSwitchPortsByCustomerAndDataHallId(
    customerId: number,
    dataHallId: number
  ): Promise<LeafSwitchPort[]> {
    try {
      const response = await axios.get<LeafSwitchPort[]>(
        `${API_URL}/customers/${customerId}/dataHalls/${dataHallId}/leafSwitchPort`
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching leafSwitchPorts for customer ${customerId} and dataHall ${dataHallId}:`,
        error
      );
      throw error;
    }
  },

  async getLeafSwitchPortById(id: number): Promise<LeafSwitchPort> {
    try {
      const response = await axios.get<LeafSwitchPort>(`${API_URL}/leafSwitchPort/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching leafSwitchPort with id ${id}:`, error);
      throw error;
    }
  },

  async createLeafSwitchPort(leafSwitchPort: Omit<LeafSwitchPort, "id">): Promise<LeafSwitchPort> {
    try {
      const response = await axios.post<LeafSwitchPort>(`${API_URL}/leafSwitchPort`, leafSwitchPort);
      return response.data;
    } catch (error) {
      console.error("Error creating leafSwitchPort:", error);
      throw error;
    }
  },

  async updateLeafSwitchPort(id: number, leafSwitchPort: Partial<LeafSwitchPort>): Promise<LeafSwitchPort> {
    try {
      const response = await axios.put<LeafSwitchPort>(`${API_URL}/leafSwitchPort/${id}`, leafSwitchPort);
      return response.data;
    } catch (error) {
      console.error(`Error updating leafSwitchPort with id ${id}:`, error);
      throw error;
    }
  },

  async deleteLeafSwitchPort(id: number): Promise<void> {
    try {
      await axios.delete(`${API_URL}/leafSwitchPort/${id}`);
    } catch (error) {
      console.error(`Error deleting leafSwitchPort with id ${id}:`, error);
      throw error;
    }
  },
};
