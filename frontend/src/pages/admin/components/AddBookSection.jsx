import React, { useState } from 'react';
import api from '../../../services/api';
import styles from './AddBookSection.module.css';
import BookDetailModal from './BookDetailModal';

const AddBookSection = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedBook, setSelectedBook] = useState(null); // For Modal

  const [startIndex, setStartIndex] = useState(0); // Track how many we've loaded
  const [hasMore, setHasMore] = useState(true); // To hide button if no more results
  
  const fetchBooks = async (searchQuery, index, isNewSearch) => {
    setLoading(true);
    setError('');
    
    try {
      // Pass the startIndex to backend
      const response = await api.get(`/admin/search-books?q=${encodeURIComponent(searchQuery)}&startIndex=${index}`);
      const newBooks = response.data;

      if (isNewSearch) {
        setResults(newBooks); // Replace list
        // If we got fewer than 10, there are no more pages
        setHasMore(newBooks.length === 10); 
      } else {
        setResults(prev => [...prev, ...newBooks]); // Append to list
        setHasMore(newBooks.length === 10);
      }
    } catch (err) {
      // If it's a 404 on a "Load More", it just means end of list
      if (!isNewSearch && err.response && err.response.status === 404) {
         setHasMore(false);
      } else {
         console.error(err);
         setError('Failed to fetch books.');
      }
    } finally {
      setLoading(false);
    }
  };

  // 1. Initial Search
  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    // Reset everything
    setStartIndex(0);
    setHasMore(true);
    fetchBooks(query, 0, true); //true as this is first search
  };

  // 2. Load More Button Handler
  const handleLoadMore = () => {
    const nextIndex = startIndex + 10;
    setStartIndex(nextIndex);
    fetchBooks(query, nextIndex, false); // false = append into last search
  };


  // 2. Handle Add Book (Called from Modal)
  const handleAddBook = async (book, semester, year) => {
    try {
      await api.post('/admin/add-book', {
        googleBookId: book.googleBookId,
        semester,
        year
      });
      
      alert(`Success! "${book.title}" added to Semester ${semester}.`);
      setSelectedBook(null); // Close modal
      
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to add book.");
    }
  };

  return (
    <div className={styles.container}>
      
      
      <div className={`card ${styles.searchCard}`}>
        <h2>Add New Books</h2>
        {/* search bar */}
        <form onSubmit={handleSearch} className={styles.searchForm}>
          <input
            type="text"
            placeholder="Search by title, author, or ISBN..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={styles.searchInput}
          />
          <button type="submit" className={styles.searchButton} disabled={loading}>
            {loading ? 'Searching...' : 'Search Google Books'}
          </button>
        </form>
        {error && <p className={styles.error}>{error}</p>}
      </div>

     {/* book results */}
      <div className={styles.resultsGrid}>
        {results.map((book) => (
          <div 
            key={book.googleBookId} 
            className={styles.bookCard} 
            onClick={() => setSelectedBook(book)} // Open Modal for the selected book
          >
            <div className={styles.cardImageWrapper}>
              {book.thumbnail ? (
                <img src={book.thumbnail} alt={book.title} />
              ) : (
                <div className={styles.noImage}>No Image</div>
              )}
            </div>
            <div className={styles.cardInfo}>
              <h4>{book.title}</h4>
              <p>{book.authors}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State for search results*/}
      {!loading && results.length === 0 && !error && (
        <div className={styles.emptyState}>
          <p>Enter a search term to find books from the global library.</p>
        </div>
      )}
      {/* for more books */}
      {results.length > 0 && hasMore && (
        <div className={styles.loadMoreContainer}>
          <button 
            onClick={handleLoadMore} 
            className={styles.loadMoreButton}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Load More Books'}
          </button>
        </div>
      )}

      {/* The Detail Pop-up Modal */}
      {selectedBook && (
        <BookDetailModal 
          book={selectedBook} 
          onClose={() => setSelectedBook(null)} 
          onAdd={handleAddBook} 
        />
      )}
    </div>
  );
};

export default AddBookSection;