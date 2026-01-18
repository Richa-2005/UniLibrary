import styles from './StudentBookDetailModal.module.css';

const StudentBookDetailModal = ({ book, onClose }) => {
  if (!book) return null;
  const meta = book.metadata || {};

  const cleanDescription = (desc) => {
    if (!desc) return 'No description available.';
    return desc.replace(/<[^>]+>/g, '');
  };

  const isAcademic = !book.category || book.category === 'Academic';

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        
        <button className={styles.closeButton} onClick={onClose}>&times;</button>
        
        <div className={styles.content}>
          {/* Left : Image */}
          <div className={styles.imageCol}>
            <div className={styles.imageWrapper}>
              {book.thumbnail ? (
                <img src={book.thumbnail} alt={book.title} />
              ) : (
                <div className={styles.placeholder}>No Cover</div>
              )}
            </div>
          </div>

          {/* Right : Info */}
          <div className={styles.infoCol}>
            
            {/* Header Area */}
            <div className={styles.headerArea}>
              <h2 className={styles.title}>{book.title}</h2>
              <p className={styles.author}>by {book.author}</p>
              
              <div className={styles.badgeRow}>
                
                {/* status, category */}
                {isAcademic ? (
                  <>
                    <span className={styles.semBadge}>Semester {book.semester}</span>
                    <span className={styles.yearBadge}>Year {book.year}</span>
                  </>
                ) : (
                  <span className={styles.semBadge} style={{ background: '#e0f2fe', color: '#0369a1' }}>
                    {book.category}
                  </span>
                )}
                
                <span className={book.status === 'Available' ? styles.statusAvailable : styles.statusOut}>
                  {book.status}
                </span>
              </div>
            </div>

            <hr className={styles.divider} />

            {/* Description */}
            <div className={styles.descriptionArea}>
              <p>{cleanDescription(meta.description)}</p>
            </div>

            {/* Footer Details */}
            <div className={styles.footerGrid}>
              <div>
                <label>Publisher</label>
                <span>{meta.publisher || 'Unknown'}</span>
              </div>
              <div>
                <label>Pages</label>
                <span>{meta.pageCount || '-'}</span>
              </div>
              <div>
                <label>ISBN</label>
                <span className={styles.isbn}>{book.isbn || '-'}</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentBookDetailModal;