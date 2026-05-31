import api from "./axiosInstance";

export interface ReviewProposalResponse {
  id: string;
  proposalId: string;
  reviewerId: string;
  skorPenilaian: number;
  catatanRevisi: string;
  statusRekomendasi: string;
  tanggalReview: string;
}

export const reviewApi = {
  assignReviewer: async (proposalId: string, reviewerId: string): Promise<ReviewProposalResponse> => {
    const res = await api.post<ReviewProposalResponse>("/api/reviews/assign", null, {
      params: { proposalId, reviewerId },
    });
    return res.data;
  },

  submitReview: async (id: string, payload: { skorPenilaian: number; catatanRevisi: string; statusRekomendasi: string }): Promise<ReviewProposalResponse> => {
    const res = await api.put<ReviewProposalResponse>(`/api/reviews/${id}/submit`, payload);
    return res.data;
  },

  getByProposal: async (proposalId: string): Promise<ReviewProposalResponse[]> => {
    const res = await api.get<ReviewProposalResponse[]>(`/api/reviews/proposal/${proposalId}`);
    return res.data;
  },

  getByReviewer: async (reviewerId: string): Promise<ReviewProposalResponse[]> => {
    const res = await api.get<ReviewProposalResponse[]>(`/api/reviews/reviewer/${reviewerId}`);
    return res.data;
  },
};