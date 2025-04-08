import axios from "axios";
import { CpuComputeRack, Rack } from "src/types/models";

const API_URL = process.env.QUASAR_APP_API_URL;

export const cpuComputeRackService = {
  async getAllCpuComputeRacks(): Promise<CpuComputeRack[]> {
    try {
      const response = await axios.get<CpuComputeRack[]>(`${API_URL}/cpuComputeRack`);
      return response.data;
    } catch (error) {
      console.error("Error fetching cpuComputeRacks:", error);
      throw error;
    }
  },

  async getCpuComputeRacksByCustomerAndDataHallId(
    customerId: number,
    dataHallId: number
  ): Promise<CpuComputeRack[]> {
    try {
      const response = await axios.get<CpuComputeRack[]>(
        `${API_URL}/customers/${customerId}/dataHalls/${dataHallId}/cpuComputeRack`
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching cpuComputeRacks for customer ${customerId} and dataHall ${dataHallId}:`,
        error
      );
      throw error;
    }
  },

  async getCpuComputeRackById(id: number): Promise<CpuComputeRack> {
    try {
      const response = await axios.get<CpuComputeRack>(`${API_URL}/cpuComputeRack/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching cpuComputeRack with id ${id}:`, error);
      throw error;
    }
  },

  async createCpuComputeRack(cpuComputeRack: Omit<CpuComputeRack, "id">): Promise<CpuComputeRack> {
    try {
      const response = await axios.post<CpuComputeRack>(`${API_URL}/cpuComputeRack`, cpuComputeRack);
      return response.data;
    } catch (error) {
      console.error("Error creating cpuComputeRack:", error);
      throw error;
    }
  },

  async updateCpuComputeRack(id: number, cpuComputeRack: Partial<CpuComputeRack>): Promise<CpuComputeRack> {
    try {
      const response = await axios.put<CpuComputeRack>(`${API_URL}/cpuComputeRack/${id}`, cpuComputeRack);
      return response.data;
    } catch (error) {
      console.error(`Error updating cpuComputeRack with id ${id}:`, error);
      throw error;
    }
  },

  async deleteCpuComputeRack(id: number): Promise<void> {
    try {
      await axios.delete(`${API_URL}/cpuComputeRack/${id}`);
    } catch (error) {
      console.error(`Error deleting cpuComputeRack with id ${id}:`, error);
      throw error;
    }
  },

  async getRacks(customerId: number, dataHallId: number): Promise<Rack[]> {
    try {
      const response = await axios.get<Rack[]>(
        `${API_URL}/customers/${customerId}/dataHalls/${dataHallId}/cpuComputeRackType`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching cpuComputeRack types:", error);
      throw error;
    }
  }
};
