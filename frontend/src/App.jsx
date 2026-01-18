import { Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast';

import ProtectedRoute from './components/common/ProtectedRoute';

import StudentDashboard from './pages/student/StudentDashboard.jsx'
import AdminDashboard from './pages/admin/AdminDashboard.jsx'

import LoginPage from './pages/LoginPage.jsx'
import DashboardLayout from './components/layout/DashboardLayout';
import StudentLayout from './components/layout/StudentLayout';

export default function App() {
  return (
    <>
      <Toaster position="top-right" />

      <Routes>
        <Route 
          path="/" 
          element={<LoginPage />} 
        />

        <Route 
          path="/login" 
          element={<LoginPage />} 
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <DashboardLayout /> 
            </ProtectedRoute>
          }
        > 
          <Route 
            path="dashboard" 
            element={<AdminDashboard />} 
          />
        </Route>
      
        <Route 
          path="/student" 
          element={<StudentLayout />}
        >
          <Route 
            path="dashboard" 
            element={<StudentDashboard />} 
          />
        </Route>
      
      </Routes>
    </>
  )
}
