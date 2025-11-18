import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import ProfileSidebar from './ProfileSidebar';
import styles from './Navbar.module.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const dashboardLink = '/admin/dashboard'; 

  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.container}>
          <Link to={dashboardLink} className={styles.logo}>
            UniLibrary 📚
          </Link>
          
          <div className={styles.navMenu}>
            <span className={styles.welcomeText}>
              Welcome, {user?.name || 'User'}
            </span>
            
            
            <button 
              onClick={() => setIsSidebarOpen(true)} 
              className={styles.profileIconBtn}
              title="My Profile"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </button>
          </div>
        </div>
      </nav>

      <ProfileSidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        user={user}
        onLogout={logout}
      />
    </>
  );
};

export default Navbar;