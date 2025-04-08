import axios from "axios";
import { Cable } from "src/types/models";

const API_URL = process.env.QUASAR_APP_API_URL;

export const cableService = {
  async getAllCables(): Promise<Cable[]> {
    try {
      const response = await axios.get<Cable[]>(`${API_URL}/cable`);
      return response.data;
    } catch (error) {
      console.error("Error fetching cables:", error);
      throw error;
    }
  },

  async getCablesByCustomerAndDataHallId(
    customerId: number,
    dataHallId: number
  ): Promise<Cable[]> {
    try {
      const response = await axios.get<Cable[]>(
        `${API_URL}/customers/${customerId}/dataHalls/${dataHallId}/cable`
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching cables for customer ${customerId} and dataHall ${dataHallId}:`,
        error
      );
      throw error;
    }
  },

  async getCableById(id: number): Promise<Cable> {
    try {
      const response = await axios.get<Cable>(`${API_URL}/cable/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching cable with id ${id}:`, error);
      throw error;
    }
  },

  async createCable(cable: Omit<Cable, "id">): Promise<Cable> {
    try {
      const response = await axios.post<Cable>(`${API_URL}/cable`, cable);
      return response.data;
    } catch (error) {
      console.error("Error creating cable:", error);
      throw error;
    }
  },

  async updateCable(id: number, cable: Partial<Cable>): Promise<Cable> {
    try {
      const response = await axios.put<Cable>(`${API_URL}/cable/${id}`, cable);
      return response.data;
    } catch (error) {
      console.error(`Error updating cable with id ${id}:`, error);
      throw error;
    }
  },

  async deleteCable(id: number): Promise<void> {
    try {
      await axios.delete(`${API_URL}/cable/${id}`);
    } catch (error) {
      console.error(`Error deleting cable with id ${id}:`, error);
      throw error;
    }
  },
};
