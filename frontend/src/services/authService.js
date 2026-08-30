import api from './api';

export const authService = {
  login: async (credentials) => {
    // credentials: { usernameOrEmail, password, role }
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  registerPatient: async (patientData) => {
    const response = await api.post('/auth/register/patient', patientData);
    return response.data;
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('hospital_user');
    return user ? JSON.parse(user) : null;
  },

  logout: () => {
    localStorage.removeItem('hospital_user');
  }
};
