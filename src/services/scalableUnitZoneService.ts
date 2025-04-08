import axios from "axios";
import { ScalableUnitZone } from "src/types/models";

const API_URL = process.env.QUASAR_APP_API_URL;

export const scalableUnitZoneService = {
  async getAllScalableUnitZones(): Promise<ScalableUnitZone[]> {
    try {
      const response = await axios.get<ScalableUnitZone[]>(`${API_URL}/scalableUnitZone`);
      return response.data;
    } catch (error) {
      console.error("Error fetching scalableUnitZones:", error);
      throw error;
    }
  },

  async getScalableUnitZonesByCustomerAndDataHallId(
    customerId: number,
    dataHallId: number
  ): Promise<ScalableUnitZone[]> {
    try {
      const response = await axios.get<ScalableUnitZone[]>(
        `${API_URL}/customers/${customerId}/dataHalls/${dataHallId}/scalableUnitZone`
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching scalableUnitZones for customer ${customerId} and dataHall ${dataHallId}:`,
        error
      );
      throw error;
    }
  },

  async getScalableUnitZoneById(id: number): Promise<ScalableUnitZone> {
    try {
      const response = await axios.get<ScalableUnitZone>(`${API_URL}/scalableUnitZone/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching scalableUnitZone with id ${id}:`, error);
      throw error;
    }
  },

  async createScalableUnitZone(scalableUnitZone: Omit<ScalableUnitZone, "id">): Promise<ScalableUnitZone> {
    try {
      const response = await axios.post<ScalableUnitZone>(`${API_URL}/scalableUnitZone`, scalableUnitZone);
      return response.data;
    } catch (error) {
      console.error("Error creating scalableUnitZone:", error);
      throw error;
    }
  },

  async updateScalableUnitZone(id: number, scalableUnitZone: Partial<ScalableUnitZone>): Promise<ScalableUnitZone> {
    try {
      const response = await axios.put<ScalableUnitZone>(`${API_URL}/scalableUnitZone/${id}`, scalableUnitZone);
      return response.data;
    } catch (error) {
      console.error(`Error updating scalableUnitZone with id ${id}:`, error);
      throw error;
    }
  },

  async deleteScalableUnitZone(id: number): Promise<void> {
    try {
      await axios.delete(`${API_URL}/scalableUnitZone/${id}`);
    } catch (error) {
      console.error(`Error deleting scalableUnitZone with id ${id}:`, error);
      throw error;
    }
  },
};
