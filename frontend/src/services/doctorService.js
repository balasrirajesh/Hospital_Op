import api from './api';

export const doctorService = {
  getAllDoctors: async (params = {}) => {
    // params: { departmentId, search, dayOfWeek }
    const response = await api.get('/doctors', { params });
    return response.data;
  },

  getDoctorById: async (id) => {
    const response = await api.get(`/doctors/${id}`);
    return response.data;
  },

  getDoctorsByDepartment: async (departmentId) => {
    const response = await api.get(`/doctors/department/${departmentId}`);
    return response.data;
  },

  createDoctor: async (doctorData) => {
    const response = await api.post('/admin/doctors', doctorData);
    return response.data;
  },

  updateDoctor: async (id, doctorData) => {
    const response = await api.put(`/doctors/${id}`, doctorData);
    return response.data;
  },

  getDoctorSchedules: async (doctorId) => {
    const response = await api.get(`/doctors/${doctorId}/schedules`);
    return response.data;
  },

  updateDoctorSchedules: async (doctorId, schedules) => {
    const response = await api.put(`/doctors/${doctorId}/schedules`, schedules);
    return response.data;
  },

  getDoctorLeaves: async (doctorId) => {
    const response = await api.get(`/doctors/${doctorId}/leaves`);
    return response.data;
  },

  addDoctorLeave: async (doctorId, leaveData) => {
    const response = await api.post(`/doctors/${doctorId}/leaves`, leaveData);
    return response.data;
  },

  deleteDoctorLeave: async (doctorId, leaveId) => {
    const response = await api.delete(`/doctors/${doctorId}/leaves/${leaveId}`);
    return response.data;
  }
};
