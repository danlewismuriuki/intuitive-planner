import axios from "axios";
import { ZoneType } from "../types/models";

const apiClient = axios.create({
  baseURL: process.env.QUASAR_APP_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const zoneTypeService = {
  async getAllZoneTypes(): Promise<ZoneType[]> {
    const response = await apiClient.get("/zoneType");
    return response.data;
  },

  async getZoneTypeById(id: number): Promise<ZoneType> {
    const response = await apiClient.get(`/zoneType/${id}`);
    return response.data;
  },

  async createZoneType(data: Partial<ZoneType>): Promise<ZoneType> {
    const response = await apiClient.post("/zoneType", data);
    return response.data;
  },

  async updateZoneType(id: number, data: Partial<ZoneType>): Promise<ZoneType> {
    const response = await apiClient.put(`/zoneType/${id}`, data);
    return response.data;
  },

  async deleteZoneType(id: number): Promise<void> {
    await apiClient.delete(`/zoneType/${id}`);
  },
};
