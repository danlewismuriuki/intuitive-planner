// 4 children. Methods below

import axios from "axios";
import { GpuComputeRack, PatchPanel, Cable, FiberTrunkCable, NetworkSwitch, Server } from "src/types/models";

const API_URL = process.env.QUASAR_APP_API_URL;

export const gpuComputeRackService = {
  async getAllGpuComputeRacks(): Promise<GpuComputeRack[]> {
    try {
      const response = await axios.get<GpuComputeRack[]>(`${API_URL}/gpucomputerack`);
      return response.data;
    } catch (error) {
      console.error("Error fetching gpucomputeracks:", error);
      throw error;
    }
  },

  async getGpuComputeRacksByCustomerAndDataHallId(
    customerId: number,
    dataHallId: number
  ): Promise<GpuComputeRack[]> {
    try {
      const response = await axios.get<GpuComputeRack[]>(
        `${API_URL}/customers/${customerId}/dataHalls/${dataHallId}/gpucomputerack`
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching gpucomputeracks for customer ${customerId} and dataHall ${dataHallId}:`,
        error
      );
      throw error;
    }
  },

  async getGpuComputeRackById(id: number): Promise<GpuComputeRack> {
    try {
      const response = await axios.get<GpuComputeRack>(`${API_URL}/gpucomputerack/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching gpucomputerack with id ${id}:`, error);
      throw error;
    }
  },

  async createGpuComputeRack(gpucomputerack: Omit<GpuComputeRack, "id">): Promise<GpuComputeRack> {
    try {
      const response = await axios.post<GpuComputeRack>(`${API_URL}/gpucomputerack`, gpucomputerack);
      return response.data;
    } catch (error) {
      console.error("Error creating gpucomputerack:", error);
      throw error;
    }
  },

  async updateGpuComputeRack(id: number, gpucomputerack: Partial<GpuComputeRack>): Promise<GpuComputeRack> {
    try {
      const response = await axios.put<GpuComputeRack>(`${API_URL}/gpucomputerack/${id}`, gpucomputerack);
      return response.data;
    } catch (error) {
      console.error(`Error updating gpucomputerack with id ${id}:`, error);
      throw error;
    }
  },

  async deleteGpuComputeRack(id: number): Promise<void> {
    try {
      await axios.delete(`${API_URL}/gpucomputerack/${id}`);
    } catch (error) {
      console.error(`Error deleting gpucomputerack with id ${id}:`, error);
      throw error;
    }
  },

  async getPatchPanels(customerId: number, dataHallId: number): Promise<PatchPanel[]> {
    try {
      const response = await axios.get<PatchPanel[]>(
        `${API_URL}/customers/${customerId}/dataHalls/${dataHallId}/gpucomputerackType`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching gpucomputerack types:", error);
      throw error;
    }
  },

  async getCables(customerId: number, dataHallId: number): Promise<Cable[]> {
    try {
      const response = await axios.get<Cable[]>(
        `${API_URL}/customers/${customerId}/dataHalls/${dataHallId}/gpucomputerackType`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching gpucomputerack types:", error);
      throw error;
    }
  },

  async getFiberTrunkCables(customerId: number, dataHallId: number): Promise<FiberTrunkCable[]> {
    try {
      const response = await axios.get<FiberTrunkCable[]>(
        `${API_URL}/customers/${customerId}/dataHalls/${dataHallId}/gpucomputerackType`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching gpucomputerack types:", error);
      throw error;
    }
  },

  async getNetworkSwitchs(customerId: number, dataHallId: number): Promise<NetworkSwitch[]> {
    try {
      const response = await axios.get<NetworkSwitch[]>(
        `${API_URL}/customers/${customerId}/dataHalls/${dataHallId}/gpucomputerackType`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching gpucomputerack types:", error);
      throw error;
    }
  },

  async getServers(customerId: number, dataHallId: number): Promise<Server[]> {
    try {
      const response = await axios.get<Server[]>(
        `${API_URL}/customers/${customerId}/dataHalls/${dataHallId}/gpucomputerackType`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching gpucomputerack types:", error);
      throw error;
    }
  }

};
