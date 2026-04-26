export interface UserResponse {
  id: string;
  name: string;
  email: string;
  nip: string;
  role: "ADMIN" | "RESEARCHER" | "REVIEWER";
  isActivated: boolean;
}

export interface LoginResponse {
  token: string;
  user: UserResponse;
}

export interface AdminRegisterPayload {
  name: string;
  email: string;
  nip: string;
  password: string;
  adminToken: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}
