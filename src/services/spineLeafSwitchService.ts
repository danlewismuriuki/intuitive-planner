import axios from "axios";
import { SpineLeafSwitch } from "src/types/models";

const API_URL = process.env.QUASAR_APP_API_URL;

export const spineLeafSwitchService = {
  async getAllSpineLeafSwitchs(): Promise<SpineLeafSwitch[]> {
    try {
      const response = await axios.get<SpineLeafSwitch[]>(`${API_URL}/spineLeafSwitch`);
      return response.data;
    } catch (error) {
      console.error("Error fetching spineLeafSwitchs:", error);
      throw error;
    }
  },

  async getSpineLeafSwitchsByCustomerAndDataHallId(
    customerId: number,
    dataHallId: number
  ): Promise<SpineLeafSwitch[]> {
    try {
      const response = await axios.get<SpineLeafSwitch[]>(
        `${API_URL}/customers/${customerId}/dataHalls/${dataHallId}/spineLeafSwitch`
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching spineLeafSwitchs for customer ${customerId} and dataHall ${dataHallId}:`,
        error
      );
      throw error;
    }
  },

  async getSpineLeafSwitchById(id: number): Promise<SpineLeafSwitch> {
    try {
      const response = await axios.get<SpineLeafSwitch>(`${API_URL}/spineLeafSwitch/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching spineLeafSwitch with id ${id}:`, error);
      throw error;
    }
  },

  async createSpineLeafSwitch(spineLeafSwitch: Omit<SpineLeafSwitch, "id">): Promise<SpineLeafSwitch> {
    try {
      const response = await axios.post<SpineLeafSwitch>(`${API_URL}/spineLeafSwitch`, spineLeafSwitch);
      return response.data;
    } catch (error) {
      console.error("Error creating spineLeafSwitch:", error);
      throw error;
    }
  },

  async updateSpineLeafSwitch(id: number, spineLeafSwitch: Partial<SpineLeafSwitch>): Promise<SpineLeafSwitch> {
    try {
      const response = await axios.put<SpineLeafSwitch>(`${API_URL}/spineLeafSwitch/${id}`, spineLeafSwitch);
      return response.data;
    } catch (error) {
      console.error(`Error updating spineLeafSwitch with id ${id}:`, error);
      throw error;
    }
  },

  async deleteSpineLeafSwitch(id: number): Promise<void> {
    try {
      await axios.delete(`${API_URL}/spineLeafSwitch/${id}`);
    } catch (error) {
      console.error(`Error deleting spineLeafSwitch with id ${id}:`, error);
      throw error;
    }
  },
};
