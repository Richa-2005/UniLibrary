import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import StudentNavbar from './StudentNavbar';
import styles from './DashboardLayout.module.css'; 

const StudentLayout = () => {
  
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('userRole');

  if (!token || role !== 'student') {
    return <Navigate to="/login" />;
  }

  return (
    <div className={styles.layout}>
      <StudentNavbar />
      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  );
};

export default StudentLayout;