import axios from "axios";
import { GpuRearSide, GpuPort, NetworkTopology, NetworkType } from "src/types/models";

const API_URL = process.env.QUASAR_APP_API_URL;

export const gpuRearSideService = {
  async getAllGpuRearSides(): Promise<GpuRearSide[]> {
    try {
      const response = await axios.get<GpuRearSide[]>(`${API_URL}/gpuRearSide`);
      return response.data;
    } catch (error) {
      console.error("Error fetching gpuRearSides:", error);
      throw error;
    }
  },

  async getGpuRearSidesByCustomerAndDataHallId(
    customerId: number,
    dataHallId: number
  ): Promise<GpuRearSide[]> {
    try {
      const response = await axios.get<GpuRearSide[]>(
        `${API_URL}/customers/${customerId}/dataHalls/${dataHallId}/gpuRearSide`
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching gpuRearSides for customer ${customerId} and dataHall ${dataHallId}:`,
        error
      );
      throw error;
    }
  },

  async getGpuRearSideById(id: number): Promise<GpuRearSide> {
    try {
      const response = await axios.get<GpuRearSide>(`${API_URL}/gpuRearSide/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching gpuRearSide with id ${id}:`, error);
      throw error;
    }
  },

  async createGpuRearSide(gpuRearSide: Omit<GpuRearSide, "id">): Promise<GpuRearSide> {
    try {
      const response = await axios.post<GpuRearSide>(`${API_URL}/gpuRearSide`, gpuRearSide);
      return response.data;
    } catch (error) {
      console.error("Error creating gpuRearSide:", error);
      throw error;
    }
  },

  async updateGpuRearSide(id: number, gpuRearSide: Partial<GpuRearSide>): Promise<GpuRearSide> {
    try {
      const response = await axios.put<GpuRearSide>(`${API_URL}/gpuRearSide/${id}`, gpuRearSide);
      return response.data;
    } catch (error) {
      console.error(`Error updating gpuRearSide with id ${id}:`, error);
      throw error;
    }
  },

  async deleteGpuRearSide(id: number): Promise<void> {
    try {
      await axios.delete(`${API_URL}/gpuRearSide/${id}`);
    } catch (error) {
      console.error(`Error deleting gpuRearSide with id ${id}:`, error);
      throw error;
    }
  },

  async getGpuPorts(customerId: number, dataHallId: number): Promise<GpuPort[]> {
    try {
      const response = await axios.get<GpuPort[]>(
        `${API_URL}/customers/${customerId}/dataHalls/${dataHallId}/gpuRearSideType`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching gpuRearSide types:", error);
      throw error;
    }
  },

  async getNetworkTopologys(customerId: number, dataHallId: number): Promise<NetworkTopology[]> {
    try {
      const response = await axios.get<NetworkTopology[]>(
        `${API_URL}/customers/${customerId}/dataHalls/${dataHallId}/gpuRearSideType`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching gpuRearSide types:", error);
      throw error;
    }
  },

  async getNetworkTypes(customerId: number, dataHallId: number): Promise<NetworkType[]> {
    try {
      const response = await axios.get<NetworkType[]>(
        `${API_URL}/customers/${customerId}/dataHalls/${dataHallId}/gpuRearSideType`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching gpuRearSide types:", error);
      throw error;
    }
  }
};
