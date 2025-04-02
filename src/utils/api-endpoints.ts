import apiClient from "./api-client";

// Admin authentication endpoints
export const adminApi = {
  login: (email: string, password: string) =>
    apiClient.post("/adminD/login", { email, password }),

  getProfile: (id: string) => apiClient.get(`/adminD/profile/${id}`),

  updateProfile: (id: string, data: unknown) =>
    apiClient.put(`/adminD/profile/${id}`, data),

  registerAdmin: (data: unknown) => apiClient.post("/adminD/register", data),

  deleteAdmin: (id: string) => apiClient.delete(`/adminD/${id}`),
};

export const ethiopiaVisaApi = {
  getAllApplications: () => apiClient.get("/ethiopia-visa/all"),
  getApplicationById: (id: string) => apiClient.get(`/ethiopia-visa/applications/${id}`),
};