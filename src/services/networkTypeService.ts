import axios from "axios";
import { NetworkType } from "src/types/models";

const API_URL = process.env.QUASAR_APP_API_URL;

export const networkTypeService = {
  async getAllNetworkTypes(): Promise<NetworkType[]> {
    try {
      const response = await axios.get<NetworkType[]>(`${API_URL}/networkType`);
      return response.data;
    } catch (error) {
      console.error("Error fetching networkTypes:", error);
      throw error;
    }
  },

  async getNetworkTypesByCustomerAndDataHallId(
    customerId: number,
    dataHallId: number
  ): Promise<NetworkType[]> {
    try {
      const response = await axios.get<NetworkType[]>(
        `${API_URL}/customers/${customerId}/dataHalls/${dataHallId}/networkType`
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching networkTypes for customer ${customerId} and dataHall ${dataHallId}:`,
        error
      );
      throw error;
    }
  },

  async getNetworkTypeById(id: number): Promise<NetworkType> {
    try {
      const response = await axios.get<NetworkType>(`${API_URL}/networkType/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching networkType with id ${id}:`, error);
      throw error;
    }
  },

  async createNetworkType(networkType: Omit<NetworkType, "id">): Promise<NetworkType> {
    try {
      const response = await axios.post<NetworkType>(`${API_URL}/networkType`, networkType);
      return response.data;
    } catch (error) {
      console.error("Error creating networkType:", error);
      throw error;
    }
  },

  async updateNetworkType(id: number, networkType: Partial<NetworkType>): Promise<NetworkType> {
    try {
      const response = await axios.put<NetworkType>(`${API_URL}/networkType/${id}`, networkType);
      return response.data;
    } catch (error) {
      console.error(`Error updating networkType with id ${id}:`, error);
      throw error;
    }
  },

  async deleteNetworkType(id: number): Promise<void> {
    try {
      await axios.delete(`${API_URL}/networkType/${id}`);
    } catch (error) {
      console.error(`Error deleting networkType with id ${id}:`, error);
      throw error;
    }
  },
};
