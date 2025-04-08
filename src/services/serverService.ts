import axios from "axios";
import { Server, Gpu } from "src/types/models";

const API_URL = process.env.QUASAR_APP_API_URL;

export const serverService = {
  async getAllServers(): Promise<Server[]> {
    try {
      const response = await axios.get<Server[]>(`${API_URL}/server`);
      return response.data;
    } catch (error) {
      console.error("Error fetching servers:", error);
      throw error;
    }
  },

  async getServersByCustomerAndDataHallId(
    customerId: number,
    dataHallId: number
  ): Promise<Server[]> {
    try {
      const response = await axios.get<Server[]>(
        `${API_URL}/customers/${customerId}/dataHalls/${dataHallId}/server`
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching servers for customer ${customerId} and dataHall ${dataHallId}:`,
        error
      );
      throw error;
    }
  },

  async getServerById(id: number): Promise<Server> {
    try {
      const response = await axios.get<Server>(`${API_URL}/server/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching server with id ${id}:`, error);
      throw error;
    }
  },

  async createServer(server: Omit<Server, "id">): Promise<Server> {
    try {
      const response = await axios.post<Server>(`${API_URL}/server`, server);
      return response.data;
    } catch (error) {
      console.error("Error creating server:", error);
      throw error;
    }
  },

  async updateServer(id: number, server: Partial<Server>): Promise<Server> {
    try {
      const response = await axios.put<Server>(`${API_URL}/server/${id}`, server);
      return response.data;
    } catch (error) {
      console.error(`Error updating server with id ${id}:`, error);
      throw error;
    }
  },

  async deleteServer(id: number): Promise<void> {
    try {
      await axios.delete(`${API_URL}/server/${id}`);
    } catch (error) {
      console.error(`Error deleting server with id ${id}:`, error);
      throw error;
    }
  },

  async getGpus(customerId: number, dataHallId: number): Promise<Gpu[]> {
    try {
      const response = await axios.get<Gpu[]>(
        `${API_URL}/customers/${customerId}/dataHalls/${dataHallId}/serverType`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching server types:", error);
      throw error;
    }
  }
};
