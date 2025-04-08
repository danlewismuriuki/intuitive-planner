import axios from "axios";
import { Containment } from "src/types/models";

const API_URL = process.env.QUASAR_APP_API_URL;

export const containmentService = {
  async getAllContainments(): Promise<Containment[]> {
    try {
      const response = await axios.get<Containment[]>(`${API_URL}/containment`);
      return response.data;
    } catch (error) {
      console.error("Error fetching containments:", error);
      throw error;
    }
  },

  async getContainmentsByCustomerAndDataHallId(
    customerId: number,
    dataHallId: number
  ): Promise<Containment[]> {
    try {
      const response = await axios.get<Containment[]>(
        `${API_URL}/customers/${customerId}/dataHalls/${dataHallId}/containment`
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching containments for customer ${customerId} and dataHall ${dataHallId}:`,
        error
      );
      throw error;
    }
  },

  async getContainmentById(id: number): Promise<Containment> {
    try {
      const response = await axios.get<Containment>(`${API_URL}/containment/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching containment with id ${id}:`, error);
      throw error;
    }
  },

  async createContainment(containment: Omit<Containment, "id">): Promise<Containment> {
    try {
      const response = await axios.post<Containment>(`${API_URL}/containment`, containment);
      return response.data;
    } catch (error) {
      console.error("Error creating containment:", error);
      throw error;
    }
  },

  async updateContainment(id: number, containment: Partial<Containment>): Promise<Containment> {
    try {
      const response = await axios.put<Containment>(`${API_URL}/containment/${id}`, containment);
      return response.data;
    } catch (error) {
      console.error(`Error updating containment with id ${id}:`, error);
      throw error;
    }
  },

  async deleteContainment(id: number): Promise<void> {
    try {
      await axios.delete(`${API_URL}/containment/${id}`);
    } catch (error) {
      console.error(`Error deleting containment with id ${id}:`, error);
      throw error;
    }
  },
};
