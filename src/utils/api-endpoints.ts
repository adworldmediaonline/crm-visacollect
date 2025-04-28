import apiClient from './api-client';

// Admin authentication endpoints
export const adminApi = {
  login: (email: string, password: string) =>
    apiClient.post('/adminD/login', { email, password }),

  getProfile: (id: string) => apiClient.get(`/adminD/profile/${id}`),

  updateProfile: (id: string, data: unknown) =>
    apiClient.put(`/adminD/profile/${id}`, data),

  registerAdmin: (data: unknown) => apiClient.post('/adminD/register', data),

  deleteAdmin: (id: string) => apiClient.delete(`/adminD/${id}`),
};

export const ethiopiaVisaApi = {
  getAllApplications: () => apiClient.get('/ethiopia-visa/all'),
  getApplicationById: (id: string) => apiClient.get(`/ethiopia-visa/${id}`),
  getVisaTypes: () => apiClient.get('/ethiopia-visa/visa-types/prices'),
  // Add these new endpoints
  getGovRefDetails: (
    applicationId: string,
    applicantType: string,
    additionalApplicantIndex?: number | null
  ) => {
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
  deleteGovRefDetails: (
    applicationId: string,
    applicantType: string,
    additionalApplicantIndex?: number | null
  ) => {
    let endpoint = `/ethiopia-visa/gov-ref/${applicationId}/${applicantType}`;
    if (applicantType === 'additional' && additionalApplicantIndex !== null) {
      endpoint += `/${additionalApplicantIndex}`;
    }
    return apiClient.delete(endpoint);
  },
  updateApplicationStatus: (id: string, status: string) =>
    apiClient.put(`/ethiopia-visa/${id}`, {
      applicationStatus: status
    }),
  // Email reminder endpoints
  sendDocumentReminder: (applicationId: string) =>
    apiClient.post(`/mail/documents-reminder/${applicationId}`),
  sendPaymentReminder: (applicationId: string) =>
    apiClient.post(`/mail/payment-reminder/${applicationId}`),
  sendPassportReminder: (applicationId: string) =>
    apiClient.post(`/mail/passport-reminder/${applicationId}`),
  sendPhotoReminder: (applicationId: string) =>
    apiClient.post(`/mail/photo-reminder/${applicationId}`),
  sendApplicationConfirmation: (applicationId: string) =>
    apiClient.post(`/mail/application-confirmation/${applicationId}`),
  sendSpecificDocumentsReminder: (
    applicationId: string,
    data: { documentType: string }
  ) =>
    apiClient.post(`/mail/specific-documents-reminder/${applicationId}`, data),
};

export const kenyaVisaApi = {
  getAllApplications: () => apiClient.get('/kenya-visa/all'),
  getApplicationById: (id: string) => apiClient.get(`/kenya-visa/${id}`),
  getVisaTypes: () => apiClient.get('/kenya-visa/visa-types/prices'),
  // Add these new endpoints
  getGovRefDetails: (
    applicationId: string,
    applicantType: string,
    additionalApplicantIndex?: number | null
  ) => {
    let endpoint = `/kenya-visa/gov-ref/${applicationId}/${applicantType}`;
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
  }) => apiClient.post('/kenya-visa/gov-ref/create', data),
  deleteGovRefDetails: (
    applicationId: string,
    applicantType: string,
    additionalApplicantIndex?: number | null
  ) => {
    let endpoint = `/kenya-visa/gov-ref/${applicationId}/${applicantType}`;
    if (applicantType === 'additional' && additionalApplicantIndex !== null) {
      endpoint += `/${additionalApplicantIndex}`;
    }
    return apiClient.delete(endpoint);
  },
  updateApplicationStatus: async (id: string, status: string) => {
    return apiClient.put(`/kenya-visa/${id}`, {
      applicationStatus: status
    });
  },
  // Email reminder endpoints
  sendDocumentReminder: (applicationId: string) =>
    apiClient.post(`/kenya-visa/mail/documents-reminder/${applicationId}`),
  sendPaymentReminder: (applicationId: string) =>
    apiClient.post(`/kenya-visa/mail/payment-reminder/${applicationId}`),
  sendPassportReminder: (applicationId: string) =>
    apiClient.post(`/kenya-visa/mail/passport-reminder/${applicationId}`),
  sendPhotoReminder: (applicationId: string) =>
    apiClient.post(`/kenya-visa/mail/photo-reminder/${applicationId}`),
  sendApplicationConfirmation: (applicationId: string) =>
    apiClient.post(`/kenya-visa/mail/application-confirmation/${applicationId}`),
  sendSpecificDocumentsReminder: (
    applicationId: string,
    data: { documentType: string }
  ) =>
    apiClient.post(`/kenya-visa/mail/specific-documents-reminder/${applicationId}`, data),
};

