import { Route, Routes } from 'react-router-dom'
import React from 'react'
// import StudentDashboard from './pages/student/StudentDashboard.jsx'
// import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import LoginPage from './pages/LoginPage.jsx'
// import DashboardLayout from './com'

export default function App() {
  return (
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />

      {/* <Route element={<DashboardLayout />}>
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Route> */}
        
      </Routes>
  )
}
