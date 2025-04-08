import axios from "axios";
import { PatchPanel } from "src/types/models";

const API_URL = process.env.QUASAR_APP_API_URL;

export const patchPanelService = {
  async getAllPatchPanels(): Promise<PatchPanel[]> {
    try {
      const response = await axios.get<PatchPanel[]>(`${API_URL}/patchPanel`);
      return response.data;
    } catch (error) {
      console.error("Error fetching patchPanels:", error);
      throw error;
    }
  },

  async getPatchPanelsByCustomerAndDataHallId(
    customerId: number,
    dataHallId: number
  ): Promise<PatchPanel[]> {
    try {
      const response = await axios.get<PatchPanel[]>(
        `${API_URL}/customers/${customerId}/dataHalls/${dataHallId}/patchPanel`
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching patchPanels for customer ${customerId} and dataHall ${dataHallId}:`,
        error
      );
      throw error;
    }
  },

  async getPatchPanelById(id: number): Promise<PatchPanel> {
    try {
      const response = await axios.get<PatchPanel>(`${API_URL}/patchPanel/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching patchPanel with id ${id}:`, error);
      throw error;
    }
  },

  async createPatchPanel(patchPanel: Omit<PatchPanel, "id">): Promise<PatchPanel> {
    try {
      const response = await axios.post<PatchPanel>(`${API_URL}/patchPanel`, patchPanel);
      return response.data;
    } catch (error) {
      console.error("Error creating patchPanel:", error);
      throw error;
    }
  },

  async updatePatchPanel(id: number, patchPanel: Partial<PatchPanel>): Promise<PatchPanel> {
    try {
      const response = await axios.put<PatchPanel>(`${API_URL}/patchPanel/${id}`, patchPanel);
      return response.data;
    } catch (error) {
      console.error(`Error updating patchPanel with id ${id}:`, error);
      throw error;
    }
  },

  async deletePatchPanel(id: number): Promise<void> {
    try {
      await axios.delete(`${API_URL}/patchPanel/${id}`);
    } catch (error) {
      console.error(`Error deleting patchPanel with id ${id}:`, error);
      throw error;
    }
  },
};
