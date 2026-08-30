import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Sidebar } from './components/Sidebar';

// Public & Booking Pages
import { Home } from './pages/Home';
import { FindDoctors } from './pages/FindDoctors';
import { DoctorDetails } from './pages/DoctorDetails';
import { Departments } from './pages/Departments';
import { OpRegistration } from './pages/OpRegistration';
import { OpConfirmation } from './pages/OpConfirmation';
import { Login } from './pages/Login';
import { Register } from './pages/Register';

// Patient Pages
import { PatientDashboard } from './pages/Patient/PatientDashboard';
import { PatientAppointments } from './pages/Patient/PatientAppointments';
import { PatientProfile } from './pages/Patient/PatientProfile';

// Doctor Pages
import { DoctorDashboard } from './pages/Doctor/DoctorDashboard';
import { DoctorSchedule } from './pages/Doctor/DoctorSchedule';
import { DoctorProfile } from './pages/Doctor/DoctorProfile';

// Admin Pages
import { AdminDashboard } from './pages/Admin/AdminDashboard';
import { ManageDepartments } from './pages/Admin/ManageDepartments';
import { ManageDoctors } from './pages/Admin/ManageDoctors';
import { ManageAppointments } from './pages/Admin/ManageAppointments';
import { ManageSchedules } from './pages/Admin/ManageSchedules';
import { ManagePatients } from './pages/Admin/ManagePatients';

// Layout wrapper for dashboard pages with Sidebar
const DashboardLayout = ({ children }) => {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      {children}
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Navbar />
          <main className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/departments" element={<Departments />} />
              <Route path="/doctors" element={<FindDoctors />} />
              <Route path="/doctors/:id" element={<DoctorDetails />} />
              <Route path="/op-registration" element={<OpRegistration />} />
              <Route path="/op-confirmation" element={<OpConfirmation />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Patient Protected Routes */}
              <Route
                path="/patient/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['ROLE_PATIENT']}>
                    <DashboardLayout>
                      <PatientDashboard />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/patient/appointments"
                element={
                  <ProtectedRoute allowedRoles={['ROLE_PATIENT']}>
                    <DashboardLayout>
                      <PatientAppointments />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/patient/profile"
                element={
                  <ProtectedRoute allowedRoles={['ROLE_PATIENT']}>
                    <DashboardLayout>
                      <PatientProfile />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />

              {/* Doctor Protected Routes */}
              <Route
                path="/doctor/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['ROLE_DOCTOR']}>
                    <DashboardLayout>
                      <DoctorDashboard />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/doctor/schedule"
                element={
                  <ProtectedRoute allowedRoles={['ROLE_DOCTOR']}>
                    <DashboardLayout>
                      <DoctorSchedule />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/doctor/profile"
                element={
                  <ProtectedRoute allowedRoles={['ROLE_DOCTOR']}>
                    <DashboardLayout>
                      <DoctorProfile />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />

              {/* Admin Protected Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                    <DashboardLayout>
                      <AdminDashboard />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/departments"
                element={
                  <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                    <DashboardLayout>
                      <ManageDepartments />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/doctors"
                element={
                  <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                    <DashboardLayout>
                      <ManageDoctors />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/appointments"
                element={
                  <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                    <DashboardLayout>
                      <ManageAppointments />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/schedules"
                element={
                  <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                    <DashboardLayout>
                      <ManageSchedules />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/patients"
                element={
                  <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                    <DashboardLayout>
                      <ManagePatients />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />

              {/* Catch-all redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
