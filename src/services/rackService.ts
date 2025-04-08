//Two children Two funcs at the bottom

import axios from "axios";
import { Rack, GpuComputeRack, CpuComputeRack } from "src/types/models";

const API_URL = process.env.QUASAR_APP_API_URL;

export const rackService = {
  async getAllRacks(): Promise<Rack[]> {
    try {
      const response = await axios.get<Rack[]>(`${API_URL}/rack`);
      return response.data;
    } catch (error) {
      console.error("Error fetching racks:", error);
      throw error;
    }
  },

  async getRacksByCustomerAndDataHallId(
    customerId: number,
    dataHallId: number
  ): Promise<Rack[]> {
    try {
      const response = await axios.get<Rack[]>(
        `${API_URL}/customers/${customerId}/dataHalls/${dataHallId}/rack`
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching racks for customer ${customerId} and dataHall ${dataHallId}:`,
        error
      );
      throw error;
    }
  },

  async getRackById(id: number): Promise<Rack> {
    try {
      const response = await axios.get<Rack>(`${API_URL}/rack/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching rackwith id ${id}:`, error);
      throw error;
    }
  },

  async createRack(rack: Omit<Rack, "id">): Promise<Rack> {
    try {
      const response = await axios.post<Rack>(`${API_URL}/rack`, rack);
      return response.data;
    } catch (error) {
      console.error("Error creating rack:", error);
      throw error;
    }
  },

  async updateRack(id: number, rack: Partial<Rack>): Promise<Rack> {
    try {
      const response = await axios.put<Rack>(`${API_URL}/rack/${id}`, rack);
      return response.data;
    } catch (error) {
      console.error(`Error updating rackwith id ${id}:`, error);
      throw error;
    }
  },

  async deleteRack(id: number): Promise<void> {
    try {
      await axios.delete(`${API_URL}/rack/${id}`);
    } catch (error) {
      console.error(`Error deleting rackwith id ${id}:`, error);
      throw error;
    }
  },

  async getGpuComputeRacks(customerId: number, dataHallId: number): Promise<GpuComputeRack[]> {
    try {
      const response = await axios.get<GpuComputeRack[]>(
        `${API_URL}/customers/${customerId}/dataHalls/${dataHallId}/rackType`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching racktypes:", error);
      throw error;
    }
  },

  async getCpuComputeRacks(customerId: number, dataHallId: number): Promise<CpuComputeRack[]> {
    try {
      const response = await axios.get<CpuComputeRack[]>(
        `${API_URL}/customers/${customerId}/dataHalls/${dataHallId}/rackType`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching racktypes:", error);
      throw error;
    }
  }
};