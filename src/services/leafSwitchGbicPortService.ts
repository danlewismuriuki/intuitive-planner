import axios from "axios";
import { LeafSwitchGbicPort } from "src/types/models";

const API_URL = process.env.QUASAR_APP_API_URL;

export const leafSwitchGbicPortService = {
  async getAllLeafSwitchGbicPorts(): Promise<LeafSwitchGbicPort[]> {
    try {
      const response = await axios.get<LeafSwitchGbicPort[]>(`${API_URL}/leafSwitchGbicPort`);
      return response.data;
    } catch (error) {
      console.error("Error fetching leafSwitchGbicPorts:", error);
      throw error;
    }
  },

  async getLeafSwitchGbicPortsByCustomerAndDataHallId(
    customerId: number,
    dataHallId: number
  ): Promise<LeafSwitchGbicPort[]> {
    try {
      const response = await axios.get<LeafSwitchGbicPort[]>(
        `${API_URL}/customers/${customerId}/dataHalls/${dataHallId}/leafSwitchGbicPort`
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching leafSwitchGbicPorts for customer ${customerId} and dataHall ${dataHallId}:`,
        error
      );
      throw error;
    }
  },

  async getLeafSwitchGbicPortById(id: number): Promise<LeafSwitchGbicPort> {
    try {
      const response = await axios.get<LeafSwitchGbicPort>(`${API_URL}/leafSwitchGbicPort/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching leafSwitchGbicPort with id ${id}:`, error);
      throw error;
    }
  },

  async createLeafSwitchGbicPort(leafSwitchGbicPort: Omit<LeafSwitchGbicPort, "id">): Promise<LeafSwitchGbicPort> {
    try {
      console.log('Sending data to create LeafSwitchGbicPort:', leafSwitchGbicPort);
      const response = await axios.post<LeafSwitchGbicPort>(`${API_URL}/leafSwitchGbicPort`, leafSwitchGbicPort);
      console.log('Response from creating LeafSwitchGbicPort:', response.data);
      return response.data;
    } catch (error) {
      console.error("Error creating leafSwitchGbicPort:", error);
      throw error;
    }
  },

  async updateLeafSwitchGbicPort(id: number, leafSwitchGbicPort: Partial<LeafSwitchGbicPort>): Promise<LeafSwitchGbicPort> {
    try {
      const response = await axios.put<LeafSwitchGbicPort>(`${API_URL}/leafSwitchGbicPort/${id}`, leafSwitchGbicPort);
      console.log("Response from API:", response);
      return response.data;
    } catch (error) {
      console.error(`Error updating leafSwitchGbicPort with id ${id}:`, error);
      throw error;
    }
  },




  async deleteLeafSwitchGbicPort(id: number): Promise<void> {
    try {
      await axios.delete(`${API_URL}/leafSwitchGbicPort/${id}`);
    } catch (error) {
      console.error(`Error deleting leafSwitchGbicPort with id ${id}:`, error);
      throw error;
    }
  },
};
