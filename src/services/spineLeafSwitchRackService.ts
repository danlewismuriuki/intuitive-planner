import axios from "axios";
import { SpineLeafSwitchRack } from "src/types/models";

const API_URL = process.env.QUASAR_APP_API_URL;

export const spineLeafSwitchRackService = {
  async getAllSpineLeafSwitchRacks(): Promise<SpineLeafSwitchRack[]> {
    try {
      const response = await axios.get<SpineLeafSwitchRack[]>(`${API_URL}/spineLeafSwitchRack`);
      return response.data;
    } catch (error) {
      console.error("Error fetching spineLeafSwitchRacks:", error);
      throw error;
    }
  },

  async getSpineLeafSwitchRacksByCustomerAndDataHallId(
    customerId: number,
    dataHallId: number
  ): Promise<SpineLeafSwitchRack[]> {
    try {
      const response = await axios.get<SpineLeafSwitchRack[]>(
        `${API_URL}/customers/${customerId}/dataHalls/${dataHallId}/spineLeafSwitchRack`
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching spineLeafSwitchRacks for customer ${customerId} and dataHall ${dataHallId}:`,
        error
      );
      throw error;
    }
  },

  async getSpineLeafSwitchRackById(id: number): Promise<SpineLeafSwitchRack> {
    try {
      const response = await axios.get<SpineLeafSwitchRack>(`${API_URL}/spineLeafSwitchRack/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching spineLeafSwitchRack with id ${id}:`, error);
      throw error;
    }
  },

  async createSpineLeafSwitchRack(spineLeafSwitchRack: Omit<SpineLeafSwitchRack, "id">): Promise<SpineLeafSwitchRack> {
    try {
      const response = await axios.post<SpineLeafSwitchRack>(`${API_URL}/spineLeafSwitchRack`, spineLeafSwitchRack);
      return response.data;
    } catch (error) {
      console.error("Error creating spineLeafSwitchRack:", error);
      throw error;
    }
  },

  async updateSpineLeafSwitchRack(id: number, spineLeafSwitchRack: Partial<SpineLeafSwitchRack>): Promise<SpineLeafSwitchRack> {
    try {
      const response = await axios.put<SpineLeafSwitchRack>(`${API_URL}/spineLeafSwitchRack/${id}`, spineLeafSwitchRack);
      return response.data;
    } catch (error) {
      console.error(`Error updating spineLeafSwitchRack with id ${id}:`, error);
      throw error;
    }
  },

  async deleteSpineLeafSwitchRack(id: number): Promise<void> {
    try {
      await axios.delete(`${API_URL}/spineLeafSwitchRack/${id}`);
    } catch (error) {
      console.error(`Error deleting spineLeafSwitchRack with id ${id}:`, error);
      throw error;
    }
  },
};
