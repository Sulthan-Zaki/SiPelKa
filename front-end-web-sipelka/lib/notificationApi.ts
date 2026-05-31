import api from "./axiosInstance";

export interface NotifikasiResponse {
  id: string;
  userId: string;
  judulNotifikasi: string;
  pesan: string;
  isRead: boolean;
  tipeNotifikasi: string;
  createdAt: string;
}

export const notificationApi = {
  getByUser: async (userId: string): Promise<NotifikasiResponse[]> => {
    const res = await api.get<NotifikasiResponse[]>(`/api/notifikasi/user/${userId}`);
    return res.data;
  },

  markAsRead: async (id: string): Promise<NotifikasiResponse> => {
    const res = await api.put<NotifikasiResponse>(`/api/notifikasi/${id}/read`);
    return res.data;
  },
};