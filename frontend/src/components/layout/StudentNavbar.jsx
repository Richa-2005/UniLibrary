import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Navbar.module.css'; 
import StudentProfileSidebar from './StudentProfileSidebar';

const StudentNavbar = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [student, setStudent] = useState(null);

  // Load student data from LocalStorage on mount
  useEffect(() => {
    const data = localStorage.getItem('studentData');
    if (data) {
      setStudent(JSON.parse(data));
    }
  }, []);
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('studentData'); 
    navigate('/login');
  };

  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.container}>
          <Link to="/student/dashboard" className={styles.logo}>
            UniLibrary 🎓
          </Link>
          
          <div className={styles.navMenu}>
            <span className={styles.welcomeText}>
              Hi, {student?.name?.split(' ')[0] || 'Student'}
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

  
      <StudentProfileSidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        student={student}
        onLogout={handleLogout}
      />
    </>
  );
};

export default StudentNavbar;