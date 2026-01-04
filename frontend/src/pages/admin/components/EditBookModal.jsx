import React, { useState } from 'react';
import styles from './BookDetailModal.module.css'; 

const EditBookModal = ({ book, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    semester: book.semester || '',
    year: book.year || '',
    totalCopies: book.totalCopies || 1,
    availableCopies: book.availableCopies || 1,
  });
  const [saving, setSaving] = useState(false);
  const [price, setPrice] = useState(book.price || 0);
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setSaving(true);
    await onSave(book.libraryEntryId, { ...formData, price }); 
    setSaving(false);
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>&times;</button>
        
        <div className={styles.content}>
          <div className={styles.imageContainer}>
            {book.metadata?.imageLinks?.thumbnail ? (
              <img src={book.metadata.imageLinks.thumbnail} alt={book.title} className={styles.coverImage} />
            ) : (
              <div className={styles.placeholderImage}>No Cover</div>
            )}
          </div>

          <div className={styles.details}>
            <h2 className={styles.title}>Edit Book Details</h2>
            <p className={styles.author}>{book.title}</p>
            <hr className={styles.divider} />
            
            <div className={styles.formSection}>
              
              <div className={styles.inputRow}>
                <div className={styles.inputGroup}>
                  <label>Semester</label>
                  <input name="semester" type="number" value={formData.semester} onChange={handleChange} />
                </div>
                <div className={styles.inputGroup}>
                  <label>Year</label>
                  <input name="year" type="number" value={formData.year} onChange={handleChange} />
                </div>
              </div>

              <div className={styles.inputRow}>
                <div className={styles.inputGroup}>
                  <label>Total Copies</label>
                  <input name="totalCopies" type="number" min="1" value={formData.totalCopies} onChange={handleChange} />
                </div>
                <div className={styles.inputGroup}>
                  <label>Available Copies</label>
                  <input name="availableCopies" type="number" min="0" max={formData.totalCopies} value={formData.availableCopies} onChange={handleChange} />
                </div>
              </div>

             
              <div className={styles.inputRow}>
                <div className={styles.inputGroup} style={{width: '100%'}}>
                  <label>Book Price (₹)</label>
                  <input 
                    type="number" 
                    min="0"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    style={{ border: '1px solid var(--primary-color)' }}
                  />
                  <small style={{color: '#666', fontSize:'0.8rem'}}>Used for Lost/Damaged calculations</small>
                </div>
              </div>
            

              <button className={styles.addButton} onClick={handleSubmit} disabled={saving}>
                {saving ? 'Saving Changes...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditBookModal;