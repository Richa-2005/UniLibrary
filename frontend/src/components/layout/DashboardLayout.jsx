import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './NavBar.jsx';
import styles from './DashboardLayout.module.css';

const DashboardLayout = () => {
  return (
    <div className={styles.layout}>
      <Navbar />
      <main className={styles.content}>
        <Outlet /> {/* This is where your page (e.g., AdminDashboard) will be rendered */}
      </main>
    </div>
  );
};

export default DashboardLayout;