import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import styles from './InventorySection.module.css';
import EditBookModal from './EditBookModal';
import IssueBookModal from './IssueBookModal';
import ReturnBookModal from './ReturnBookModal';
import ActiveBorrowersModal from './ActiveBorrowersModal';

const InventorySection = ({ onInventoryUpdate }) => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingBook, setEditingBook] = useState(null);

  const [issueModalBook, setIssueModalBook] = useState(null);
  const [returnModalBook, setReturnModalBook] = useState(null);

  // 1. Fetch Books
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

  // 2. Search Filter
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

  // 3. Handle Delete
  const handleDelete = async (book) => {
    // CHECK 1: Are all copies accounted for?
    if (book.availableCopies !== book.totalCopies) {
      alert(
        `Cannot delete "${book.title}".\n\n` +
        `You have ${book.totalCopies - book.availableCopies} cop(ies) currently issued or missing.\n` +
        `All copies must be returned/available before deleting a book entry.`
      );
      return; 
    }

    // CHECK 2: Confirmation
    if (!window.confirm(`Are you sure you want to remove "${book.title}" from your library?`)) return;

    try {
      await api.delete(`/admin/my-books/${book.libraryEntryId}`);
      
     
      const updatedList = books.filter(b => b.libraryEntryId !== book.libraryEntryId);
      setBooks(updatedList);
      setFilteredBooks(updatedList);
      if (onInventoryUpdate) onInventoryUpdate();
      alert('Book removed.');
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to delete book.');
    }
  };

  // 4. Handle Full Update (Modal)
  const handleSaveUpdate = async (id, updatedData) => {
    try {
      await api.put(`/admin/my-books/${id}`, updatedData);
      setEditingBook(null);
      loadBooks(); 
      if (onInventoryUpdate) onInventoryUpdate();
    } catch (error) {
      console.error(error);
      alert('Failed to update book.');
    }
  };

 
  const [activeBorrowersModalBook, setActiveBorrowersModalBook] = useState(null); // Rename returnModalBook to this


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
      alert("Book Returned Successfully!");
      setReturnModalBook(null);
      if (onInventoryUpdate) onInventoryUpdate();
      loadBooks();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to return book.");
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
      alert("Book Issued Successfully!");
      setIssueModalBook(null);
      if (onInventoryUpdate) onInventoryUpdate();
      loadBooks();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to issue book.");
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
                // Determine Status Logic
                const isAvailable = book.availableCopies > 0;
                
                return (
                  <tr key={book.libraryEntryId}>
                    <td className={styles.titleCol}>
                      <strong>{book.title}</strong>
                      <span>{book.author}</span>
                    </td>
                    
                    <td>
                      <div className={styles.tagGroup}>
                        <span className={styles.tag}>S{book.semester}</span>
                        <span className={styles.tag}>Y{book.year}</span>
                      </div>
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