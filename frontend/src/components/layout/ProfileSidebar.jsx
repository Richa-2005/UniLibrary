import React from 'react';
import styles from './ProfileSidebar.module.css';
//gets all the info directly from the navbar.
const ProfileSidebar = ({ isOpen, onClose, user, onLogout }) => {
  return (
    <>
      {/* 1. The Backdrop (Dark overlay) */}
      <div 
        className={`${styles.backdrop} ${isOpen ? styles.backdropOpen : ''}`} 
        onClick={onClose}
      />

      {/* 2. The Sidebar Panel */}
      <div className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''}`}>
        
        {/* Header with Close Button */}
        <div className={styles.header}>
          <h2>My Profile</h2>
          <button onClick={onClose} className={styles.closeButton}>&times;</button>
        </div>

        {/* User Details Section */}
        <div className={styles.content}>
          <div className={styles.avatarCircle}>
            {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
          </div>
          

          {user?.name && ( 
             <div className={styles.detailGroup}>
               <label>University/Organization</label>
               <p>{user.name}</p> 
             </div>
          )}

          <div className={styles.detailGroup}>
            <label>Email</label>
            <p>{user?.email || 'N/A'}</p>
          </div>

          {/* Field 3: Role */}
          <div className={styles.detailGroup}>
            <label>Account Role</label>
            <p>Administrator</p> 
          </div>
        
        </div>

        {/* Footer with Logout */}
        <div className={styles.footer}>
          <button onClick={onLogout} className={styles.logoutButton}>
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default ProfileSidebar;