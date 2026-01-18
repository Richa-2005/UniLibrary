import { useState, useEffect } from 'react';
import api from '../../../services/api';
import styles from './InventorySection.module.css';
import EditBookModal from './EditBookModal';
import IssueBookModal from './IssueBookModal';
import ActiveBorrowersModal from './ActiveBorrowersModal';
import toast from 'react-hot-toast';

const InventorySection = ({ onInventoryUpdate }) => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingBook, setEditingBook] = useState(null);

  const [issueModalBook, setIssueModalBook] = useState(null);
  const [returnModalBook, setReturnModalBook] = useState(null);

  // Fetch Books
  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/my-books');
      setBooks(response.data);
      setFilteredBooks(response.data);
    } catch (error) {
      console.error('Failed to fetch inventory', error);
    } finally {
      setLoading(false);
    }
  };

  // Search Filter
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = books.filter(book => 
      book.title.toLowerCase().includes(query) ||
      book.author.toLowerCase().includes(query) ||
      (book.isbn && book.isbn.includes(query))
    );
    setFilteredBooks(filtered);
  };

  // Handle Delete
  const handleDelete = (book) => {
   
    if (book.availableCopies !== book.totalCopies) {
      toast.error(
        `Cannot delete "${book.title}".\n\n` +
        `You have ${book.totalCopies - book.availableCopies} cop(ies) currently issued or missing.\n` +
        `All copies must be returned/available before deleting a book entry.`
      );
      return; 
    }


   toast((t) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <p style={{ margin: 0, fontWeight: 500 }}>
        Delete <b>"{book.title}"</b>?
      </p>
      <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
        
        <button 
          onClick={() => toast.dismiss(t.id)}
          style={{ 
            padding: '6px 12px', 
            border: '1px solid #ccc', 
            borderRadius: '4px', 
            background: 'white', 
            cursor: 'pointer' 
          }}
        >
          Cancel
        </button>

      
        <button 
          onClick={() => {
            performDelete(book); // Call the actual delete function
            toast.dismiss(t.id); // Close the toast
          }}
          style={{ 
            padding: '6px 12px', 
            border: 'none', 
            borderRadius: '4px', 
            background: '#ef4444', 
            color: 'white', 
            cursor: 'pointer' 
          }}
        >
          Delete
        </button>
      </div>
    </div>
  ), {
    duration: 5000,
    position: 'top-center',
    style: {
      border: '1px solid #ef4444',
      padding: '16px',
    },
  });
};

    
    const performDelete = async (book) => {
      try {
        await api.delete(`/admin/my-books/${book.libraryEntryId}`);
        
        const updatedList = books.filter(b => b.libraryEntryId !== book.libraryEntryId);
        setBooks(updatedList);
        setFilteredBooks(updatedList);
        if (onInventoryUpdate) onInventoryUpdate();
        
        toast.success('Book removed successfully');
      } catch (error) {
        toast.error(error.response?.data?.error || 'Failed to delete book.');
      }
    };

  
  const handleSaveUpdate = async (id, updatedData) => {
    try {
      await api.put(`/admin/my-books/${id}`, updatedData);
      setEditingBook(null);
      loadBooks(); 
      if (onInventoryUpdate) onInventoryUpdate();
    } catch (error) {
      console.error(error);
      toast.error('Failed to update book.');
    }
  };

 
  const [activeBorrowersModalBook, setActiveBorrowersModalBook] = useState(null); 


