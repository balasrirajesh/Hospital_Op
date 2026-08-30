import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => authService.getCurrentUser());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stored = authService.getCurrentUser();
    if (stored) {
      setUser(stored);
    }
  }, []);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const data = await authService.login(credentials);
      // data contains: { token, type: 'Bearer', id, email, name, role, patientId, doctorId }
      localStorage.setItem('hospital_user', JSON.stringify(data));
      setUser(data);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const registerPatient = async (patientData) => {
    setLoading(true);
    try {
      const data = await authService.registerPatient(patientData);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const hasRole = (role) => {
    return user && user.role === role;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        registerPatient,
        logout,
        isAuthenticated: !!user,
        isPatient: hasRole('ROLE_PATIENT'),
        isDoctor: hasRole('ROLE_DOCTOR'),
        isAdmin: hasRole('ROLE_ADMIN'),
        role: user ? user.role : null,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
