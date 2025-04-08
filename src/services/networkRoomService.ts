import axios from "axios";
import { NetworkRoom } from "src/types/models";

const API_URL = process.env.QUASAR_APP_API_URL;

export const networkRoomService = {
  async getAllRooms(): Promise<NetworkRoom[]> {
    try {
      const response = await axios.get<NetworkRoom[]>(
        `${API_URL}/networkRoom`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching network rooms:", error);
      throw error;
    }
  },

  async getRoomsByCustomerId(customerId: number): Promise<NetworkRoom[]> {
    try {
      const response = await axios.get<NetworkRoom[]>(
        `${API_URL}/customers/${customerId}/networkRoom`
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching network rooms for customer ${customerId}:`,
        error
      );
      throw error;
    }
  },

  async getRoomsByFloorId(floorId: number): Promise<NetworkRoom[]> {
    try {
      const response = await axios.get<NetworkRoom[]>(
        `${API_URL}/floors/${floorId}/networkRoom`
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching network rooms for floor ${floorId}:`,
        error
      );
      throw error;
    }
  },

  async getRoomById(id: number): Promise<NetworkRoom> {
    try {
      const response = await axios.get<NetworkRoom>(
        `${API_URL}/networkRoom/${id}`
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching network room with id ${id}:`, error);
      throw error;
    }
  },

  async createRoom(room: Omit<NetworkRoom, "id">): Promise<NetworkRoom> {
    try {
      const response = await axios.post<NetworkRoom>(
        `${API_URL}/networkRoom`,
        room
      );
      return response.data;
    } catch (error) {
      console.error("Error creating network room:", error);
      throw error;
    }
  },

  async updateRoom(
    id: number,
    room: Partial<NetworkRoom>
  ): Promise<NetworkRoom> {
    try {
      const response = await axios.put<NetworkRoom>(
        `${API_URL}/networkRoom/${id}`,
        room
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating network room with id ${id}:`, error);
      throw error;
    }
  },

  async deleteRoom(id: number): Promise<void> {
    try {
      await axios.delete(`${API_URL}/networkRoom/${id}`);
    } catch (error) {
      console.error(`Error deleting network room with id ${id}:`, error);
      throw error;
    }
  },
};
