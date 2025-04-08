import axios from "axios";
import { SpineLeafZone } from "src/types/models";
const API_URL = process.env.QUASAR_APP_API_URL;

export const spineLeafZoneService = {
  async getAllSpineLeafZones(): Promise<SpineLeafZone[]> {
    try {
      const response = await axios.get<SpineLeafZone[]>(`${API_URL}/spineLeafZone`);
      return response.data;
    } catch (error) {
      console.error("Error fetching spine leaf zones:", error);
      throw error;
    }
  },

  async getSpineLeafZonesByCustomerAndDataHallId(
    customerId: number,
    dataHallId: number
  ): Promise<SpineLeafZone[]> {
    try {
      const response = await axios.get<SpineLeafZone[]>(
        `${API_URL}/customers/${customerId}/dataHalls/${dataHallId}/spineLeafZone`
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching spine leaf zones for customer ${customerId} and dataHall ${dataHallId}:`,
        error
      );
      throw error;
    }
  },

  async getSpineLeafZoneById(id: number): Promise<SpineLeafZone> {
    try {
      const response = await axios.get<SpineLeafZone>(`${API_URL}/spineLeafZone/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching spine leaf zone with id ${id}:`, error);
      throw error;
    }
  },

  async createSpineLeafZone(spineLeafZone: Omit<SpineLeafZone, "id">): Promise<SpineLeafZone> {
    try {
      const response = await axios.post<SpineLeafZone>(`${API_URL}/spineLeafZone`, spineLeafZone);
      return response.data;
    } catch (error) {
      console.error("Error creating spine leaf zone:", error);
      throw error;
    }
  },

  async updateSpineLeafZone(id: number, spineLeafZone: Partial<SpineLeafZone>): Promise<SpineLeafZone> {
    try {
      const response = await axios.put<SpineLeafZone>(`${API_URL}/spineLeafZone/${id}`, spineLeafZone);
      return response.data;
    } catch (error) {
      console.error(`Error updating spine leaf zone with id ${id}:`, error);
      throw error;
    }
  },

  async deleteSpineLeafZone(id: number): Promise<void> {
    try {
      await axios.delete(`${API_URL}/spineLeafZone/${id}`);
    } catch (error) {
      console.error(`Error deleting spine leaf zone with id ${id}:`, error);
      throw error;
    }
  },
};
