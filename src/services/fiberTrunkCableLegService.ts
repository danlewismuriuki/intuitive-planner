import axios from "axios";
import { FiberTrunkCableLeg, FiberTrunkCable, PatchPanelModulePort } from "src/types/models";

const API_URL = process.env.QUASAR_APP_API_URL;

export const fiberTrunkCableLegService = {
  async getAllFiberTrunkCableLegs(): Promise<FiberTrunkCableLeg[]> {
    try {
      const response = await axios.get<FiberTrunkCableLeg[]>(`${API_URL}/fiberTrunkCableLeg`);
      return response.data;
    } catch (error) {
      console.error("Error fetching fiberTrunkCableLegs:", error);
      throw error;
    }
  },

  async getFiberTrunkCableLegsByCustomerAndDataHallId(
    customerId: number,
    dataHallId: number
  ): Promise<FiberTrunkCableLeg[]> {
    try {
      const response = await axios.get<FiberTrunkCableLeg[]>(
        `${API_URL}/customers/${customerId}/dataHalls/${dataHallId}/fiberTrunkCableLeg`
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching fiberTrunkCableLegs for customer ${customerId} and dataHall ${dataHallId}:`,
        error
      );
      throw error;
    }
  },

  async getFiberTrunkCableLegById(id: number): Promise<FiberTrunkCableLeg> {
    try {
      const response = await axios.get<FiberTrunkCableLeg>(`${API_URL}/fiberTrunkCableLeg/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching fiberTrunkCableLeg with id ${id}:`, error);
      throw error;
    }
  },

  async createFiberTrunkCableLeg(fiberTrunkCableLeg: Omit<FiberTrunkCableLeg, "id">): Promise<FiberTrunkCableLeg> {
    try {
      const response = await axios.post<FiberTrunkCableLeg>(`${API_URL}/fiberTrunkCableLeg`, fiberTrunkCableLeg);
      return response.data;
    } catch (error) {
      console.error("Error creating fiberTrunkCableLeg:", error);
      throw error;
    }
  },

  async updateFiberTrunkCableLeg(id: number, fiberTrunkCableLeg: Partial<FiberTrunkCableLeg>): Promise<FiberTrunkCableLeg> {
    try {
      const response = await axios.put<FiberTrunkCableLeg>(`${API_URL}/fiberTrunkCableLeg/${id}`, fiberTrunkCableLeg);
      return response.data;
    } catch (error) {
      console.error(`Error updating fiberTrunkCableLeg with id ${id}:`, error);
      throw error;
    }
  },

  async deleteFiberTrunkCableLeg(id: number): Promise<void> {
    try {
      await axios.delete(`${API_URL}/fiberTrunkCableLeg/${id}`);
    } catch (error) {
      console.error(`Error deleting fiberTrunkCableLeg with id ${id}:`, error);
      throw error;
    }
  },

  async getFiberTrunkCables(customerId: number, dataHallId: number): Promise<FiberTrunkCable[]> {
    try {
      const response = await axios.get<FiberTrunkCable[]>(
        `${API_URL}/customers/${customerId}/dataHalls/${dataHallId}/fiberTrunkCableLegType`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching fiberTrunkCableLeg types:", error);
      throw error;
    }
  },

  async getPatchPanelModulePorts(customerId: number, dataHallId: number): Promise<PatchPanelModulePort[]> {
    try {
      const response = await axios.get<PatchPanelModulePort[]>(
        `${API_URL}/customers/${customerId}/dataHalls/${dataHallId}/fiberTrunkCableLegType`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching fiberTrunkCableLeg types:", error);
      throw error;
    }
  }
};
