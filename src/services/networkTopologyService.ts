import axios from "axios";
import { NetworkTopology } from "src/types/models";

const API_URL = process.env.QUASAR_APP_API_URL;

export const networkTopologyService = {
  async getAllNetworkTopologys(): Promise<NetworkTopology[]> {
    try {
      const response = await axios.get<NetworkTopology[]>(`${API_URL}/networkTopology`);
      return response.data;
    } catch (error) {
      console.error("Error fetching networkTopologys:", error);
      throw error;
    }
  },

  async getNetworkTopologysByCustomerAndDataHallId(
    customerId: number,
    dataHallId: number
  ): Promise<NetworkTopology[]> {
    try {
      const response = await axios.get<NetworkTopology[]>(
        `${API_URL}/customers/${customerId}/dataHalls/${dataHallId}/networkTopology`
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching networkTopologys for customer ${customerId} and dataHall ${dataHallId}:`,
        error
      );
      throw error;
    }
  },

  async getNetworkTopologyById(id: number): Promise<NetworkTopology> {
    try {
      const response = await axios.get<NetworkTopology>(`${API_URL}/networkTopology/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching networkTopology with id ${id}:`, error);
      throw error;
    }
  },

  async createNetworkTopology(networkTopology: Omit<NetworkTopology, "id">): Promise<NetworkTopology> {
    try {
      const response = await axios.post<NetworkTopology>(`${API_URL}/networkTopology`, networkTopology);
      return response.data;
    } catch (error) {
      console.error("Error creating networkTopology:", error);
      throw error;
    }
  },

  async updateNetworkTopology(id: number, networkTopology: Partial<NetworkTopology>): Promise<NetworkTopology> {
    try {
      const response = await axios.put<NetworkTopology>(`${API_URL}/networkTopology/${id}`, networkTopology);
      return response.data;
    } catch (error) {
      console.error(`Error updating networkTopology with id ${id}:`, error);
      throw error;
    }
  },

  async deleteNetworkTopology(id: number): Promise<void> {
    try {
      await axios.delete(`${API_URL}/networkTopology/${id}`);
    } catch (error) {
      console.error(`Error deleting networkTopology with id ${id}:`, error);
      throw error;
    }
  },
};