export const egyptVisaApi = {
  getAllApplications: () => apiClient.get('/egypt-visa/all'),
  getApplicationById: (id: string) => apiClient.get(`/egypt-visa/${id}`),
  getVisaTypes: () => apiClient.get('/egypt-visa/visa-types/prices'),
  // Add these new endpoints
  getGovRefDetails: (
    applicationId: string,
    applicantType: string,
    additionalApplicantIndex?: number | null
  ) => {
    let endpoint = `/egypt-visa/gov-ref/${applicationId}/${applicantType}`;
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
  }) => apiClient.post('/egypt-visa/gov-ref/create', data),
  deleteGovRefDetails: (
    applicationId: string,
    applicantType: string,
    additionalApplicantIndex?: number | null
  ) => {
    let endpoint = `/egypt-visa/gov-ref/${applicationId}/${applicantType}`;
    if (applicantType === 'additional' && additionalApplicantIndex !== null) {
      endpoint += `/${additionalApplicantIndex}`;
    }
    return apiClient.delete(endpoint);
  },
  updateApplicationStatus: async (id: string, status: string) => {
    return apiClient.put(`/egypt-visa/${id}`, {
      applicationStatus: status
    });
  },
  // Email reminder endpoints
  sendDocumentReminder: (applicationId: string) =>
    apiClient.post(`/egypt-visa/mail/documents-reminder/${applicationId}`),
  sendPaymentReminder: (applicationId: string) =>
    apiClient.post(`/egypt-visa/mail/payment-reminder/${applicationId}`),
  sendPassportReminder: (applicationId: string) =>
    apiClient.post(`/egypt-visa/mail/passport-reminder/${applicationId}`),
  sendPhotoReminder: (applicationId: string) =>
    apiClient.post(`/egypt-visa/mail/photo-reminder/${applicationId}`),
  sendApplicationConfirmation: (applicationId: string) =>
    apiClient.post(`/egypt-visa/mail/application-confirmation/${applicationId}`),
  sendSpecificDocumentsReminder: (
    applicationId: string,
    data: { documentType: string }
  ) =>
    apiClient.post(`/egypt-visa/mail/specific-documents-reminder/${applicationId}`, data),
};

export const indianVisaApi = {
  getAllApplications: async () => {
    return apiClient.get('/india-visa/applications');
  },
  getApplicationById: async (id: string) => {
    return apiClient.get(`/india-visa/applications/${id}`);
  },
  sendIncompleteReminder: async (id: string) => {
    return apiClient.post(`/india-visa/applications/${id}/remind/incomplete`);
  },
  sendDocumentReminder: async (id: string) => {
    return apiClient.post(`/india-visa/applications/${id}/remind/documents`);
  },
  sendPaymentReminder: async (id: string) => {
    return apiClient.post(`/india-visa/applications/${id}/remind/payment`);
  },
  updateApplicationStatus: async (id: string, status: string) => {
    return apiClient.put(`/india-visa/applications/${id}/status`, {
      status,
    });
  },
  sendReminderEmails: async (emailTypes?: {
    incomplete?: boolean;
    pendingDocument?: boolean;
    holdOn?: boolean;
  }) => {
    return apiClient.post('/india-visa/send-reminder-emails', { emailTypes });
  },

  createOrUpdateGovRefDetails: async (data: {
    visaApplicationId: string;
    govRefEmail: string;
    govRefNumber: string;
    comment: string;
  }) => {
    return apiClient.post('/india-visa/gov-ref/create', data);
  },

  getGovRefDetails: async (
    applicationId: string
  ) => {
    return apiClient.get(`/india-visa/gov-ref/${applicationId}`);
  },

  deleteGovRefDetails: async (applicationId: string) => {
    return apiClient.delete(`/india-visa/gov-ref/${applicationId}`);
  }
};
