import axios from "axios";
import { Cooling } from "src/types/models";

const API_URL = process.env.QUASAR_APP_API_URL;

export const coolingService = {
  async getAllCoolings(): Promise<Cooling[]> {
    try {
      const response = await axios.get<Cooling[]>(`${API_URL}/cooling`);
      return response.data;
    } catch (error) {
      console.error("Error fetching coolings:", error);
      throw error;
    }
  },

  async getCoolingsByCustomerAndDataHallId(
    customerId: number,
    dataHallId: number
  ): Promise<Cooling[]> {
    try {
      const response = await axios.get<Cooling[]>(
        `${API_URL}/customers/${customerId}/dataHalls/${dataHallId}/cooling`
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching coolings for customer ${customerId} and dataHall ${dataHallId}:`,
        error
      );
      throw error;
    }
  },

  async getCoolingById(id: number): Promise<Cooling> {
    try {
      const response = await axios.get<Cooling>(`${API_URL}/cooling/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching cooling with id ${id}:`, error);
      throw error;
    }
  },

  async createCooling(cooling: Omit<Cooling, "id">): Promise<Cooling> {
    try {
      const response = await axios.post<Cooling>(`${API_URL}/cooling`, cooling);
      return response.data;
    } catch (error) {
      console.error("Error creating cooling:", error);
      throw error;
    }
  },

  async updateCooling(id: number, cooling: Partial<Cooling>): Promise<Cooling> {
    try {
      const response = await axios.put<Cooling>(`${API_URL}/cooling/${id}`, cooling);
      return response.data;
    } catch (error) {
      console.error(`Error updating cooling with id ${id}:`, error);
      throw error;
    }
  },

  async deleteCooling(id: number): Promise<void> {
    try {
      await axios.delete(`${API_URL}/cooling/${id}`);
    } catch (error) {
      console.error(`Error deleting cooling with id ${id}:`, error);
      throw error;
    }
  },
};
