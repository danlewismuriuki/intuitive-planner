import axios from "axios";
import { RackUnit } from "src/types/models";

const API_URL = process.env.QUASAR_APP_API_URL;

export const rackUnitService = {
  async getAllRackUnits(): Promise<RackUnit[]> {
    try {
      const response = await axios.get<RackUnit[]>(`${API_URL}/rackUnit`);
      return response.data;
    } catch (error) {
      console.error("Error fetching rackUnits:", error);
      throw error;
    }
  },

  async getRackUnitsByCustomerAndDataHallId(
    customerId: number,
    dataHallId: number
  ): Promise<RackUnit[]> {
    try {
      const response = await axios.get<RackUnit[]>(
        `${API_URL}/customers/${customerId}/dataHalls/${dataHallId}/rackUnit`
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching rackUnits for customer ${customerId} and dataHall ${dataHallId}:`,
        error
      );
      throw error;
    }
  },

  async getRackUnitById(id: number): Promise<RackUnit> {
    try {
      const response = await axios.get<RackUnit>(`${API_URL}/rackUnit/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching rackUnitwith id ${id}:`, error);
      throw error;
    }
  },

  async createRackUnit(rackUnit: Omit<RackUnit, "id">): Promise<RackUnit> {
    try {
      const response = await axios.post<RackUnit>(`${API_URL}/rackUnit`, rackUnit);
      return response.data;
    } catch (error) {
      console.error("Error creating rackUnit:", error);
      throw error;
    }
  },

  async updateRackUnit(id: number, rackUnit: Partial<RackUnit>): Promise<RackUnit> {
    try {
      const response = await axios.put<RackUnit>(`${API_URL}/rackUnit/${id}`, rackUnit);
      return response.data;
    } catch (error) {
      console.error(`Error updating rackUnitwith id ${id}:`, error);
      throw error;
    }
  },

  async deleteRackUnit(id: number): Promise<void> {
    try {
      await axios.delete(`${API_URL}/rackUnit/${id}`);
    } catch (error) {
      console.error(`Error deleting rackUnitwith id ${id}:`, error);
      throw error;
    }
  },
};