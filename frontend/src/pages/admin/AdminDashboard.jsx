import React, { useState } from 'react';
import styles from './AdminDashboard.module.css';

// --- MOCK DATA FOR SCREENSHOTS ---
// 1. Fake results from searching the Google Books API
const mockApiResults = [
  { id: 'abc', title: 'Data Structures and Algorithms', author: 'A. Aho, J. Ullman' },
  { id: 'def', title: 'Data Structures and Algorithms in Java', author: 'M. Goodrich' },
  { id: 'ghi', title: 'Data Structures Using C and C++', author: 'Langsam, Augenstein' },
];

// 2. Fake list of books the admin already has in their library
const mockOwnedBooks = [
  { id: 1, title: 'Introduction to Algorithms', author: 'CLRS', semester: 5 },
  { id: 2, title: 'Operating System Concepts', author: 'Silberschatz', semester: 4 },
  { id: 3, title: 'Database System Concepts', author: 'Korth', semester: 4 },
  { id: 4, title: 'Artificial Intelligence: A Modern Approach', author: 'Russell, Norvig', semester: 6 },
  { id: 5, title: 'Design Patterns: Elements of Reusable O-O Software', author: 'Gamma et al.', semester: 6 },
  { id: 6, title: 'Computer Networks', author: 'Tanenbaum', semester: 5 },
];
// --- END MOCK DATA ---

const AdminDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('Data Structures'); // Pre-fill search
  const [apiResults, setApiResults] = useState(mockApiResults); // Pre-fill results
  const [ownedBooks, setOwnedBooks] = useState(mockOwnedBooks); // Pre-fill inventory
  
  const [showToast, setShowToast] = useState(false); // <-- ADD THIS
  const [toastMessage, setToastMessage] = useState(''); // <-- ADD THIS

  const handleSearchAPI = (e) => {
    e.preventDefault();
    // Just for show
    setApiResults(mockApiResults);
  };
  
 const handleAddBook = (bookToAdd) => {
    // 1. Creates the new book object
    const newBook = {
      ...bookToAdd,      // <-- This spreads the 'id', 'title', AND 'author' from the API result
      id: Math.random(), // <-- Gives it a new unique ID for the list
      semester: 1         // <-- ADDS THE SEMESTER (hardcoded to 1 for the demo)
    };

    // 2. Adds the new book to the top of your inventory list
    setOwnedBooks([newBook, ...ownedBooks]);
    
    // 3. Clears the API results and shows the success toast
    setApiResults([]);
    setSearchTerm('');
    setToastMessage(`"${bookToAdd.title}" was added to the library!`);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  return (
    <div className={styles.dashboard}>
      {showToast && (
        <div className={styles.toast}>
          {toastMessage}
        </div>
      )}
      <h1>Admin Dashboard</h1>
      
      {/* Section 1: Add New Book (looks like a search just happened) */}
      <div className={styles.card}>
        <h2>Add Book to Library</h2>
        <form className={styles.searchBar} onSubmit={handleSearchAPI}>
          <input 
            type="text"
            placeholder="Search external API (e.g., Google Books)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit">Search API</button>
        </form>

        <div className={styles.apiResults}>
          <h3>API Search Results for "{searchTerm}"</h3>
          {apiResults.map(book => (
            <div key={book.id} className={styles.apiResult}>
              <div>
                <h4>{book.title}</h4>
                <p>by {book.author}</p>
              </div>
              <button onClick={() => handleAddBook(book)} className={styles.addButton}>
                + Add to Library
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Section 2: Current Library Inventory (looks full) */}
      <div className={styles.card}>
        <h2>Current Library Inventory ({ownedBooks.length} books)</h2>
        <div className={styles.ownedList}>
          {ownedBooks.map(book => (
            <div key={book.id} className={styles.ownedBook}>
              <h4>{book.title}</h4>
              <p>by {book.author}</p>
              <span>Semester: {book.semester}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;