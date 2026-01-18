import { useState, useEffect, useCallback } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'; 

import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import styles from './AdminDashboard.module.css';

//Tabs Components
import AddBookSection from './components/AddBookSection';
import InventorySection from './components/InventorySection';
import StudentSection from './components/StudentSection';
import SettingsModal from './components/SettingsModal';
import FinancialsSection from './components/FinancialsSection';

const AdminDashboard = () => {
  const { user } = useAuth(); 
  const [activeTab, setActiveTab] = useState('inventory'); 
  const [isMounted, setIsMounted] = useState(false);
  
  const [stats, setStats] = useState({ 
    totalBooks: 0, 
    totalCopies: 0, 
    activeLoans: 0,
    academicCount: 0,
    novelCount: 0,
    magazineCount: 0
  }); 
  
  const [showSettings, setShowSettings] = useState(false);

  const fetchStats = useCallback(async () => {
    try {
      const response = await api.get('/admin/my-books');
      const books = response.data;
      
      const totalTitles = books.length;
      const totalCopies = books.reduce((sum, book) => sum + (book.totalCopies || 0), 0);
      const currentAvailable = books.reduce((sum, book) => sum + (book.availableCopies || 0), 0);
      const activeLoans = totalCopies - currentAvailable;

      const academicCount = books.filter(b => !b.category || b.category === 'Academic').length;
      const novelCount = books.filter(b => b.category === 'Novel').length;
      const magazineCount = books.filter(b => b.category === 'Magazine').length;
      
      setStats({ 
        totalBooks: totalTitles, 
        totalCopies, 
        activeLoans,
        academicCount,
        novelCount,
        magazineCount
      });

    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 100);
    return () => clearTimeout(timer);
  }, [fetchStats]);

  const colors = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444'];

  const chartData = [
    { name: 'Academic', count: stats.academicCount },
    { name: 'Novels', count: stats.novelCount },
    { name: 'Magazines', count: stats.magazineCount },
    { name: 'Loans', count: stats.activeLoans }
  ];

  return (
    <div className={styles.dashboardContainer}>
      
      <header className={styles.header}>
        <h1>Welcome, {user?.name || 'User'}</h1>
        <p className={styles.date}>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p> 
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
      
      {/* Library chart */}
      <div className={styles.chartContainer}>
        <h3>Library Composition</h3>

        <div className={styles.chartWrap}>
          {stats.totalBooks > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100%', color:'#999' }}>
              No data to display
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      
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
        <button 
          className={`${styles.tab} ${activeTab === 'students' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('students')}
        >
          Manage Students
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'financials' ? styles.activeTab : styles.tab}`} 
          onClick={() => setActiveTab('financials')}
        >
          Financials
        </button>
        <button 
          className={`${styles.tab}`}
          onClick={() => setShowSettings(true)}>
          Library Settings
        </button>
      </div>

      <div className={styles.contentArea}>
        {activeTab === 'inventory' && <InventorySection onInventoryUpdate={fetchStats} />}
        {activeTab === 'add' && <AddBookSection />}
        {activeTab === 'students' && <StudentSection />}
        {activeTab === 'financials' && <FinancialsSection />}
      </div>
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </div>
  );
};

export default AdminDashboard;