import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import styles from './AdminDashboard.module.css';
//sub - sections
import AddBookSection from './components/AddBookSection';
import InventorySection from './components/InventorySection';

const AdminDashboard = () => {
  const { user } = useAuth(); //get user details
  const [activeTab, setActiveTab] = useState('inventory'); // 'inventory' or 'add'
  const [stats, setStats] = useState({ totalBooks: 0, totalCopies: 0, activeLoans: 0 }); 

  const fetchStats = useCallback(async () => {
    try {
      const response = await api.get('/admin/my-books');
      const books = response.data;
      
      const totalTitles = books.length;
      
      // Calculate Total Physical Copies
      const totalCopies = books.reduce((sum, book) => sum + (book.totalCopies || 0), 0);
      
      // Calculate Currently Available
      const currentAvailable = books.reduce((sum, book) => sum + (book.availableCopies || 0), 0);

      // Active Loans = Total - Available
      const activeLoans = totalCopies - currentAvailable;
      
      setStats({ totalBooks: totalTitles, totalCopies, activeLoans });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  }, []);


  useEffect(() => {
    fetchStats();
  }, [fetchStats]);
  return (
    <div className={styles.dashboardContainer}>
      
      <header className={styles.header}>
        <h1>Welcome, {user?.name || 'User'}</h1>
        <p className={styles.date}>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p> 
        {/* date */}
      </header>

    
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <h3>Total Titles</h3>
          <p className={styles.statNumber}>{stats.totalBooks}</p>
          <span className={styles.statLabel}>Distinct Books</span>
        </div>
        <div className={styles.statCard}>
          <h3>Total Copies</h3>
          <p className={styles.statNumber}>{stats.totalCopies}</p>
          <span className={styles.statLabel}>Physical Inventory</span>
        </div>
        <div className={styles.statCard}>
          <h3>Active Loans</h3>
          <p className={styles.statNumber}>{stats.activeLoans}</p> 
          <span className={styles.statLabel}>Students with books</span>
        </div>
      </div>

  
      <div className={styles.tabs}>
        <button 
          className={`${styles.tab} ${activeTab === 'inventory' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('inventory')}
        >
          Manage Inventory
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'add' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('add')}
        >
          Add New Book
        </button>
      </div>

      <div className={styles.contentArea}>
        {activeTab === 'inventory' ? <InventorySection onInventoryUpdate={fetchStats} /> : <AddBookSection />}
      </div>
    </div>
  );
};

export default AdminDashboard;