const handleStockClick = (book, change) => {
  if (change === -1) {
 
    setIssueModalBook(book);
  } else {
   
    setActiveBorrowersModalBook(book); 
  }
};

  const handleReturnConfirm = async (entryId, rollNumber) => {
    try {
      await api.post('/admin/return-book', {
        libraryEntryId: entryId,
        rollNumber
      });
      toast.success("Book Returned Successfully!");
      setReturnModalBook(null);
      if (onInventoryUpdate) onInventoryUpdate();
      loadBooks();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to return book.");
    }
  };

  // Handle Modal Confirm
  const handleIssueConfirm = async (entryId, rollNumber, dueDate) => {
    try {
      await api.post('/admin/issue-book', {
        libraryEntryId: entryId,
        rollNumber,
        dueDate
      });
      toast.success("Book Issued Successfully!");
      setIssueModalBook(null);
      if (onInventoryUpdate) onInventoryUpdate();
      loadBooks();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to issue book.");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.controls}>
        <h2>Current Inventory <span className={styles.countBadge}>{books.length}</span></h2>
        <input 
          type="text" 
          placeholder="Filter by title, author, or ISBN..." 
          value={searchQuery}
          onChange={handleSearch}
          className={styles.searchBar}
        />
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Title / Author</th>
              <th>Sem / Year</th>
              <th className={styles.center}>Availability & Status</th>
              <th className={styles.center}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="4" className={styles.loading}>Loading...</td></tr>
            ) : filteredBooks.length === 0 ? (
              <tr><td colSpan="4" className={styles.empty}>No books match.</td></tr>
            ) : (
              filteredBooks.map((book) => {
                const isAvailable = book.availableCopies > 0;
                
                // Check category to decide what to show in the 2nd column
                const isAcademic = book.category === 'Academic' || !book.category;

                return (
                  <tr key={book.libraryEntryId}>
                    <td className={styles.titleCol}>
                      <strong>{book.title}</strong>
                      <span>{book.author}</span>
                    </td>
                    
                    <td>
                      {isAcademic ? (
                        <div className={styles.tagGroup}>
                          <span className={styles.tag}>S{book.semester}</span>
                          <span className={styles.tag}>Y{book.year}</span>
                        </div>
                      ) : (
                        <span className={styles.tag} style={{ background: '#e0f2fe', color: '#0369a1' }}>
                          {book.category}
                        </span>
                      )}
                    </td>

                   
                    <td className={styles.center}>
                      <div className={styles.stockControl}>
                        {/* Status Badge */}
                        <span className={isAvailable ? styles.statusBadgeGreen : styles.statusBadgeRed}>
                          {isAvailable ? 'Available' : 'Out of Stock'}
                        </span>

                        {/* Buttons */}
                        <div className={styles.buttonGroup}>
                          <button 
                            className={styles.stockBtn} 
                            onClick={() => handleStockClick(book, -1)}
                            disabled={book.availableCopies === 0}
                            title="Issue Book (Reduce Count)"
                          >
                            -
                          </button>
                          
                          <span className={styles.stockCount}>
                            {book.availableCopies} / {book.totalCopies}
                          </span>

                          <button 
                            className={styles.stockBtn} 
                            onClick={() => handleStockClick(book, 1)}
                            disabled={book.availableCopies >= book.totalCopies}
                            title="Return Book (Increase Count)"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </td>
                   

                    <td className={styles.center}>
                      <button className={styles.editBtn} onClick={() => setEditingBook(book)}>
                        Edit
                      </button>
                      <button className={styles.deleteBtn} onClick={() => handleDelete(book)}>
                        &times;
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {editingBook && (
        <EditBookModal 
          book={editingBook} 
          onClose={() => setEditingBook(null)} 
          onSave={handleSaveUpdate}
        />
      )}
      
      {issueModalBook && (
        <IssueBookModal 
          book={issueModalBook}
          onClose={() => setIssueModalBook(null)}
          onConfirm={handleIssueConfirm}
        />
      )}
      {activeBorrowersModalBook && (
        <ActiveBorrowersModal 
          book={activeBorrowersModalBook}
          onClose={() => setActiveBorrowersModalBook(null)}
          onReturnSuccess={(shouldClose = true) => {
            loadBooks();
            if (onInventoryUpdate) onInventoryUpdate();
            if (shouldClose) setActiveBorrowersModalBook(null);
          }}
        />
      )}
    </div>
  );
};

export default InventorySection;