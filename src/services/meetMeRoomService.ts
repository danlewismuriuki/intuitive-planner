import axios from "axios";

import { MeetMeRoom } from "src/types/models";

const API_URL = process.env.QUASAR_APP_API_URL;

export const meetMeRoomService = {
  async getAllRooms(): Promise<MeetMeRoom[]> {
    const response = await axios.get<MeetMeRoom[]>(`${API_URL}/meetMeRoom`);
    return response.data;
  },

  async getRoomsByCustomerId(customerId: number): Promise<MeetMeRoom[]> {
    const response = await axios.get<MeetMeRoom[]>(
      `${API_URL}/customers/${customerId}/meetMeRoom`
    );
    return response.data;
  },

  async getRoomById(id: number): Promise<MeetMeRoom> {
    const response = await axios.get<MeetMeRoom>(`${API_URL}/meetMeRoom/${id}`);
    return response.data;
  },

  async createRoom(room: Omit<MeetMeRoom, "id">): Promise<MeetMeRoom> {
    const response = await axios.post<MeetMeRoom>(
      `${API_URL}/meetMeRoom`,
      room
    );
    return response.data;
  },

  async updateRoom(id: number, room: Partial<MeetMeRoom>): Promise<MeetMeRoom> {
    const response = await axios.put<MeetMeRoom>(
      `${API_URL}/meetMeRoom/${id}`,
      room
    );
    return response.data;
  },

  async deleteRoom(id: number): Promise<void> {
    await axios.delete(`${API_URL}/meetMeRoom/${id}`);
  },
};
