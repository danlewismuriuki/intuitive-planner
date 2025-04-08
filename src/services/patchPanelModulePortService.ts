

import axios from "axios";
import { PatchPanelModulePort, FiberTrunkCableLeg, FiberTrunkCable } from "src/types/models";

const API_URL = process.env.QUASAR_APP_API_URL;

export const patchPanelModulePortService = {
  async getAllPatchPanelModulePorts(): Promise<PatchPanelModulePort[]> {
    try {
      const response = await axios.get<PatchPanelModulePort[]>(`${API_URL}/patchPanelModulePort`);
      return response.data;
    } catch (error) {
      console.error("Error fetching patchPanelModulePorts:", error);
      throw error;
    }
  },

  async getPatchPanelModulePortsByCustomerAndDataHallId(
    customerId: number,
    dataHallId: number
  ): Promise<PatchPanelModulePort[]> {
    try {
      const response = await axios.get<PatchPanelModulePort[]>(
        `${API_URL}/customers/${customerId}/dataHalls/${dataHallId}/patchPanelModulePort`
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching patchPanelModulePorts for customer ${customerId} and dataHall ${dataHallId}:`,
        error
      );
      throw error;
    }
  },

  async getPatchPanelModulePortById(id: number): Promise<PatchPanelModulePort> {
    try {
      const response = await axios.get<PatchPanelModulePort>(`${API_URL}/patchPanelModulePort/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching patchPanelModulePort with id ${id}:`, error);
      throw error;
    }
  },

  async createPatchPanelModulePort(patchPanelModulePort: Omit<PatchPanelModulePort, "id">): Promise<PatchPanelModulePort> {
    try {
      const response = await axios.post<PatchPanelModulePort>(`${API_URL}/patchPanelModulePort`, patchPanelModulePort);
      return response.data;
    } catch (error) {
      console.error("Error creating patchPanelModulePort:", error);
      throw error;
    }
  },

  async updatePatchPanelModulePort(id: number, patchPanelModulePort: Partial<PatchPanelModulePort>): Promise<PatchPanelModulePort> {
    try {
      const response = await axios.put<PatchPanelModulePort>(`${API_URL}/patchPanelModulePort/${id}`, patchPanelModulePort);
      return response.data;
    } catch (error) {
      console.error(`Error updating patchPanelModulePort with id ${id}:`, error);
      throw error;
    }
  },

  async deletePatchPanelModulePort(id: number): Promise<void> {
    try {
      await axios.delete(`${API_URL}/patchPanelModulePort/${id}`);
    } catch (error) {
      console.error(`Error deleting patchPanelModulePort with id ${id}:`, error);
      throw error;
    }
  },

  async getFiberTrunkCableLegs(customerId: number, dataHallId: number): Promise<FiberTrunkCableLeg[]> {
    try {
      const response = await axios.get<FiberTrunkCableLeg[]>(
        `${API_URL}/customers/${customerId}/dataHalls/${dataHallId}/patchPanelModulePortType`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching patchPanelModulePort types:", error);
      throw error;
    }
  },

  async getFiberTrunkCables(customerId: number, dataHallId: number): Promise<FiberTrunkCable[]> {
    try {
      const response = await axios.get<FiberTrunkCable[]>(
        `${API_URL}/customers/${customerId}/dataHalls/${dataHallId}/patchPanelModulePortType`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching patchPanelModulePort types:", error);
      throw error;
    }
  }
};
