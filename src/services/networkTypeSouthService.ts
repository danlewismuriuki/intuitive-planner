import axios from "axios";
import { NetworkTypeSouth } from "src/types/models";

const API_URL = process.env.QUASAR_APP_API_URL;

export const networkTypeSouthService = {
  async getAllNetworkTypeSouths(): Promise<NetworkTypeSouth[]> {
    try {
      const response = await axios.get<NetworkTypeSouth[]>(`${API_URL}/networkTypeSouth`);
      return response.data;
    } catch (error) {
      console.error("Error fetching networkTypeSouths:", error);
      throw error;
    }
  },

  async getNetworkTypeSouthsByCustomerAndDataHallId(
    customerId: number,
    dataHallId: number
  ): Promise<NetworkTypeSouth[]> {
    try {
      const response = await axios.get<NetworkTypeSouth[]>(
        `${API_URL}/customers/${customerId}/dataHalls/${dataHallId}/networkTypeSouth`
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching networkTypeSouths for customer ${customerId} and dataHall ${dataHallId}:`,
        error
      );
      throw error;
    }
  },

  async getNetworkTypeSouthById(id: number): Promise<NetworkTypeSouth> {
    try {
      const response = await axios.get<NetworkTypeSouth>(`${API_URL}/networkTypeSouth/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching networkTypeSouth with id ${id}:`, error);
      throw error;
    }
  },

  async createNetworkTypeSouth(networkTypeSouth: Omit<NetworkTypeSouth, "id">): Promise<NetworkTypeSouth> {
    try {
      const response = await axios.post<NetworkTypeSouth>(`${API_URL}/networkTypeSouth`, networkTypeSouth);
      return response.data;
    } catch (error) {
      console.error("Error creating networkTypeSouth:", error);
      throw error;
    }
  },

  async updateNetworkTypeSouth(id: number, networkTypeSouth: Partial<NetworkTypeSouth>): Promise<NetworkTypeSouth> {
    try {
      const response = await axios.put<NetworkTypeSouth>(`${API_URL}/networkTypeSouth/${id}`, networkTypeSouth);
      return response.data;
    } catch (error) {
      console.error(`Error updating networkTypeSouth with id ${id}:`, error);
      throw error;
    }
  },

  async deleteNetworkTypeSouth(id: number): Promise<void> {
    try {
      await axios.delete(`${API_URL}/networkTypeSouth/${id}`);
    } catch (error) {
      console.error(`Error deleting networkTypeSouth with id ${id}:`, error);
      throw error;
    }
  },
};
