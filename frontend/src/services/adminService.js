import api from './api';

export const adminService = {
  getDashboardStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  },

  getAllPatients: async (params = {}) => {
    const response = await api.get('/admin/patients', { params });
    return response.data;
  },

  updatePatientStatus: async (patientId, status) => {
    const response = await api.put(`/admin/patients/${patientId}/status`, { status });
    return response.data;
  },

  updateDoctorStatus: async (doctorId, status) => {
    const response = await api.put(`/admin/doctors/${doctorId}/status`, { status });
    return response.data;
  }
};
