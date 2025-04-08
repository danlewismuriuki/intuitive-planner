import axios from "axios";
import { OcpRack } from "src/types/models";

const API_URL = process.env.QUASAR_APP_API_URL;

export const ocpRackService = {
  async getAllOcpRacks(): Promise<OcpRack[]> {
    try {
      const response = await axios.get<OcpRack[]>(`${API_URL}/ocpRack`);
      return response.data;
    } catch (error) {
      console.error("Error fetching ocpRacks:", error);
      throw error;
    }
  },

  async getOcpRacksByCustomerAndDataHallId(
    customerId: number,
    dataHallId: number
  ): Promise<OcpRack[]> {
    try {
      const response = await axios.get<OcpRack[]>(
        `${API_URL}/customers/${customerId}/dataHalls/${dataHallId}/ocpRack`
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching ocpRacks for customer ${customerId} and dataHall ${dataHallId}:`,
        error
      );
      throw error;
    }
  },

  async getOcpRackById(id: number): Promise<OcpRack> {
    try {
      const response = await axios.get<OcpRack>(`${API_URL}/ocpRack/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching ocpRack with id ${id}:`, error);
      throw error;
    }
  },

  async createOcpRack(ocpRack: Omit<OcpRack, "id">): Promise<OcpRack> {
    try {
      const response = await axios.post<OcpRack>(`${API_URL}/ocpRack`, ocpRack);
      return response.data;
    } catch (error) {
      console.error("Error creating ocpRack:", error);
      throw error;
    }
  },

  async updateOcpRack(id: number, ocpRack: Partial<OcpRack>): Promise<OcpRack> {
    try {
      const response = await axios.put<OcpRack>(`${API_URL}/ocpRack/${id}`, ocpRack);
      return response.data;
    } catch (error) {
      console.error(`Error updating ocpRack with id ${id}:`, error);
      throw error;
    }
  },

  async deleteOcpRack(id: number): Promise<void> {
    try {
      await axios.delete(`${API_URL}/ocpRack/${id}`);
    } catch (error) {
      console.error(`Error deleting ocpRack with id ${id}:`, error);
      throw error;
    }
  },
};
