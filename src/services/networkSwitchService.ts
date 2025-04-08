import axios from "axios";
import { NetworkSwitch } from "src/types/models";

const API_URL = process.env.QUASAR_APP_API_URL;

export const networkSwitchService = {
  async getAllNetworkSwitchs(): Promise<NetworkSwitch[]> {
    try {
      const response = await axios.get<NetworkSwitch[]>(`${API_URL}/networkSwitch`);
      return response.data;
    } catch (error) {
      console.error("Error fetching networkSwitchs:", error);
      throw error;
    }
  },

  async getNetworkSwitchsByCustomerAndDataHallId(
    customerId: number,
    dataHallId: number
  ): Promise<NetworkSwitch[]> {
    try {
      const response = await axios.get<NetworkSwitch[]>(
        `${API_URL}/customers/${customerId}/dataHalls/${dataHallId}/networkSwitch`
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching networkSwitchs for customer ${customerId} and dataHall ${dataHallId}:`,
        error
      );
      throw error;
    }
  },

  async getNetworkSwitchById(id: number): Promise<NetworkSwitch> {
    try {
      const response = await axios.get<NetworkSwitch>(`${API_URL}/networkSwitch/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching networkSwitch with id ${id}:`, error);
      throw error;
    }
  },

  async createNetworkSwitch(networkSwitch: Omit<NetworkSwitch, "id">): Promise<NetworkSwitch> {
    try {
      const response = await axios.post<NetworkSwitch>(`${API_URL}/networkSwitch`, networkSwitch);
      return response.data;
    } catch (error) {
      console.error("Error creating networkSwitch:", error);
      throw error;
    }
  },

  async updateNetworkSwitch(id: number, networkSwitch: Partial<NetworkSwitch>): Promise<NetworkSwitch> {
    try {
      const response = await axios.put<NetworkSwitch>(`${API_URL}/networkSwitch/${id}`, networkSwitch);
      return response.data;
    } catch (error) {
      console.error(`Error updating networkSwitch with id ${id}:`, error);
      throw error;
    }
  },

  async deleteNetworkSwitch(id: number): Promise<void> {
    try {
      await axios.delete(`${API_URL}/networkSwitch/${id}`);
    } catch (error) {
      console.error(`Error deleting networkSwitch with id ${id}:`, error);
      throw error;
    }
  },
};
