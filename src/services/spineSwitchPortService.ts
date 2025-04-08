import axios from "axios";
import { SpineSwitchPort } from "src/types/models";

const API_URL = process.env.QUASAR_APP_API_URL;

export const spineSwitchPortService = {
  async getAllSpineSwitchPorts(): Promise<SpineSwitchPort[]> {
    try {
      const response = await axios.get<SpineSwitchPort[]>(`${API_URL}/spineSwitchPort`);
      return response.data;
    } catch (error) {
      console.error("Error fetching spineSwitchPorts:", error);
      throw error;
    }
  },

  async getSpineSwitchPortsByCustomerAndDataHallId(
    customerId: number,
    dataHallId: number
  ): Promise<SpineSwitchPort[]> {
    try {
      const response = await axios.get<SpineSwitchPort[]>(
        `${API_URL}/customers/${customerId}/dataHalls/${dataHallId}/spineSwitchPort`
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching spineSwitchPorts for customer ${customerId} and dataHall ${dataHallId}:`,
        error
      );
      throw error;
    }
  },

  async getSpineSwitchPortById(id: number): Promise<SpineSwitchPort> {
    try {
      const response = await axios.get<SpineSwitchPort>(`${API_URL}/spineSwitchPort/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching spineSwitchPort with id ${id}:`, error);
      throw error;
    }
  },

  async createSpineSwitchPort(spineSwitchPort: Omit<SpineSwitchPort, "id">): Promise<SpineSwitchPort> {
    try {
      const response = await axios.post<SpineSwitchPort>(`${API_URL}/spineSwitchPort`, spineSwitchPort);
      return response.data;
    } catch (error) {
      console.error("Error creating spineSwitchPort:", error);
      throw error;
    }
  },

  async updateSpineSwitchPort(id: number, spineSwitchPort: Partial<SpineSwitchPort>): Promise<SpineSwitchPort> {
    try {
      const response = await axios.put<SpineSwitchPort>(`${API_URL}/spineSwitchPort/${id}`, spineSwitchPort);
      return response.data;
    } catch (error) {
      console.error(`Error updating spineSwitchPort with id ${id}:`, error);
      throw error;
    }
  },

  async deleteSpineSwitchPort(id: number): Promise<void> {
    try {
      await axios.delete(`${API_URL}/spineSwitchPort/${id}`);
    } catch (error) {
      console.error(`Error deleting spineSwitchPort with id ${id}:`, error);
      throw error;
    }
  },
};
