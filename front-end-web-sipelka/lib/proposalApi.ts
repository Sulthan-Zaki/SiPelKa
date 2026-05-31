import api from "./axiosInstance";

export interface ProposalStats {
  total: number;
  active: number;
  pending: number;
  ruleFailed: number;
}

export interface ProposalResponse {
  id: string;
  penelitiId: string;
  penelitiName: string;
  hibahId: string;
  hibahName: string;
  judulPenelitian: string;
  bidangPenelitian: string;
  ringkasan: string;
  dokumenUrl: string;
  statusProposal: string;
  kriteriaKelengkapanDokumen: boolean;
  kesesuaianBidang: boolean;
  skorRuleBased: number;
  createdAt: string;
  updatedAt: string;
}

export const proposalApi = {
  getAll: async (): Promise<ProposalResponse[]> => {
    const res = await api.get<ProposalResponse[]>("/api/proposals");
    return res.data;
  },

  getById: async (id: string): Promise<ProposalResponse> => {
    const res = await api.get<ProposalResponse>(`/api/proposals/${id}`);
    return res.data;
  },

  getStats: async (): Promise<ProposalStats> => {
    const res = await api.get<ProposalStats>("/api/proposals/stats");
    return res.data;
  },

  getFlagged: async (): Promise<ProposalResponse[]> => {
    const res = await api.get<ProposalResponse[]>("/api/proposals/flagged");
    return res.data;
  },

  getByPeneliti: async (penelitiId: string): Promise<ProposalResponse[]> => {
    const res = await api.get<ProposalResponse[]>(`/api/proposals/peneliti/${penelitiId}`);
    return res.data;
  },
};