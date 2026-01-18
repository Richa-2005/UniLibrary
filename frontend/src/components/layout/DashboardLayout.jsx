
import { Outlet } from 'react-router-dom';
import Navbar from './NavBar.jsx';
import styles from './DashboardLayout.module.css';

const DashboardLayout = () => {
  return (
    <div className={styles.layout}>
      <Navbar />
      <main className={styles.content}>
        <Outlet /> 
      </main>
    </div>
  );
};

export default DashboardLayout;