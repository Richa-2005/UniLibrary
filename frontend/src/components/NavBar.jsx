import React, { useState } from 'react';
import styles from './Navbar.module.css';
import { Link, useNavigate } from 'react-router-dom';
import ProfileSidebar from './ProfileSidebar'; // Import the new sidebar component

const Navbar = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State for sidebar

  const handleLogout = () => {
    setIsSidebarOpen(false); // Close sidebar on logout
    console.log('User logged out');
    navigate('/');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev); // Toggle the sidebar
  };

  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.container}>
          <Link to="/student" className={styles.logo}>
            UniLibrary 📚
          </Link>
          
          <div className={styles.navRight}>
            {/* Button to open the sidebar */}
            <button onClick={toggleSidebar} className={styles.profileButton}>
              My Profile
            </button>
            <button onClick={handleLogout} className={styles.logoutButton}>
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Render the ProfileSidebar component */}
      <ProfileSidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />

      {/* Optional: Overlay to dim the background when sidebar is open */}
      {isSidebarOpen && <div className={styles.overlay} onClick={toggleSidebar}></div>}
    </>
  );
};

export default Navbar;