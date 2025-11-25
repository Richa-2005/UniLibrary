import React, { useState } from 'react';
import styles from './BookDetailModal.module.css'; // Re-using existing styles

const ReturnBookModal = ({ book, onClose, onConfirm }) => {
  const [rollNumber, setRollNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!rollNumber) return alert("Please enter Roll Number");
    
    setLoading(true);
    await onConfirm(book.libraryEntryId, rollNumber);
    setLoading(false);
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()} style={{maxWidth: '500px'}}>
        <button className={styles.closeButton} onClick={onClose}>&times;</button>
        
        <div style={{ padding: '2rem' }}>
          <h2 className={styles.title} style={{ color: '#28a745' }}>Return Book</h2>
          <p className={styles.author}>{book.title}</p>
          <hr className={styles.divider} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p style={{fontSize: '0.9rem', color: '#666'}}>
              Enter the Roll Number of the student returning this book.
            </p>

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

            <button 
              className={styles.addButton}
              onClick={handleSubmit}
              disabled={loading}
              style={{marginTop: '1rem', backgroundColor: '#28a745'}} // Green button for return
            >
              {loading ? 'Processing...' : 'Confirm Return'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnBookModal;