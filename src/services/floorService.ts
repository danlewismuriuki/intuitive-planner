import axios from "axios";
import { Building } from "./buildingService";
import { Customer } from "./customerService";

export interface Floor {
  id: number;
  name: string;
  buildingId: number;
  building: Building;
  customerId: number;
  customer: Customer;
  lengthMeters?: number;
  widthMeters?: number;
}

const API_URL = process.env.QUASAR_APP_API_URL;

export const floorService = {
  async getAllFloors(): Promise<Floor[]> {
    try {
      const response = await axios.get<Floor[]>(`${API_URL}/floor`);
      return response.data;
    } catch (error) {
      console.error("Error fetching floors:", error);
      throw error;
    }
  },

  async getFloorsByCustomerId(customerId: number): Promise<Floor[]> {
    try {
      const response = await axios.get<Floor[]>(
        `${API_URL}/customers/${customerId}/floor`
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching floors for customer ${customerId}:`, error);
      throw error;
    }
  },

  async getFloorById(id: number): Promise<Floor> {
    try {
      const response = await axios.get<Floor>(`${API_URL}/floor/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching floor with id ${id}:`, error);
      throw error;
    }
  },

  async createFloor(floor: Omit<Floor, "id">): Promise<Floor> {
    try {
      const response = await axios.post<Floor>(`${API_URL}/floor`, floor);
      return response.data;
    } catch (error) {
      console.error("Error creating floor:", error);
      throw error;
    }
  },

  async updateFloor(id: number, floor: Partial<Floor>): Promise<Floor> {
    try {
      const response = await axios.put<Floor>(`${API_URL}/floor/${id}`, {
        ...floor,
        lengthMeters: floor.lengthMeters
          ? parseFloat(floor.lengthMeters.toString())
          : undefined,
        widthMeters: floor.widthMeters
          ? parseFloat(floor.widthMeters.toString())
          : undefined,
      });
      return response.data;
    } catch (error) {
      console.error(`Error updating floor with id ${id}:`, error);
      throw error;
    }
  },

  async deleteFloor(id: number): Promise<void> {
    try {
      await axios.delete(`${API_URL}/floor/${id}`);
    } catch (error) {
      console.error(`Error deleting floor with id ${id}:`, error);
      throw error;
    }
  },
};
