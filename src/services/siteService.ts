import axios from "axios";
import { Site } from "src/types/models";

const API_URL = process.env.QUASAR_APP_API_URL;

export const siteService = {
  async getAllSites(): Promise<Site[]> {
    try {
      const response = await axios.get<Site[]>(`${API_URL}/site`);
      return response.data;
    } catch (error) {
      console.error("Error fetching sites:", error);
      throw error;
    }
  },

  async getSitesByCustomerId(customerId: number): Promise<Site[]> {
    try {
      const response = await axios.get<Site[]>(
        `${API_URL}/customers/${customerId}/site`
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching sites for customer ${customerId}:`, error);
      throw error;
    }
  },

  async getSiteById(id: number): Promise<Site> {
    try {
      const response = await axios.get<Site>(`${API_URL}/site/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching site with id ${id}:`, error);
      throw error;
    }
  },

  async createSite(site: Omit<Site, "id">): Promise<Site> {
    try {
      const response = await axios.post<Site>(`${API_URL}/site`, site);
      return response.data;
    } catch (error) {
      console.error("Error creating site:", error);
      throw error;
    }
  },

  async updateSite(id: number, site: Partial<Site>): Promise<Site> {
    try {
      const response = await axios.put<Site>(`${API_URL}/site/${id}`, site);
      return response.data;
    } catch (error) {
      console.error(`Error updating site with id ${id}:`, error);
      throw error;
    }
  },

  async deleteSite(id: number): Promise<void> {
    try {
      await axios.delete(`${API_URL}/site/${id}`);
    } catch (error) {
      console.error(`Error deleting site with id ${id}:`, error);
      throw error;
    }
  },
};
