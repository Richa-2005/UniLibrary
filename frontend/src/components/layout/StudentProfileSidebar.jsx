import React from 'react';
import styles from './ProfileSidebar.module.css'; // Re-use the Admin sidebar CSS!

const StudentProfileSidebar = ({ isOpen, onClose, student, onLogout }) => {
  return (
    <>
      {/* Backdrop */}
      <div 
        className={`${styles.backdrop} ${isOpen ? styles.backdropOpen : ''}`} 
        onClick={onClose}
      />

      {/* Sidebar Panel */}
      <div className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''}`}>
        
        {/* Header */}
        <div className={styles.header}>
          <h2>Student Profile</h2>
          <button onClick={onClose} className={styles.closeButton}>&times;</button>
        </div>

        {/* Content */}
        <div className={styles.content}>
          <div className={styles.avatarCircle}>
            {student?.name ? student.name.charAt(0).toUpperCase() : 'S'}
          </div>
          
          <div className={styles.detailGroup}>
            <label>Full Name</label>
            <p>{student?.name || 'Student'}</p>
          </div>

          <div className={styles.detailGroup}>
            <label>Roll Number</label>
            <p>{student?.rollNumber || 'N/A'}</p>
          </div>

          <div className={styles.detailGroup}>
            <label>University</label>
            <p>{student?.universityName || 'N/A'}</p>
          </div>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <button onClick={onLogout} className={styles.logoutButton}>
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default StudentProfileSidebar;