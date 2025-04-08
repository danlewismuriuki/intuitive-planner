import axios from "axios";
import { StorageUnitZone } from "src/types/models";

const API_URL = process.env.QUASAR_APP_API_URL;

export const storageUnitZoneService = {
  async getAllStorageUnitZones(): Promise<StorageUnitZone[]> {
    try {
      const response = await axios.get<StorageUnitZone[]>(`${API_URL}/storageUnitZone`);
      return response.data;
    } catch (error) {
      console.error("Error fetching storageUnitZones:", error);
      throw error;
    }
  },

  async getStorageUnitZonesByCustomerAndDataHallId(
    customerId: number,
    dataHallId: number
  ): Promise<StorageUnitZone[]> {
    try {
      const response = await axios.get<StorageUnitZone[]>(
        `${API_URL}/customers/${customerId}/dataHalls/${dataHallId}/storageUnitZone`
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching storageUnitZones for customer ${customerId} and dataHall ${dataHallId}:`,
        error
      );
      throw error;
    }
  },

  async getStorageUnitZoneById(id: number): Promise<StorageUnitZone> {
    try {
      const response = await axios.get<StorageUnitZone>(`${API_URL}/storageUnitZone/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching storageUnitZone with id ${id}:`, error);
      throw error;
    }
  },

  async createStorageUnitZone(storageUnitZone: Omit<StorageUnitZone, "id">): Promise<StorageUnitZone> {
    try {
      const response = await axios.post<StorageUnitZone>(`${API_URL}/storageUnitZone`, storageUnitZone);
      return response.data;
    } catch (error) {
      console.error("Error creating storageUnitZone:", error);
      throw error;
    }
  },

  async updateStorageUnitZone(id: number, storageUnitZone: Partial<StorageUnitZone>): Promise<StorageUnitZone> {
    try {
      const response = await axios.put<StorageUnitZone>(`${API_URL}/storageUnitZone/${id}`, storageUnitZone);
      return response.data;
    } catch (error) {
      console.error(`Error updating storageUnitZone with id ${id}:`, error);
      throw error;
    }
  },

  async deleteStorageUnitZone(id: number): Promise<void> {
    try {
      await axios.delete(`${API_URL}/storageUnitZone/${id}`);
    } catch (error) {
      console.error(`Error deleting storageUnitZone with id ${id}:`, error);
      throw error;
    }
  },

};
