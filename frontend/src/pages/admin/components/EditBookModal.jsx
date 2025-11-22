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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setSaving(true);
    await onSave(book.libraryEntryId, formData);
    setSaving(false);
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>&times;</button>
        
        <div className={styles.content}>
          {/* Image (Read Only) */}
          <div className={styles.imageContainer}>
            {book.metadata?.imageLinks?.thumbnail ? (
              <img src={book.metadata.imageLinks.thumbnail} alt={book.title} className={styles.coverImage} />
            ) : (
              <div className={styles.placeholderImage}>No Cover</div>
            )}
          </div>

          {/* Form Section */}
          <div className={styles.details}>
            <h2 className={styles.title}>Edit Book Details</h2>
            <p className={styles.author}>{book.title}</p>
            <hr className={styles.divider} />
            
            <div className={styles.formSection}>
              
              {/* Row 1: Academic Info */}
              <div className={styles.inputRow}>
                <div className={styles.inputGroup}>
                  <label>Semester</label>
                  <input 
                    name="semester"
                    type="number" 
                    value={formData.semester}
                    onChange={handleChange}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>Year</label>
                  <input 
                    name="year"
                    type="number" 
                    value={formData.year}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Row 2: Inventory Info */}
              <div className={styles.inputRow}>
                <div className={styles.inputGroup}>
                  <label>Total Copies</label>
                  <input 
                    name="totalCopies"
                    type="number" 
                    min="1"
                    value={formData.totalCopies}
                    onChange={handleChange}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>Available Copies</label>
                  <input 
                    name="availableCopies"
                    type="number" 
                    min="0"
                    max={formData.totalCopies} // Can't have more avail than total
                    value={formData.availableCopies}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <button 
                className={styles.addButton} 
                onClick={handleSubmit}
                disabled={saving}
              >
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