import api from './api';

export const appointmentService = {
  // Get generated time slots for a doctor on a specific date with live availability counts
  getAvailableSlots: async (doctorId, date) => {
    const response = await api.get(`/appointments/slots`, {
      params: { doctorId, date }
    });
    return response.data;
  },

  // Register for OP
  bookAppointment: async (bookingData) => {
    const response = await api.post('/appointments', bookingData);
    return response.data;
  },

  // Get single appointment by ID or OP number
  getAppointmentById: async (id) => {
    const response = await api.get(`/appointments/${id}`);
    return response.data;
  },

  getAppointmentByOpNumber: async (opNumber) => {
    const response = await api.get(`/appointments/op/${opNumber}`);
    return response.data;
  },

  // Patient appointments
  getPatientAppointments: async (patientId, params = {}) => {
    const response = await api.get(`/appointments/patient/${patientId}`, { params });
    return response.data;
  },

  // Doctor appointments
  getDoctorAppointments: async (doctorId, params = {}) => {
    const response = await api.get(`/appointments/doctor/${doctorId}`, { params });
    return response.data;
  },

  // Admin / Master list
  getAllAppointments: async (params = {}) => {
    const response = await api.get('/appointments', { params });
    return response.data;
  },

  // Update appointment status: CONFIRMED, WAITING, VISITED, COMPLETED, CANCELLED
  updateStatus: async (appointmentId, statusData) => {
    const response = await api.put(`/appointments/${appointmentId}/status`, statusData);
    return response.data;
  },

  // Cancel appointment
  cancelAppointment: async (appointmentId, reason) => {
    const response = await api.post(`/appointments/${appointmentId}/cancel`, { reason });
    return response.data;
  }
};
