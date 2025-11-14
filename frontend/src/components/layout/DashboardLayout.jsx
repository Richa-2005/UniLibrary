import React from 'react';
import Navbar from './NavBar.jsx';
import { Outlet } from 'react-router-dom';

// This component wraps all our dashboard pages
const DashboardLayout = () => {
  return (
    <div>
      <Navbar />
      <main>
        {/* <Outlet> renders the child route (e.g., StudentDashboard) */}
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;