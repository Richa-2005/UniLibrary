import { useState } from 'react';
import styles from './BookDetailModal.module.css';

const BookDetailModal = ({ book, onClose, onAdd }) => {
  const [category, setCategory] = useState('Academic'); 
  const [semester, setSemester] = useState('');
  const [year, setYear] = useState('');
  const [adding, setAdding] = useState(false);

  const handleConfirm = async () => {
    setAdding(true);
    await onAdd(book, semester, year, category);
    setAdding(false);
  };

  if (!book) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()} style={{ maxWidth: '800px' }}>
        <button className={styles.closeButton} onClick={onClose}>&times;</button>
        
        <div className={styles.content}>
          <div className={styles.imageContainer}>
            {book.thumbnail ? (
              <img src={book.thumbnail} alt={book.title} className={styles.coverImage} />
            ) : (
              <div className={styles.placeholderImage}>No Cover</div>
            )}
          </div>

          <div className={styles.details}>
            <h2 className={styles.title}>{book.title}</h2>
            <p className={styles.author}>by {book.authors}</p>
            <p className={styles.isbn}>ISBN: {book.isbn}</p>
            
            <hr className={styles.divider} />
            
            <div className={styles.formSection}>
              <h3>Add to Inventory</h3>
              
              <div className={styles.inputGroup}>
                <label>Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option value="Academic">Academic (Subject Book)</option>
                  <option value="Novel">Novel / General Interest</option>
                  <option value="Magazine">Magazine / Journal</option>
                </select>
              </div>

              {category === 'Academic' && (
                <>
                  <p className={styles.instruction}>Assign specific semester and year.</p>
                  <div className={styles.inputRow}>
                    <div className={styles.inputGroup}>
                      <label>Semester</label>
                      <input 
                        type="number" min="1" max="8" placeholder="e.g. 5"
                        value={semester} onChange={(e) => setSemester(e.target.value)}
                      />
                    </div>
                    <div className={styles.inputGroup}>
                      <label>Year</label>
                      <input 
                        type="number" min="1" max="4" placeholder="e.g. 3"
                        value={year} onChange={(e) => setYear(e.target.value)}
                      />
                    </div>
                  </div>
                </>
              )}

              <button 
                className={styles.addButton} 
                onClick={handleConfirm}
                disabled={adding || (category === 'Academic' && (!semester || !year))}
              >
                {adding ? 'Adding...' : 'Confirm & Add'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailModal;