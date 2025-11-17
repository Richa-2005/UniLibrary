import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import styles from './Navbar.module.css';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link to="/admin/dashboard" className={styles.logo}>
          UniLibrary 📚
        </Link>
        <div className={styles.navMenu}>
          <span>Welcome, {user?.name || 'Admin'}!</span>
          <button onClick={logout} className={styles.logoutButton}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;