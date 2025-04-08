import axios from "axios";
import { SuperSpineZone } from "src/types/models";

const API_URL = process.env.QUASAR_APP_API_URL;

export const superSpineZoneService = {
  async getAllSuperSpineZones(): Promise<SuperSpineZone[]> {
    try {
      const response = await axios.get<SuperSpineZone[]>(`${API_URL}/superSpineZone`);
      return response.data;
    } catch (error) {
      console.error("Error fetching superspinezones:", error);
      throw error;
    }
  },

  async getSuperSpineZonesByCustomerAndDataHallId(
    customerId: number,
    dataHallId: number
  ): Promise<SuperSpineZone[]> {
    try {
      const response = await axios.get<SuperSpineZone[]>(
        `${API_URL}/customers/${customerId}/dataHalls/${dataHallId}/superSpineZone`
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching superspinezones for customer ${customerId} and dataHall ${dataHallId}:`,
        error
      );
      throw error;
    }
  },

  async getSuperSpineZoneById(id: number): Promise<SuperSpineZone> {
    try {
      const response = await axios.get<SuperSpineZone>(`${API_URL}/superSpineZone/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching superspinezone with id ${id}:`, error);
      throw error;
    }
  },

  async createSuperSpineZone(superSpineZone: Omit<SuperSpineZone, "id">): Promise<SuperSpineZone> {
    try {
      const response = await axios.post<SuperSpineZone>(`${API_URL}/superSpineZone`, superSpineZone);
      return response.data;
    } catch (error) {
      console.error("Error creating superspinezone:", error);
      throw error;
    }
  },

  async updateSuperSpineZone(id: number, superSpineZone: Partial<SuperSpineZone>): Promise<SuperSpineZone> {
    try {
      // Ensure we only send the fields we want to update
      const updateData = {
        name: superSpineZone.name,
        customerId: superSpineZone.customerId,
        dataHallId: superSpineZone.dataHallId
      };
      const response = await axios.put<SuperSpineZone>(`${API_URL}/superSpineZone/${id}`, updateData);
      return response.data;
    } catch (error) {
      console.error(`Error updating superspinezone with id ${id}:`, error);
      throw error;
    }
  },

  async deleteSuperSpineZone(id: number): Promise<void> {
    try {
      await axios.delete(`${API_URL}/superSpineZone/${id}`);
    } catch (error) {
      console.error(`Error deleting superspinezone with id ${id}:`, error);
      throw error;
    }
  }
};
