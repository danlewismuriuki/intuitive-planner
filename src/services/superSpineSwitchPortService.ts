import axios from "axios";
import { SuperSpineSwitchPort } from "src/types/models";

const API_URL = process.env.QUASAR_APP_API_URL;

export const superSpineSwitchPortService = {
  async getAllSuperSpineSwitchPorts(): Promise<SuperSpineSwitchPort[]> {
    try {
      const response = await axios.get<SuperSpineSwitchPort[]>(`${API_URL}/superSpineSwitchPort`);
      return response.data;
    } catch (error) {
      console.error("Error fetching superSpineSwitchPorts:", error);
      throw error;
    }
  },

  async getSuperSpineSwitchPortsByCustomerAndDataHallId(
    customerId: number,
    dataHallId: number
  ): Promise<SuperSpineSwitchPort[]> {
    try {
      const response = await axios.get<SuperSpineSwitchPort[]>(
        `${API_URL}/customers/${customerId}/dataHalls/${dataHallId}/superSpineSwitchPort`
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching superSpineSwitchPorts for customer ${customerId} and dataHall ${dataHallId}:`,
        error
      );
      throw error;
    }
  },

  async getSuperSpineSwitchPortById(id: number): Promise<SuperSpineSwitchPort> {
    try {
      const response = await axios.get<SuperSpineSwitchPort>(`${API_URL}/superSpineSwitchPort/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching superSpineSwitchPort with id ${id}:`, error);
      throw error;
    }
  },

  async createSuperSpineSwitchPort(superSpineSwitchPort: Omit<SuperSpineSwitchPort, "id">): Promise<SuperSpineSwitchPort> {
    try {
      const response = await axios.post<SuperSpineSwitchPort>(`${API_URL}/superSpineSwitchPort`, superSpineSwitchPort);
      return response.data;
    } catch (error) {
      console.error("Error creating superSpineSwitchPort:", error);
      throw error;
    }
  },

  async updateSuperSpineSwitchPort(id: number, superSpineSwitchPort: Partial<SuperSpineSwitchPort>): Promise<SuperSpineSwitchPort> {
    try {
      const response = await axios.put<SuperSpineSwitchPort>(`${API_URL}/superSpineSwitchPort/${id}`, superSpineSwitchPort);
      return response.data;
    } catch (error) {
      console.error(`Error updating superSpineSwitchPort with id ${id}:`, error);
      throw error;
    }
  },

  async deleteSuperSpineSwitchPort(id: number): Promise<void> {
    try {
      await axios.delete(`${API_URL}/superSpineSwitchPort/${id}`);
    } catch (error) {
      console.error(`Error deleting superSpineSwitchPort with id ${id}:`, error);
      throw error;
    }
  },
};
