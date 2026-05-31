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

export interface CreateProgramHibahPayload {
  adminId: string;
  namaProgram: string;
  deskripsi: string;
  bidangFokus: string;
  tanggalBuka: string;
  tanggalTutup: string;
  totalDanaMaksimal: number;
}

export type UpdateProgramHibahPayload = Partial<CreateProgramHibahPayload>;

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

  createProgram: async (payload: CreateProgramHibahPayload): Promise<ProgramHibahResponse> => {
    const res = await api.post<ProgramHibahResponse>("/api/hibah", payload);
    return res.data;
  },

  updateProgram: async (id: string, payload: UpdateProgramHibahPayload): Promise<ProgramHibahResponse> => {
    const res = await api.put<ProgramHibahResponse>(`/api/hibah/${id}`, payload);
    return res.data;
  },

  deleteProgram: async (id: string): Promise<void> => {
    await api.delete(`/api/hibah/${id}`);
  },
};