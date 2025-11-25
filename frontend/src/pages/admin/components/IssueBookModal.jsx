import React, { useState } from 'react';
import styles from './BookDetailModal.module.css'; // Re-using modal styles

const IssueBookModal = ({ book, onClose, onConfirm }) => {
  const [rollNumber, setRollNumber] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!rollNumber || !dueDate) return alert("Please fill all fields");
    
    setLoading(true);
    await onConfirm(book.libraryEntryId, rollNumber, dueDate);
    setLoading(false);
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()} style={{maxWidth: '500px'}}>
        <button className={styles.closeButton} onClick={onClose}>&times;</button>
        
        <div style={{ padding: '2rem' }}>
          <h2 className={styles.title}>Issue Book</h2>
          <p className={styles.author}>{book.title}</p>
          <hr className={styles.divider} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{fontWeight: 'bold', display:'block', marginBottom:'0.5rem'}}>Student Roll Number</label>
              <input 
                type="text" 
                value={rollNumber}
                onChange={e => setRollNumber(e.target.value)}
                style={{width: '100%', padding: '0.8rem', border: '1px solid #ccc', borderRadius: '6px'}}
                placeholder="e.g. 2K23/CS/01"
              />
            </div>

            <div>
              <label style={{fontWeight: 'bold', display:'block', marginBottom:'0.5rem'}}>Due Date</label>
              <input 
                type="date" 
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                style={{width: '100%', padding: '0.8rem', border: '1px solid #ccc', borderRadius: '6px'}}
              />
            </div>

            <button 
              className={styles.addButton}
              onClick={handleSubmit}
              disabled={loading}
              style={{marginTop: '1rem'}}
            >
              {loading ? 'Issuing...' : 'Confirm Issue'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueBookModal;