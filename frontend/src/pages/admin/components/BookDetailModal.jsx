import React, { useState } from 'react';
import styles from './BookDetailModal.module.css';

const BookDetailModal = ({ book, onClose, onAdd }) => {
  // State for the specific inventory details admin needs to add
  const [semester, setSemester] = useState('');
  const [year, setYear] = useState('');
  const [adding, setAdding] = useState(false);

  const handleConfirm = async () => {
    setAdding(true);
    // Pass the extra data back to the parent component
    await onAdd(book, semester, year);
    setAdding(false);
  };

  if (!book) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      {/* Stop click from closing when clicking inside the modal */}
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        
        <button className={styles.closeButton} onClick={onClose}>&times;</button>
        
        <div className={styles.content}>
          {/* Left: Image */}
          <div className={styles.imageContainer}>
            {book.thumbnail ? (
              <img src={book.thumbnail} alt={book.title} className={styles.coverImage} />
            ) : (
              <div className={styles.placeholderImage}>No Cover</div>
            )}
          </div>

          {/* Right: Details & Form */}
          <div className={styles.details}>
            <h2 className={styles.title}>{book.title}</h2>
            <p className={styles.author}>by {book.authors}</p>
            <p className={styles.isbn}>ISBN: {book.isbn}</p>
            
            <hr className={styles.divider} />
            
            <div className={styles.formSection}>
              <h3>Add to Library Inventory</h3>
              <p className={styles.instruction}>Assign this book to a specific semester and year.</p>
              
              <div className={styles.inputRow}>
                <div className={styles.inputGroup}>
                  <label>Semester</label>
                  <input 
                    type="number" 
                    min="1" 
                    max="8" 
                    placeholder="e.g. 5"
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>Academic Year</label>
                  <input 
                    type="number" 
                    min="1" 
                    max="4" 
                    placeholder="e.g. 3"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                  />
                </div>
              </div>

              <button 
                className={styles.addButton} 
                onClick={handleConfirm}
                disabled={adding || !semester}
              >
                {adding ? 'Adding...' : 'Confirm & Add to Library'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailModal;