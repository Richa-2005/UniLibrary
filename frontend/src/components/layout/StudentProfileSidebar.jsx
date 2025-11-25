import {useState,useEffect} from 'react';
import styles from './ProfileSidebar.module.css'; 
import api from '../../services/api';

const StudentProfileSidebar = ({ isOpen, onClose, student, onLogout }) => {
  const [borrowedBooks, setBorrowedBooks] = useState([]);

  useEffect(() => {
    if (isOpen) {
      api.get('/student/my-books')
        .then(res => setBorrowedBooks(res.data))
        .catch(err => console.error(err));
    }
  }, [isOpen]);
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
          <hr style={{ width: '100%', border: '0', borderTop: '1px solid #ddd', margin: '1.5rem 0' }} />
          
          {/* Borrowed Books List */}
          <div style={{ width: '100%' }}>
            <h3 style={{ color: 'var(--primary-color)', fontSize: '1rem', marginBottom: '1rem' }}>
              Borrowed Books ({borrowedBooks.length})
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {borrowedBooks.length === 0 ? (
                <p style={{ color: '#888', fontSize: '0.9rem' }}>No active loans.</p>
              ) : (
                borrowedBooks.map(book => (
                  <div key={book.recordId} style={{ display: 'flex', gap: '10px', padding: '10px', background: '#f9f9f9', borderRadius: '8px' }}>
                    {/* Thumbnail */}
                    <div style={{ width: '40px', height: '50px', background: '#ddd', flexShrink: 0 }}>
                      {book.thumbnail && <img src={book.thumbnail} style={{width:'100%', height:'100%', objectFit:'cover'}} alt="" />}
                    </div>
                    {/* Info */}
                    <div style={{ overflow: 'hidden' }}>
                      <p style={{ margin: 0, fontWeight: 'bold', fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {book.title}
                      </p>
                      <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: '#d9534f', fontWeight: 'bold' }}>
                        Due: {new Date(book.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
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