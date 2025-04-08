import axios from "axios";
import { SuperSpineSwitchRack } from "src/types/models";

const API_URL = process.env.QUASAR_APP_API_URL;

export const superSpineSwitchRackService = {
  async getAllSuperSpineSwitchRacks(): Promise<SuperSpineSwitchRack[]> {
    try {
      const response = await axios.get<SuperSpineSwitchRack[]>(`${API_URL}/superSpineSwitchRack`);
      return response.data;
    } catch (error) {
      console.error("Error fetching superSpineSwitchRacks:", error);
      throw error;
    }
  },

  async getSuperSpineSwitchRacksByCustomerAndDataHallId(
    customerId: number,
    dataHallId: number
  ): Promise<SuperSpineSwitchRack[]> {
    try {
      const response = await axios.get<SuperSpineSwitchRack[]>(
        `${API_URL}/customers/${customerId}/dataHalls/${dataHallId}/superSpineSwitchRack`
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching superSpineSwitchRacks for customer ${customerId} and dataHall ${dataHallId}:`,
        error
      );
      throw error;
    }
  },

  async getSuperSpineSwitchRackById(id: number): Promise<SuperSpineSwitchRack> {
    try {
      const response = await axios.get<SuperSpineSwitchRack>(`${API_URL}/superSpineSwitchRack/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching superSpineSwitchRack with id ${id}:`, error);
      throw error;
    }
  },

  async createSuperSpineSwitchRack(superSpineSwitchRack: Omit<SuperSpineSwitchRack, "id">): Promise<SuperSpineSwitchRack> {
    try {
      const response = await axios.post<SuperSpineSwitchRack>(`${API_URL}/superSpineSwitchRack`, superSpineSwitchRack);
      return response.data;
    } catch (error) {
      console.error("Error creating superSpineSwitchRack:", error);
      throw error;
    }
  },

  async updateSuperSpineSwitchRack(id: number, superSpineSwitchRack: Partial<SuperSpineSwitchRack>): Promise<SuperSpineSwitchRack> {
    try {
      const response = await axios.put<SuperSpineSwitchRack>(`${API_URL}/superSpineSwitchRack/${id}`, superSpineSwitchRack);
      return response.data;
    } catch (error) {
      console.error(`Error updating superSpineSwitchRack with id ${id}:`, error);
      throw error;
    }
  },

  async deleteSuperSpineSwitchRack(id: number): Promise<void> {
    try {
      await axios.delete(`${API_URL}/superSpineSwitchRack/${id}`);
    } catch (error) {
      console.error(`Error deleting superSpineSwitchRack with id ${id}:`, error);
      throw error;
    }
  },
};
