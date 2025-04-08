import axios from "axios";
import { Zone, ZoneType } from "src/types/models";

const API_URL = process.env.QUASAR_APP_API_URL;

export const zoneService = {
  async getAllZones(): Promise<Zone[]> {
    try {
      const response = await axios.get<Zone[]>(`${API_URL}/zone`);
      return response.data;
    } catch (error) {
      console.error("Error fetching zones:", error);
      throw error;
    }
  },

  async getZonesByCustomerAndDataHallId(
    customerId: number,
    dataHallId: number
  ): Promise<Zone[]> {
    try {
      const response = await axios.get<Zone[]>(
        `${API_URL}/customers/${customerId}/dataHalls/${dataHallId}/zone`
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching zones for customer ${customerId} and dataHall ${dataHallId}:`,
        error
      );
      throw error;
    }
  },

  async getZoneById(id: number): Promise<Zone> {
    try {
      const response = await axios.get<Zone>(`${API_URL}/zone/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching zone with id ${id}:`, error);
      throw error;
    }
  },

  async createZone(zone: Omit<Zone, "id">): Promise<Zone> {
    try {
      const response = await axios.post<Zone>(`${API_URL}/zone`, zone);
      return response.data;
    } catch (error) {
      console.error("Error creating zone:", error);
      throw error;
    }
  },

  async updateZone(id: number, zone: Partial<Zone>): Promise<Zone> {
    try {
      const response = await axios.put<Zone>(`${API_URL}/zone/${id}`, zone);
      return response.data;
    } catch (error) {
      console.error(`Error updating zone with id ${id}:`, error);
      throw error;
    }
  },

  async deleteZone(id: number): Promise<void> {
    try {
      await axios.delete(`${API_URL}/zone/${id}`);
    } catch (error) {
      console.error(`Error deleting zone with id ${id}:`, error);
      throw error;
    }
  },

  async getZoneTypes(customerId: number, dataHallId: number): Promise<ZoneType[]> {
    try {
      const response = await axios.get<ZoneType[]>(
        `${API_URL}/customers/${customerId}/dataHalls/${dataHallId}/zoneType`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching zone types:", error);
      throw error;
    }
  }
};
