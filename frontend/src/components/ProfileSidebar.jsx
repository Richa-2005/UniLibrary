import React from 'react';
import styles from './ProfileSidebar.module.css';

// --- MOCK DATA FOR PROFILE ---
const profileData = {
  rollNumber: '2410111037',
  university: 'Adani University',
  email: 'richagupta.cse24@adaniuni.ac.in',
  borrowedBooks: [
    { id: 1, title: 'Operating System Concepts', author: 'Silberschatz', dueDate: 'Nov 15, 2025' },
    { id: 2, title: 'Database System Concepts', author: 'Korth', dueDate: 'Nov 22, 2025' },
    { id: 3, title: 'Computer Networks', author: 'Tanenbaum', dueDate: 'Dec 01, 2025' },
    { id: 4, title: 'Artificial Intelligence', author: 'Russell, Norvig', dueDate: 'Dec 10, 2025' },
  ]
};
// --- END MOCK DATA ---

const ProfileSidebar = ({ isOpen, onClose }) => {
  return (
    // The main container for the sidebar, slides based on `isOpen`
    <div className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
      <div className={styles.header}>
        <h2>My Profile</h2>
        <button onClick={onClose} className={styles.closeButton}>
          &times; {/* HTML entity for a multiplication sign (X) */}
        </button>
      </div>

      <div className={styles.content}>
        <div className={styles.profileInfo}>
          <p><strong>Roll Number:</strong> {profileData.rollNumber}</p>
          <p><strong>University:</strong> {profileData.university}</p>
          <p><strong>Email:</strong> {profileData.email}</p>
        </div>

        <hr className={styles.divider} />

        <div className={styles.borrowedBooksSection}>
          <h3>Borrowed Books ({profileData.borrowedBooks.length})</h3>
          <ul className={styles.borrowedList}>
            {profileData.borrowedBooks.map(book => (
              <li key={book.id} className={styles.borrowedItem}>
                <div>
                  <h4>{book.title}</h4>
                  <p>by {book.author}</p>
                </div>
                <span className={styles.dueDate}>Due: {book.dueDate}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProfileSidebar;