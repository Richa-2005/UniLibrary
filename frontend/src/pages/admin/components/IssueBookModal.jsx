import { useState } from 'react';
import styles from './Transactional.module.css'; 
import toast from 'react-hot-toast';

const IssueBookModal = ({ book, onClose, onConfirm }) => {
  const [rollNumber, setRollNumber] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!rollNumber || !dueDate) return toast.error("Please fill all fields");
    setLoading(true);
    await onConfirm(book.libraryEntryId, rollNumber, dueDate);
    setLoading(false);
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={`${styles.modalContainer} ${styles.modalSmall}`} onClick={e => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>&times;</button>
        
        <div className={styles.header}>
          <h2 className={styles.title}>Issue Book</h2>
          <p className={styles.subtitle}>{book.title}</p>
        </div>

        <div className={styles.body}>
          <div className={styles.inputGroup}>
            <label>Student Roll Number</label>
            <input type="text" value={rollNumber} onChange={e => setRollNumber(e.target.value)} placeholder="e.g. 2K23/CS/01" />
          </div>

          <div className={styles.inputGroup}>
            <label>Due Date</label>
            <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
          </div>

          <button className={styles.primaryBtn} onClick={handleSubmit} disabled={loading}>
            {loading ? 'Issuing...' : 'Confirm Issue'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default IssueBookModal;