import axios from "axios";
import { GpuFrontSide, GpuPort, NetworkTopology, NetworkType } from "src/types/models";

const API_URL = process.env.QUASAR_APP_API_URL;

export const gpufrontsideService = {
  async getAllGpuFrontSides(): Promise<GpuFrontSide[]> {
    try {
      const response = await axios.get<GpuFrontSide[]>(`${API_URL}/gpufrontside`);
      return response.data;
    } catch (error) {
      console.error("Error fetching gpufrontsides:", error);
      throw error;
    }
  },

  async getGpuFrontSidesByCustomerAndDataHallId(
    customerId: number,
    dataHallId: number
  ): Promise<GpuFrontSide[]> {
    try {
      const response = await axios.get<GpuFrontSide[]>(
        `${API_URL}/customers/${customerId}/dataHalls/${dataHallId}/gpufrontside`
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching gpufrontsides for customer ${customerId} and dataHall ${dataHallId}:`,
        error
      );
      throw error;
    }
  },

  async getGpuFrontSideById(id: number): Promise<GpuFrontSide> {
    try {
      const response = await axios.get<GpuFrontSide>(`${API_URL}/gpufrontside/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching gpufrontside with id ${id}:`, error);
      throw error;
    }
  },

  async createGpuFrontSide(gpufrontside: Omit<GpuFrontSide, "id">): Promise<GpuFrontSide> {
    try {
      const response = await axios.post<GpuFrontSide>(`${API_URL}/gpufrontside`, gpufrontside);
      return response.data;
    } catch (error) {
      console.error("Error creating gpufrontside:", error);
      throw error;
    }
  },

  async updateGpuFrontSide(id: number, gpufrontside: Partial<GpuFrontSide>): Promise<GpuFrontSide> {
    try {
      const response = await axios.put<GpuFrontSide>(`${API_URL}/gpufrontside/${id}`, gpufrontside);
      return response.data;
    } catch (error) {
      console.error(`Error updating gpufrontside with id ${id}:`, error);
      throw error;
    }
  },

  async deleteGpuFrontSide(id: number): Promise<void> {
    try {
      await axios.delete(`${API_URL}/gpufrontside/${id}`);
    } catch (error) {
      console.error(`Error deleting gpufrontside with id ${id}:`, error);
      throw error;
    }
  }
};
