import axios from "axios";
import { SuperSpineLeafSwitch } from "src/types/models";

const API_URL = process.env.QUASAR_APP_API_URL;

export const superSpineLeafSwitchService = {
  async getAllSuperSpineLeafSwitchs(): Promise<SuperSpineLeafSwitch[]> {
    try {
      const response = await axios.get<SuperSpineLeafSwitch[]>(`${API_URL}/superSpineLeafSwitch`);
      return response.data;
    } catch (error) {
      console.error("Error fetching superSpineLeafSwitchs:", error);
      throw error;
    }
  },

  async getSuperSpineLeafSwitchsByCustomerAndDataHallId(
    customerId: number,
    dataHallId: number
  ): Promise<SuperSpineLeafSwitch[]> {
    try {
      const response = await axios.get<SuperSpineLeafSwitch[]>(
        `${API_URL}/customers/${customerId}/dataHalls/${dataHallId}/superSpineLeafSwitch`
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching superSpineLeafSwitchs for customer ${customerId} and dataHall ${dataHallId}:`,
        error
      );
      throw error;
    }
  },

  async getSuperSpineLeafSwitchById(id: number): Promise<SuperSpineLeafSwitch> {
    try {
      const response = await axios.get<SuperSpineLeafSwitch>(`${API_URL}/superSpineLeafSwitch/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching superSpineLeafSwitch with id ${id}:`, error);
      throw error;
    }
  },

  async createSuperSpineLeafSwitch(superSpineLeafSwitch: Omit<SuperSpineLeafSwitch, "id">): Promise<SuperSpineLeafSwitch> {
    try {
      const response = await axios.post<SuperSpineLeafSwitch>(`${API_URL}/superSpineLeafSwitch`, superSpineLeafSwitch);
      return response.data;
    } catch (error) {
      console.error("Error creating superSpineLeafSwitch:", error);
      throw error;
    }
  },

  async updateSuperSpineLeafSwitch(id: number, superSpineLeafSwitch: Partial<SuperSpineLeafSwitch>): Promise<SuperSpineLeafSwitch> {
    try {
      const response = await axios.put<SuperSpineLeafSwitch>(`${API_URL}/superSpineLeafSwitch/${id}`, superSpineLeafSwitch);
      return response.data;
    } catch (error) {
      console.error(`Error updating superSpineLeafSwitch with id ${id}:`, error);
      throw error;
    }
  },

  async deleteSuperSpineLeafSwitch(id: number): Promise<void> {
    try {
      await axios.delete(`${API_URL}/superSpineLeafSwitch/${id}`);
    } catch (error) {
      console.error(`Error deleting superSpineLeafSwitch with id ${id}:`, error);
      throw error;
    }
  },
};
