import axios from "axios";
import { ScalableUnitGpuLeafSwitchRack } from "src/types/models";

const API_URL = process.env.QUASAR_APP_API_URL;

export const scalableUnitGpuLeafSwitchRackService = {
  async getAllScalableUnitGpuLeafSwitchRacks(): Promise<ScalableUnitGpuLeafSwitchRack[]> {
    try {
      const response = await axios.get<ScalableUnitGpuLeafSwitchRack[]>(`${API_URL}/scalableUnitGpuLeafSwitchRack`);
      return response.data;
    } catch (error) {
      console.error("Error fetching scalableUnitGpuLeafSwitchRacks:", error);
      throw error;
    }
  },

  async getScalableUnitGpuLeafSwitchRacksByCustomerAndDataHallId(
    customerId: number,
    dataHallId: number
  ): Promise<ScalableUnitGpuLeafSwitchRack[]> {
    try {
      const response = await axios.get<ScalableUnitGpuLeafSwitchRack[]>(
        `${API_URL}/customers/${customerId}/dataHalls/${dataHallId}/scalableUnitGpuLeafSwitchRack`
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching scalableUnitGpuLeafSwitchRacks for customer ${customerId} and dataHall ${dataHallId}:`,
        error
      );
      throw error;
    }
  },

  async getScalableUnitGpuLeafSwitchRackById(id: number): Promise<ScalableUnitGpuLeafSwitchRack> {
    try {
      const response = await axios.get<ScalableUnitGpuLeafSwitchRack>(`${API_URL}/scalableUnitGpuLeafSwitchRack/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching scalableUnitGpuLeafSwitchRack with id ${id}:`, error);
      throw error;
    }
  },

  async createScalableUnitGpuLeafSwitchRack(scalableUnitGpuLeafSwitchRack: Omit<ScalableUnitGpuLeafSwitchRack, "id">): Promise<ScalableUnitGpuLeafSwitchRack> {
    try {
      const response = await axios.post<ScalableUnitGpuLeafSwitchRack>(`${API_URL}/scalableUnitGpuLeafSwitchRack`, scalableUnitGpuLeafSwitchRack);
      return response.data;
    } catch (error) {
      console.error("Error creating scalableUnitGpuLeafSwitchRack:", error);
      throw error;
    }
  },

  async updateScalableUnitGpuLeafSwitchRack(id: number, scalableUnitGpuLeafSwitchRack: Partial<ScalableUnitGpuLeafSwitchRack>): Promise<ScalableUnitGpuLeafSwitchRack> {
    try {
      const response = await axios.put<ScalableUnitGpuLeafSwitchRack>(`${API_URL}/scalableUnitGpuLeafSwitchRack/${id}`, scalableUnitGpuLeafSwitchRack);
      return response.data;
    } catch (error) {
      console.error(`Error updating scalableUnitGpuLeafSwitchRack with id ${id}:`, error);
      throw error;
    }
  },

  async deleteScalableUnitGpuLeafSwitchRack(id: number): Promise<void> {
    try {
      await axios.delete(`${API_URL}/scalableUnitGpuLeafSwitchRack/${id}`);
    } catch (error) {
      console.error(`Error deleting scalableUnitGpuLeafSwitchRack with id ${id}:`, error);
      throw error;
    }
  },
};
