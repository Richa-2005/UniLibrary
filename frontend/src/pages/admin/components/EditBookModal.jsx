import React, { useState } from 'react';
import styles from './BookDetailModal.module.css'; 

const EditBookModal = ({ book, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    category: book.category || 'Academic',
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
      <div className={styles.modal} onClick={(e) => e.stopPropagation()} style={{ maxWidth: '800px' }}>
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
            <hr className={styles.divider} />
            
            <div className={styles.formSection}>
              
              <div className={styles.inputGroup}>
                <label>Category</label>
                <select name="category" value={formData.category} onChange={handleChange}>
                  <option value="Academic">Academic</option>
                  <option value="Novel">Novel / General</option>
                  <option value="Magazine">Magazine</option>
                </select>
              </div>

              {formData.category === 'Academic' && (
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
              )}

               <div className={styles.inputRow}>
                <div className={styles.inputGroup}>
                  <label>Total Copies</label>
                  <input name="totalCopies" type="number" min="1" value={formData.totalCopies} onChange={handleChange} />
                </div>
                <div className={styles.inputGroup}>
                  <label>Available</label>
                  <input name="availableCopies" type="number" min="0" max={formData.totalCopies} value={formData.availableCopies} onChange={handleChange} />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label>Book Price (₹)</label>
                <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
              </div>

              <button className={styles.addButton} onClick={handleSubmit} disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditBookModal;