/// Has Two children

import axios from "axios";
import { Gpu, GpuFrontSide, GpuRearSide } from "src/types/models";

const API_URL = process.env.QUASAR_APP_API_URL;

export const gpuService = {
  async getAllGpus(): Promise<Gpu[]> {
    try {
      const response = await axios.get<Gpu[]>(`${API_URL}/gpu`);
      return response.data;
    } catch (error) {
      console.error("Error fetching gpus:", error);
      throw error;
    }
  },

  async getGpusByCustomerAndDataHallId(
    customerId: number,
    dataHallId: number
  ): Promise<Gpu[]> {
    try {
      const response = await axios.get<Gpu[]>(
        `${API_URL}/customers/${customerId}/dataHalls/${dataHallId}/gpu`
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching gpus for customer ${customerId} and dataHall ${dataHallId}:`,
        error
      );
      throw error;
    }
  },

  async getGpuById(id: number): Promise<Gpu> {
    try {
      const response = await axios.get<Gpu>(`${API_URL}/gpu/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching gpu with id ${id}:`, error);
      throw error;
    }
  },

  async createGpu(gpu: Omit<Gpu, "id">): Promise<Gpu> {
    try {
      const response = await axios.post<Gpu>(`${API_URL}/gpu`, gpu);
      return response.data;
    } catch (error) {
      console.error("Error creating gpu:", error);
      throw error;
    }
  },

  async updateGpu(id: number, gpu: Partial<Gpu>): Promise<Gpu> {
    try {
      const response = await axios.put<Gpu>(`${API_URL}/gpu/${id}`, gpu);
      return response.data;
    } catch (error) {
      console.error(`Error updating gpu with id ${id}:`, error);
      throw error;
    }
  },

  async deleteGpu(id: number): Promise<void> {
    try {
      await axios.delete(`${API_URL}/gpu/${id}`);
    } catch (error) {
      console.error(`Error deleting gpu with id ${id}:`, error);
      throw error;
    }
  },

  async getGpuFrontSides(customerId: number, dataHallId: number): Promise<GpuFrontSide[]> {
    try {
      const response = await axios.get<GpuFrontSide[]>(
        `${API_URL}/customers/${customerId}/dataHalls/${dataHallId}/gpuType`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching gpu types:", error);
      throw error;
    }
  },

  async getGpuRearSides(customerId: number, dataHallId: number): Promise<GpuRearSide[]> {
    try {
      const response = await axios.get<GpuFrontSide[]>(
        `${API_URL}/customers/${customerId}/dataHalls/${dataHallId}/gpuType`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching gpu types:", error);
      throw error;
    }
  }
};


