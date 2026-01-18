import { useState } from 'react';
import styles from './BookDetailModal.module.css'; 
import toast from 'react-hot-toast';

const ReturnBookModal = ({ book, onClose, onConfirm }) => {
  const [rollNumber, setRollNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!rollNumber) return toast.error("Please enter Roll Number");
    setLoading(true);
    await onConfirm(book.libraryEntryId, rollNumber);
    setLoading(false);
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={`${styles.modal} ${styles.modalSm}`} onClick={e => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>&times;</button>
        <div style={{ padding: '2.5rem' }}>
          <h2 className={styles.title}>Return Book</h2>
          <p className={styles.author}>{book.title}</p>
          <hr className={styles.divider} />
          <div className={styles.inputGroup}>
            <label>Student Roll Number</label>
            <input type="text" value={rollNumber} onChange={e => setRollNumber(e.target.value)} placeholder="e.g. 2K23/CS/01" />
          </div>
          <button className={styles.addButton} onClick={handleSubmit} disabled={loading}>
            {loading ? 'Processing...' : 'Confirm Return'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReturnBookModal;