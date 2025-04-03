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
  getApplicationById: (id: string) => apiClient.get(`/ethiopia-visa/${id}`),
  getVisaTypes: () => apiClient.get("/ethiopia-visa/visa-types/prices"),
  // Add these new endpoints
  getGovRefDetails: (applicationId: string, applicantType: string, additionalApplicantIndex?: number | null) => {
    let endpoint = `/ethiopia-visa/gov-ref/${applicationId}/${applicantType}`;
    if (applicantType === 'additional' && additionalApplicantIndex !== null) {
      endpoint += `/${additionalApplicantIndex}`;
    }
    return apiClient.get(endpoint);
  },
  createOrUpdateGovRefDetails: (data: {
    applicationId: string;
    govRefEmail: string;
    govRefNumber: string;
    comment: string;
    applicantType: 'primary' | 'additional';
    additionalApplicantIndex: number | null;
  }) => apiClient.post('/ethiopia-visa/gov-ref/create', data),
  deleteGovRefDetails: (applicationId: string, applicantType: string, additionalApplicantIndex?: number | null) => {
    let endpoint = `/ethiopia-visa/gov-ref/${applicationId}/${applicantType}`;
    if (applicantType === 'additional' && additionalApplicantIndex !== null) {
      endpoint += `/${additionalApplicantIndex}`;
    }
    return apiClient.delete(endpoint);
  }
};