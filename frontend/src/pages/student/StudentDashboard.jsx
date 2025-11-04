import React, { useState } from 'react';
import styles from './StudentDashboard.module.css';

// --- MOCK DATA FOR SCREENSHOTS ---
// 1. Results when a book IS found in the library
const libraryResults = [
  { id: 1, title: 'Introduction to Algorithms', author: 'CLRS', status: 'Available', semester: 5 },
  { id: 2, title: 'Operating System Concepts', author: 'Silberschatz', status: 'Available', semester: 4 },
  { id: 3, title: 'Database System Concepts', author: 'Korth', status: 'Checked Out', semester: 4 },
  { id: 4, title: 'Computer Networks', author: 'Tanenbaum', status: 'Available', semester: 5 },
];

// 2. Results when a book IS NOT found (external links)
const externalLinks = [
  { id: 1, title: 'Project Hail Mary by Andy Weir', link: 'https://www.google.com/books' },
  { id: 2, title: 'The Three-Body Problem by Cixin Liu', link: 'https://www.google.com/books' },
];
// --- END MOCK DATA ---


const StudentDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('algorithms'); // Pre-fill search
  
  // To show different states for screenshots, you can change this!
  // To show "Found": setResults(libraryResults) and setNotFound(false)
  // To show "Not Found": setResults([]) and setNotFound(true)
  const [results, setResults] = useState(null); // Pre-fill results
  const [notFound, setNotFound] = useState(false); // Start by showing results

  const handleSearch = (e) => {
    e.preventDefault();
    setNotFound(false);
    
    // --- Mock Search Logic ---
    if (searchTerm.toLowerCase().includes('algorithms')) {
      setResults(libraryResults); // Use the mock data we made
    } else if (searchTerm.toLowerCase().includes('martian')) {
      setResults([]);
      setNotFound(true);
    } else {
      setResults([]); // No matches found
    }
  };
  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <h1>Welcome, Student!</h1>
        <p>Search for books in your university library.</p>
      </header>

      <form className={styles.searchBar} onSubmit={handleSearch}>
        <input 
          type="text"
          placeholder="Search by title, author, or semester..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {/* --- This is the new "filter" section, just for looks --- */}
      <div className={styles.filterBar}>
        <strong>Filters:</strong>
        <button className={styles.filterButtonActive}>All</button>
        <button className={styles.filterButton}>Semester 5</button>
        <button className={styles.filterButton}>Semester 4</button>
        <button className={styles.filterButton}>Available Only</button>
      </div>

     <div className={styles.results}>
        {/* --- JSX LOGIC UPDATE --- */}

        {/* State 1: Before any search (NEW) */}
        {results === null && (
          <div className={styles.emptyState}>
            <h3>Find Your Next Book</h3>
            <p>Use the search bar above to find books by title, author, or semester.</p>
            {/* You could add an icon/image here */}
          </div>
        )}

        {/* State 2: Results are found */}
        {results && results.length > 0 && (
          <>
            <h2>Library Results</h2>
            {results.map(book => (
      <div key={book.id} className={styles.bookCard}>
        <div className={styles.bookInfo}>
          <h3>{book.title}</h3>
          <p>by {book.author}</p>
        </div>
        <div className={styles.bookStatus}>
          <span className={book.status === 'Available' ? styles.available : styles.notAvailable}>
            {book.status}
          </span>
          <span className={styles.semesterTag}>Sem {book.semester}</span>
        </div>
      </div>
    ))}
          </>
        )}

        {/* State 3: Book is not found (external links) */}
        {notFound && (
          <>
            <h2>Not in your library.</h2>
            <p>Here are some external links where you might find it:</p>
            {externalLinks.map(link => (
              <a key={link.id} href={link.link} target="_blank" rel="noopener noreferrer" className={styles.externalLink}>
                {link.title}
              </a>
            ))}
          </>
        )}
        
        {/* State 4: No results found */}
        {results && results.length === 0 && !notFound && (
           <div className={styles.noResults}>
             <h3>No results found.</h3>
             <p>Try searching for a different title or author.</p>
           </div>
        )}
        {/* --- END JSX LOGIC --- */}
      </div>
    </div>
  );
};

export default StudentDashboard;