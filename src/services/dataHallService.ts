import axios from "axios";
import { DataHall } from "src/types/models";

const API_URL = process.env.QUASAR_APP_API_URL;

export const dataHallService = {
  async getAllDataHalls(): Promise<DataHall[]> {
    try {
      const response = await axios.get<DataHall[]>(`${API_URL}/dataHall`);
      return response.data;
    } catch (error) {
      console.error("Error fetching data halls:", error);
      throw error;
    }
  },

  async getDataHallsByCustomerId(customerId: number): Promise<DataHall[]> {
    try {
      const response = await axios.get<DataHall[]>(
        `${API_URL}/customers/${customerId}/dataHall`
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching data halls for customer ${customerId}:`,
        error
      );
      throw error;
    }
  },

  async getDataHallById(id: number): Promise<DataHall> {
    try {
      const response = await axios.get<DataHall>(`${API_URL}/dataHall/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching data hall with id ${id}:`, error);
      throw error;
    }
  },

  async createDataHall(dataHall: Omit<DataHall, "id">): Promise<DataHall> {
    try {
      const response = await axios.post<DataHall>(
        `${API_URL}/dataHall`,
        dataHall
      );
      return response.data;
    } catch (error) {
      console.error("Error creating data hall:", error);
      throw error;
    }
  },

  async updateDataHall(
    id: number,
    dataHall: Partial<DataHall>
  ): Promise<DataHall> {
    try {
      const response = await axios.put<DataHall>(
        `${API_URL}/dataHall/${id}`,
        dataHall
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating data hall with id ${id}:`, error);
      throw error;
    }
  },

  async deleteDataHall(id: number): Promise<void> {
    try {
      await axios.delete(`${API_URL}/dataHall/${id}`);
    } catch (error) {
      console.error(`Error deleting data hall with id ${id}:`, error);
      throw error;
    }
  },
};
