import axios from "axios";
import { NetworkCabinet } from "src/types/models";

const API_URL = process.env.QUASAR_APP_API_URL;

export const networkCabinetService = {
  async getAllNetworkCabinets(): Promise<NetworkCabinet[]> {
    try {
      const response = await axios.get<NetworkCabinet[]>(`${API_URL}/networkCabinet`);
      return response.data;
    } catch (error) {
      console.error("Error fetching networkCabinets:", error);
      throw error;
    }
  },

  async getNetworkCabinetsByCustomerAndDataHallId(
    customerId: number,
    dataHallId: number
  ): Promise<NetworkCabinet[]> {
    try {
      const response = await axios.get<NetworkCabinet[]>(
        `${API_URL}/customers/${customerId}/dataHalls/${dataHallId}/networkCabinet`
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching networkCabinets for customer ${customerId} and dataHall ${dataHallId}:`,
        error
      );
      throw error;
    }
  },

  async getNetworkCabinetById(id: number): Promise<NetworkCabinet> {
    try {
      const response = await axios.get<NetworkCabinet>(`${API_URL}/networkCabinet/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching networkCabinet with id ${id}:`, error);
      throw error;
    }
  },

  async createNetworkCabinet(networkCabinet: Omit<NetworkCabinet, "id">): Promise<NetworkCabinet> {
    try {
      const response = await axios.post<NetworkCabinet>(`${API_URL}/networkCabinet`, networkCabinet);
      return response.data;
    } catch (error) {
      console.error("Error creating networkCabinet:", error);
      throw error;
    }
  },

  async updateNetworkCabinet(id: number, networkCabinet: Partial<NetworkCabinet>): Promise<NetworkCabinet> {
    try {
      const response = await axios.put<NetworkCabinet>(`${API_URL}/networkCabinet/${id}`, networkCabinet);
      return response.data;
    } catch (error) {
      console.error(`Error updating networkCabinet with id ${id}:`, error);
      throw error;
    }
  },

  async deleteNetworkCabinet(id: number): Promise<void> {
    try {
      await axios.delete(`${API_URL}/networkCabinet/${id}`);
    } catch (error) {
      console.error(`Error deleting networkCabinet with id ${id}:`, error);
      throw error;
    }
  },
};
