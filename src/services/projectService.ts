import axios from "axios";
import { Project } from "src/types/models";

const API_URL = process.env.QUASAR_APP_API_URL;

export const projectService = {
  async getAllProjects(): Promise<Project[]> {
    try {
      const response = await axios.get<Project[]>(`${API_URL}/project`);
      return response.data;
    } catch (error) {
      console.error("Error fetching projects:", error);
      throw error;
    }
  },

  async getProjectsByCustomerId(customerId: number): Promise<Project[]> {
    try {
      const response = await axios.get<Project[]>(
        `${API_URL}/customers/${customerId}/project`
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching projects for customer ${customerId}:`,
        error
      );
      throw error;
    }
  },

  async getProjectById(id: number): Promise<Project> {
    try {
      const response = await axios.get<Project>(`${API_URL}/project/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching project with id ${id}:`, error);
      throw error;
    }
  },

  async createProject(project: Omit<Project, "id">): Promise<Project> {
    try {
      const response = await axios.post<Project>(`${API_URL}/project`, project);
      return response.data;
    } catch (error) {
      console.error("Error creating project:", error);
      throw error;
    }
  },

  async updateProject(id: number, project: Partial<Project>): Promise<Project> {
    try {
      const response = await axios.put<Project>(
        `${API_URL}/project/${id}`,
        project
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating project with id ${id}:`, error);
      throw error;
    }
  },

  async deleteProject(id: number): Promise<void> {
    try {
      await axios.delete(`${API_URL}/project/${id}`);
    } catch (error) {
      console.error(`Error deleting project with id ${id}:`, error);
      throw error;
    }
  },
};
