import axios from "axios";
import { FiberTransceiverType } from "src/types/models";

const API_URL = process.env.QUASAR_APP_API_URL;

export const fiberTransceiverTypeService = {
  async getAllFiberTransceiverTypes(): Promise<FiberTransceiverType[]> {
    try {
      const response = await axios.get<FiberTransceiverType[]>(`${API_URL}/fiberTransceiverType`);
      return response.data;
    } catch (error) {
      console.error("Error fetching fiberTransceiverTypes:", error);
      throw error;
    }
  },

  async getFiberTransceiverTypesByCustomerAndDataHallId(
    customerId: number,
    dataHallId: number
  ): Promise<FiberTransceiverType[]> {
    try {
      const response = await axios.get<FiberTransceiverType[]>(
        `${API_URL}/customers/${customerId}/dataHalls/${dataHallId}/fiberTransceiverType`
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching fiberTransceiverTypes for customer ${customerId} and dataHall ${dataHallId}:`,
        error
      );
      throw error;
    }
  },

  async getFiberTransceiverTypeById(id: number): Promise<FiberTransceiverType> {
    try {
      const response = await axios.get<FiberTransceiverType>(`${API_URL}/fiberTransceiverType/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching fiberTransceiverType with id ${id}:`, error);
      throw error;
    }
  },

  async createFiberTransceiverType(fiberTransceiverType: Omit<FiberTransceiverType, "id">): Promise<FiberTransceiverType> {
    try {
      const response = await axios.post<FiberTransceiverType>(`${API_URL}/fiberTransceiverType`, fiberTransceiverType);
      return response.data;
    } catch (error) {
      console.error("Error creating fiberTransceiverType:", error);
      throw error;
    }
  },

  async updateFiberTransceiverType(id: number, fiberTransceiverType: Partial<FiberTransceiverType>): Promise<FiberTransceiverType> {
    try {
      const response = await axios.put<FiberTransceiverType>(`${API_URL}/fiberTransceiverType/${id}`, fiberTransceiverType);
      return response.data;
    } catch (error) {
      console.error(`Error updating fiberTransceiverType with id ${id}:`, error);
      throw error;
    }
  },

  async deleteFiberTransceiverType(id: number): Promise<void> {
    try {
      await axios.delete(`${API_URL}/fiberTransceiverType/${id}`);
    } catch (error) {
      console.error(`Error deleting fiberTransceiverType with id ${id}:`, error);
      throw error;
    }
  },
};
