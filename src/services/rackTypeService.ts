import axios from "axios";
import { RackType } from "../types/models";

const apiClient = axios.create({
  baseURL: process.env.QUASAR_APP_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const rackTypeService = {
  async getAllRackTypes(): Promise<RackType[]> {
    const response = await apiClient.get("/rackType");
    return response.data;
  },

  async getRackTypeById(id: number): Promise<RackType> {
    const response = await apiClient.get(`/rackType/${id}`);
    return response.data;
  },

  async createRackType(data: { name: string }): Promise<RackType> {
    const response = await apiClient.post("/rackType", data);
    return response.data;
  },

  async updateRackType(id: number, data: { name: string }): Promise<RackType> {
    const response = await apiClient.put(`/rackType/${id}`, data);
    return response.data;
  },

  async deleteRackType(id: number): Promise<void> {
    await apiClient.delete(`/rackType/${id}`);
  },
};
