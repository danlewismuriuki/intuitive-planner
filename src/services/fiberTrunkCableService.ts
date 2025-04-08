import axios from "axios";
import { FiberTrunkCable, FiberTrunkCableLeg } from "src/types/models";

const API_URL = process.env.QUASAR_APP_API_URL;

export const fiberTrunkCableService = {
  async getAllFiberTrunkCables(): Promise<FiberTrunkCable[]> {
    try {
      const response = await axios.get<FiberTrunkCable[]>(`${API_URL}/fiberTrunkCable`);
      return response.data;
    } catch (error) {
      console.error("Error fetching fiberTrunkCables:", error);
      throw error;
    }
  },

  async getFiberTrunkCablesByCustomerAndDataHallId(
    customerId: number,
    dataHallId: number
  ): Promise<FiberTrunkCable[]> {
    try {
      const response = await axios.get<FiberTrunkCable[]>(
        `${API_URL}/customers/${customerId}/dataHalls/${dataHallId}/fiberTrunkCable`
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching fiberTrunkCables for customer ${customerId} and dataHall ${dataHallId}:`,
        error
      );
      throw error;
    }
  },

  async getFiberTrunkCableById(id: number): Promise<FiberTrunkCable> {
    try {
      const response = await axios.get<FiberTrunkCable>(`${API_URL}/fiberTrunkCable/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching fiberTrunkCable with id ${id}:`, error);
      throw error;
    }
  },

  async createFiberTrunkCable(fiberTrunkCable: Omit<FiberTrunkCable, "id">): Promise<FiberTrunkCable> {
    try {
      const response = await axios.post<FiberTrunkCable>(`${API_URL}/fiberTrunkCable`, fiberTrunkCable);
      return response.data;
    } catch (error) {
      console.error("Error creating fiberTrunkCable:", error);
      throw error;
    }
  },

  async updateFiberTrunkCable(id: number, fiberTrunkCable: Partial<FiberTrunkCable>): Promise<FiberTrunkCable> {
    try {
      const response = await axios.put<FiberTrunkCable>(`${API_URL}/fiberTrunkCable/${id}`, fiberTrunkCable);
      return response.data;
    } catch (error) {
      console.error(`Error updating fiberTrunkCable with id ${id}:`, error);
      throw error;
    }
  },

  async deleteFiberTrunkCable(id: number): Promise<void> {
    try {
      await axios.delete(`${API_URL}/fiberTrunkCable/${id}`);
    } catch (error) {
      console.error(`Error deleting fiberTrunkCable with id ${id}:`, error);
      throw error;
    }
  },

  async getFiberTrunkCableLegs(customerId: number, dataHallId: number): Promise<FiberTrunkCableLeg[]> {
    try {
      const response = await axios.get<FiberTrunkCableLeg[]>(
        `${API_URL}/customers/${customerId}/dataHalls/${dataHallId}/fiberTrunkCableType`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching fiberTrunkCable types:", error);
      throw error;
    }
  }
};

