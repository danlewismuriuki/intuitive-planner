import axios from "axios";
import { Building } from "src/types/models";

const API_URL = process.env.QUASAR_APP_API_URL;

export const buildingService = {
  async getAllBuildings(): Promise<Building[]> {
    try {
      const response = await axios.get<Building[]>(`${API_URL}/building`);
      return response.data;
    } catch (error) {
      console.error("Error fetching buildings:", error);
      throw error;
    }
  },

  async getBuildingsByCustomerId(customerId: number): Promise<Building[]> {
    try {
      const response = await axios.get<Building[]>(
        `${API_URL}/customers/${customerId}/building`
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching buildings for customer ${customerId}:`,
        error
      );
      throw error;
    }
  },

  async getBuildingById(id: number): Promise<Building> {
    try {
      const response = await axios.get<Building>(`${API_URL}/building/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching building with id ${id}:`, error);
      throw error;
    }
  },

  async createBuilding(building: Omit<Building, "id">): Promise<Building> {
    try {
      const response = await axios.post<Building>(
        `${API_URL}/building`,
        building
      );
      return response.data;
    } catch (error) {
      console.error("Error creating building:", error);
      throw error;
    }
  },

  async updateBuilding(
    id: number,
    building: Partial<Building>
  ): Promise<Building> {
    try {
      const response = await axios.put<Building>(
        `${API_URL}/building/${id}`,
        building
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating building with id ${id}:`, error);
      throw error;
    }
  },

  async deleteBuilding(id: number): Promise<void> {
    try {
      await axios.delete(`${API_URL}/building/${id}`);
    } catch (error) {
      console.error(`Error deleting building with id ${id}:`, error);
      throw error;
    }
  },
};
