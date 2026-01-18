
import styles from './ProfileSidebar.module.css';

const ProfileSidebar = ({ isOpen, onClose, user, onLogout }) => {
  return (
    <>
   
      <div 
        className={`${styles.backdrop} ${isOpen ? styles.backdropOpen : ''}`} 
        onClick={onClose}
      />

      <div className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''}`}>
   
        <div className={styles.header}>
          <h2>My Profile</h2>
          <button onClick={onClose} className={styles.closeButton}>&times;</button>
        </div>

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

     
          <div className={styles.detailGroup}>
            <label>Account Role</label>
            <p>Administrator</p> 
          </div>
        
        </div>

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