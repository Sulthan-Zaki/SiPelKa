import api from "./axiosInstance";

export interface PencairanDanaResponse {
  id: string;
  proposalId: string;
  proposalTitle: string;
  penelitiName: string;
  adminId: string;
  tahapPencairan: number;
  jumlahDana: number;
  statusPencairan: "PENDING" | "PROSES" | "CAIR";
  tanggalPencairan: string | null;
  buktiTransferUrl: string | null;
}

export interface PencairanStats {
  totalCeiling: number;
  totalDisbursed: number;
  totalInProcess: number;
  totalPending: number;
}

export const pencairanApi = {
  getAll: async (): Promise<PencairanDanaResponse[]> => {
    const res = await api.get<PencairanDanaResponse[]>("/api/pencairan");
    return res.data;
  },

  getStats: async (): Promise<PencairanStats> => {
    const res = await api.get<PencairanStats>("/api/pencairan/stats");
    return res.data;
  },

  getByProposal: async (proposalId: string): Promise<PencairanDanaResponse[]> => {
    const res = await api.get<PencairanDanaResponse[]>(`/api/pencairan/proposal/${proposalId}`);
    return res.data;
  },

  updateStatus: async (id: string, status: string, buktiTransferUrl?: string): Promise<PencairanDanaResponse> => {
    const params = new URLSearchParams({ status });
    if (buktiTransferUrl) params.append("buktiTransferUrl", buktiTransferUrl);
    const res = await api.put<PencairanDanaResponse>(`/api/pencairan/${id}/status?${params.toString()}`);
    return res.data;
  },
};