import api from "./axiosInstance";

export interface ProgramHibahResponse {
  id: string;
  adminId: string;
  namaProgram: string;
  deskripsi: string;
  bidangFokus: string;
  tanggalBuka: string;
  tanggalTutup: string;
  totalDanaMaksimal: number;
  createdAt: string;
}

export const hibahApi = {
  getAll: async (): Promise<ProgramHibahResponse[]> => {
    const res = await api.get<ProgramHibahResponse[]>("/api/hibah");
    return res.data;
  },

  getById: async (id: string): Promise<ProgramHibahResponse> => {
    const res = await api.get<ProgramHibahResponse>(`/api/hibah/${id}`);
    return res.data;
  },

  getOpen: async (): Promise<ProgramHibahResponse[]> => {
    const res = await api.get<ProgramHibahResponse[]>("/api/hibah/open");
    return res.data;
  },
};