import axios from "axios";
import { ConnectivityPath } from "src/types/models";

const API_URL = process.env.QUASAR_APP_API_URL;

export const connectivityPathService = {
  async getAllConnectivityPaths(): Promise<ConnectivityPath[]> {
    try {
      const response = await axios.get<ConnectivityPath[]>(`${API_URL}/connectivityPath`);
      return response.data;
    } catch (error) {
      console.error("Error fetching connectivityPaths:", error);
      throw error;
    }
  },

  async getConnectivityPathsByCustomerAndDataHallId(
    customerId: number,
    dataHallId: number
  ): Promise<ConnectivityPath[]> {
    try {
      const response = await axios.get<ConnectivityPath[]>(
        `${API_URL}/customers/${customerId}/dataHalls/${dataHallId}/connectivityPath`
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching connectivityPaths for customer ${customerId} and dataHall ${dataHallId}:`,
        error
      );
      throw error;
    }
  },

  async getConnectivityPathById(id: number): Promise<ConnectivityPath> {
    try {
      const response = await axios.get<ConnectivityPath>(`${API_URL}/connectivityPath/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching connectivityPath with id ${id}:`, error);
      throw error;
    }
  },

  async createConnectivityPath(connectivityPath: Omit<ConnectivityPath, "id">): Promise<ConnectivityPath> {
    try {
      const response = await axios.post<ConnectivityPath>(`${API_URL}/connectivityPath`, connectivityPath);
      return response.data;
    } catch (error) {
      console.error("Error creating connectivityPath:", error);
      throw error;
    }
  },

  async updateConnectivityPath(id: number, connectivityPath: Partial<ConnectivityPath>): Promise<ConnectivityPath> {
    try {
      const response = await axios.put<ConnectivityPath>(`${API_URL}/connectivityPath/${id}`, connectivityPath);
      return response.data;
    } catch (error) {
      console.error(`Error updating connectivityPath with id ${id}:`, error);
      throw error;
    }
  },

  async deleteConnectivityPath(id: number): Promise<void> {
    try {
      await axios.delete(`${API_URL}/connectivityPath/${id}`);
    } catch (error) {
      console.error(`Error deleting connectivityPath with id ${id}:`, error);
      throw error;
    }
  },
};
