import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080",
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("sipelka_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("Axios: Attaching token:", token.substring(0, 20) + "...");
    } else {
      console.log("Axios: No token found in localStorage");
    }
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.code === "ECONNABORTED" || error.code === "ERR_NETWORK") {
      console.error("API request timeout or network error:", error.message);
    }
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("sipelka_token");
        localStorage.removeItem("sipelka_user");
        document.cookie = "sipelka_token=; path=/; max-age=0";
        window.location.href = "/login";
      }
    }
    if (error.response?.status === 403) {
      console.error("Access forbidden - role not authorized:", error.response?.data);
    }
    console.error("API Error:", error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

export default api;
