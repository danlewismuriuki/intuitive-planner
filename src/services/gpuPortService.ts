import axios from "axios";
import { GpuPort } from "src/types/models";

const API_URL = process.env.QUASAR_APP_API_URL;

export const gpuPortService = {
  async getAllGpuPorts(): Promise<GpuPort[]> {
    try {
      const response = await axios.get<GpuPort[]>(`${API_URL}/gpuPort`);
      return response.data;
    } catch (error) {
      console.error("Error fetching gpuPorts:", error);
      throw error;
    }
  },

  async getGpuPortsByCustomerAndDataHallId(
    customerId: number,
    dataHallId: number
  ): Promise<GpuPort[]> {
    try {
      const response = await axios.get<GpuPort[]>(
        `${API_URL}/customers/${customerId}/dataHalls/${dataHallId}/gpuPort`
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching gpuPorts for customer ${customerId} and dataHall ${dataHallId}:`,
        error
      );
      throw error;
    }
  },

  async getGpuPortById(id: number): Promise<GpuPort> {
    try {
      const response = await axios.get<GpuPort>(`${API_URL}/gpuPort/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching gpuPort with id ${id}:`, error);
      throw error;
    }
  },

  async createGpuPort(gpuPort: Omit<GpuPort, "id">): Promise<GpuPort> {
    try {
      const response = await axios.post<GpuPort>(`${API_URL}/gpuPort`, gpuPort);
      return response.data;
    } catch (error) {
      console.error("Error creating gpuPort:", error);
      throw error;
    }
  },

  async updateGpuPort(id: number, gpuPort: Partial<GpuPort>): Promise<GpuPort> {
    try {
      const response = await axios.put<GpuPort>(`${API_URL}/gpuPort/${id}`, gpuPort);
      return response.data;
    } catch (error) {
      console.error(`Error updating gpuPort with id ${id}:`, error);
      throw error;
    }
  },

  async deleteGpuPort(id: number): Promise<void> {
    try {
      await axios.delete(`${API_URL}/gpuPort/${id}`);
    } catch (error) {
      console.error(`Error deleting gpuPort with id ${id}:`, error);
      throw error;
    }
  },
};
