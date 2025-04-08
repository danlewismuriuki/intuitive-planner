import axios from "axios";
import { LeafSwitchRack } from "src/types/models";

const API_URL = process.env.QUASAR_APP_API_URL;

export const leafSwitchRackService = {
  async getAllLeafSwitchRacks(): Promise<LeafSwitchRack[]> {
    try {
      const response = await axios.get<LeafSwitchRack[]>(`${API_URL}/leafSwitchRack`);
      return response.data;
    } catch (error) {
      console.error("Error fetching leafSwitchRacks:", error);
      throw error;
    }
  },

  async getLeafSwitchRacksByCustomerAndDataHallId(
    customerId: number,
    dataHallId: number
  ): Promise<LeafSwitchRack[]> {
    try {
      const response = await axios.get<LeafSwitchRack[]>(
        `${API_URL}/customers/${customerId}/dataHalls/${dataHallId}/leafSwitchRack`
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching leafSwitchRacks for customer ${customerId} and dataHall ${dataHallId}:`,
        error
      );
      throw error;
    }
  },

  async getLeafSwitchRackById(id: number): Promise<LeafSwitchRack> {
    try {
      const response = await axios.get<LeafSwitchRack>(`${API_URL}/leafSwitchRack/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching leafSwitchRack with id ${id}:`, error);
      throw error;
    }
  },

  async createLeafSwitchRack(leafSwitchRack: Omit<LeafSwitchRack, "id">): Promise<LeafSwitchRack> {
    try {
      const response = await axios.post<LeafSwitchRack>(`${API_URL}/leafSwitchRack`, leafSwitchRack);
      return response.data;
    } catch (error) {
      console.error("Error creating leafSwitchRack:", error);
      throw error;
    }
  },

  async updateLeafSwitchRack(id: number, leafSwitchRack: Partial<LeafSwitchRack>): Promise<LeafSwitchRack> {
    try {
      const response = await axios.put<LeafSwitchRack>(`${API_URL}/leafSwitchRack/${id}`, leafSwitchRack);
      return response.data;
    } catch (error) {
      console.error(`Error updating leafSwitchRack with id ${id}:`, error);
      throw error;
    }
  },

  async deleteLeafSwitchRack(id: number): Promise<void> {
    try {
      await axios.delete(`${API_URL}/leafSwitchRack/${id}`);
    } catch (error) {
      console.error(`Error deleting leafSwitchRack with id ${id}:`, error);
      throw error;
    }
  },

  async getChildlarges(customerId: number, dataHallId: number): Promise<Childlarge[]> {
    try {
      const response = await axios.get<Childlarge[]>(
        `${API_URL}/customers/${customerId}/dataHalls/${dataHallId}/leafSwitchRackType`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching leafSwitchRack types:", error);
      throw error;
    }
  }
};
