import api from "./axiosInstance";
import type { UserResponse, CreateUserPayload, UpdateUserPayload } from "@/types/user";

export const userApi = {
  getAllUsers: async (): Promise<UserResponse[]> => {
    const res = await api.get<UserResponse[]>("/api/users");
    return res.data;
  },

  getUserById: async (id: string): Promise<UserResponse> => {
    const res = await api.get<UserResponse>(`/api/users/${id}`);
    return res.data;
  },

  createUser: async (payload: CreateUserPayload): Promise<UserResponse> => {
    const res = await api.post<UserResponse>("/api/users", payload);
    return res.data;
  },

  updateUser: async (id: string, payload: UpdateUserPayload): Promise<UserResponse> => {
    const res = await api.put<UserResponse>(`/api/users/${id}`, payload);
    return res.data;
  },

  activateUser: async (id: string): Promise<UserResponse> => {
    const res = await api.put<UserResponse>(`/api/users/${id}/activate`);
    return res.data;
  },

  deleteUser: async (id: string): Promise<void> => {
    await api.delete(`/api/users/${id}`);
  },

  uploadProfilePhoto: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await api.post<{ url: string }>("/api/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data.url;
  },

  updateProfilePhoto: async (id: string, profilePhotoUrl: string): Promise<UserResponse> => {
    const res = await api.put<UserResponse>(`/api/users/${id}/profile-photo`, null, {
      params: { profilePhotoUrl },
    });
    return res.data;
  },
};
