import { Route, Routes } from 'react-router-dom'
import React from 'react'
import ProtectedRoute from './components/common/ProtectedRoute';
// import StudentDashboard from './pages/student/StudentDashboard.jsx'
import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import LoginPage from './pages/LoginPage.jsx'
import DashboardLayout from './components/layout/DashboardLayout';
// import DashboardLayout from './com'

export default function App() {
  return (
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />

      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <DashboardLayout /> 
          </ProtectedRoute>
        }
      >
        
        <Route path="dashboard" element={<AdminDashboard />} />
        {/* <Route path="manage-students" element={<ManageStudentsPage />} /> */}
        {/* <Route path="settings" element={<SettingsPage />} /> */}
      </Route>
        
      </Routes>
  )
}
