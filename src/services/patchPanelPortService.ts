import axios from "axios";
import { PatchPanelPort } from "src/types/models";

const API_URL = process.env.QUASAR_APP_API_URL;

export const patchPanelPortService = {
  async getAllPatchPanelPorts(): Promise<PatchPanelPort[]> {
    try {
      const response = await axios.get<PatchPanelPort[]>(`${API_URL}/patchpanelport`);
      return response.data;
    } catch (error) {
      console.error("Error fetching patchPanelPorts:", error);
      throw error;
    }
  },

  async getPatchPanelPortsByCustomerAndDataHallId(
    customerId: number,
    dataHallId: number
  ): Promise<PatchPanelPort[]> {
    try {
      const response = await axios.get<PatchPanelPort[]>(
        `${API_URL}/customers/${customerId}/dataHalls/${dataHallId}/patchpanelport`
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching patchPanelPorts for customer ${customerId} and dataHall ${dataHallId}:`,
        error
      );
      throw error;
    }
  },

  async getPatchPanelPortById(id: number): Promise<PatchPanelPort> {
    try {
      const response = await axios.get<PatchPanelPort>(`${API_URL}/patchpanelport/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching patchpanelportwith id ${id}:`, error);
      throw error;
    }
  },

  async createPatchPanelPort(patchpanelport: Omit<PatchPanelPort, "id">): Promise<PatchPanelPort> {
    try {
      const response = await axios.post<PatchPanelPort>(`${API_URL}/patchpanelport`, patchpanelport);
      return response.data;
    } catch (error) {
      console.error("Error creating patchpanelport:", error);
      throw error;
    }
  },

  async updatePatchPanelPort(id: number, patchpanelport: Partial<PatchPanelPort>): Promise<PatchPanelPort> {
    try {
      const response = await axios.put<PatchPanelPort>(`${API_URL}/patchpanelport/${id}`, patchpanelport);
      return response.data;
    } catch (error) {
      console.error(`Error updating patchpanelportwith id ${id}:`, error);
      throw error;
    }
  },

  async deletePatchPanelPort(id: number): Promise<void> {
    try {
      await axios.delete(`${API_URL}/patchpanelport/${id}`);
    } catch (error) {
      console.error(`Error deleting patchpanelportwith id ${id}:`, error);
      throw error;
    }
  },
};
