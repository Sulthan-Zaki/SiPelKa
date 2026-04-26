import api from "./axiosInstance";
import type { AdminRegisterPayload, LoginPayload, LoginResponse, UserResponse } from "@/types/user";

export const authApi = {
  login: async (payload: LoginPayload): Promise<LoginResponse> => {
    const res = await api.post<LoginResponse>("/api/users/login", payload);
    return res.data;
  },

  registerAdmin: async (payload: AdminRegisterPayload): Promise<UserResponse> => {
    const res = await api.post<UserResponse>("/api/users/register/admin", payload);
    return res.data;
  },
};
