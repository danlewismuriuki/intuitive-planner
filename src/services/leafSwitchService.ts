import axios from "axios";
import { LeafSwitch } from "src/types/models";

const API_URL = process.env.QUASAR_APP_API_URL;

export const leafSwitchService = {
  async getAllLeafSwitchs(): Promise<LeafSwitch[]> {
    try {
      const response = await axios.get<LeafSwitch[]>(`${API_URL}/leafSwitch`);
      return response.data;
    } catch (error) {
      console.error("Error fetching leafSwitchs:", error);
      throw error;
    }
  },

  async getLeafSwitchsByCustomerAndDataHallId(
    customerId: number,
    dataHallId: number
  ): Promise<LeafSwitch[]> {
    try {
      const response = await axios.get<LeafSwitch[]>(
        `${API_URL}/customers/${customerId}/dataHalls/${dataHallId}/leafSwitch`
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching leafSwitchs for customer ${customerId} and dataHall ${dataHallId}:`,
        error
      );
      throw error;
    }
  },

  async getLeafSwitchById(id: number): Promise<LeafSwitch> {
    try {
      const response = await axios.get<LeafSwitch>(`${API_URL}/leafSwitch/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching leafSwitch with id ${id}:`, error);
      throw error;
    }
  },

  async createLeafSwitch(leafSwitch: Omit<LeafSwitch, "id">): Promise<LeafSwitch> {
    try {
      const response = await axios.post<LeafSwitch>(`${API_URL}/leafSwitch`, leafSwitch);
      return response.data;
    } catch (error) {
      console.error("Error creating leafSwitch:", error);
      throw error;
    }
  },

  async updateLeafSwitch(id: number, leafSwitch: Partial<LeafSwitch>): Promise<LeafSwitch> {
    try {
      const response = await axios.put<LeafSwitch>(`${API_URL}/leafSwitch/${id}`, leafSwitch);
      return response.data;
    } catch (error) {
      console.error(`Error updating leafSwitch with id ${id}:`, error);
      throw error;
    }
  },

  async deleteLeafSwitch(id: number): Promise<void> {
    try {
      await axios.delete(`${API_URL}/leafSwitch/${id}`);
    } catch (error) {
      console.error(`Error deleting leafSwitch with id ${id}:`, error);
      throw error;
    }
  },
};
