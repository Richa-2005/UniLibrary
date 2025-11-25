import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import styles from '../admin/components/AddBookSection.module.css'; 
import StudentBookDetailModal from './StudentBookDetailModal';

const StudentDashboard = () => {
  const [query, setQuery] = useState('');
  
  const [localResults, setLocalResults] = useState([]);
  const [externalResults, setExternalResults] = useState([]); 
  
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  
  const [selectedBook, setSelectedBook] = useState(null);
  const [semesterFilter, setSemesterFilter] = useState('All');

  // Combined Fetch Function
  const fetchBooks = useCallback(async () => {
    setLoading(true);
    setLocalResults([]);
    setExternalResults([]);
    
    try {
      // 1. Search Local Library
      const response = await api.get(`/student/search?q=${encodeURIComponent(query)}&semester=${semesterFilter}`);
      setLocalResults(response.data);

      // 2. If NO local results , external link
      if (response.data.length === 0 && query.trim() !== '') {
        const extResponse = await api.get(`/student/external-search?q=${encodeURIComponent(query)}`);
        setExternalResults(extResponse.data);
      }

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [query, semesterFilter]);

  useEffect(() => {
    fetchBooks();
  }, [semesterFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if(!query.trim()) return;
    setSearched(true);
    fetchBooks();
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1rem' }}>
      
      {/* Header Section */}
      <div style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <h1 style={{ color: 'var(--primary-color)', margin: 0 }}>Student Library</h1>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', background: 'var(--surface-color)', padding: '1rem', borderRadius: '8px', boxShadow: 'var(--shadow)', flexWrap: 'wrap' }}>
          <form onSubmit={handleSearchSubmit} style={{ flex: 1, display: 'flex', gap: '0.5rem', minWidth: '300px' }}>
            <input 
              type="text" 
              placeholder="Search by Title, Author..." 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{ flex: 1, padding: '0.8rem', borderRadius: '6px', border: '1px solid #ccc', outline: 'none' }}
            />
            <button type="submit" style={{ padding: '0 1.5rem', background: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Search</button>
          </form>
          <div style={{ marginLeft: 'auto' }}>
            <select 
              value={semesterFilter}
              onChange={(e) => setSemesterFilter(e.target.value)}
              style={{ padding: '0.8rem 1rem', borderRadius: '6px', border: '1px solid var(--border-color)', outline: 'none', color: 'var(--text-color)', fontWeight: '600', cursor: 'pointer' }}
            >
              <option value="All">All Semesters</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                <option key={sem} value={sem}>Semester {sem}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div>
        {loading && (
          <p style={{ textAlign: 'center', color: '#666', marginTop: '3rem' }}>Searching library resources...</p>
        )}

        {/* SCENARIO 1: Local Books Found */}
        {!loading && localResults.length > 0 && (
          <div className={styles.resultsGrid}>
            {localResults.map((book) => (
              <div 
                key={book.libraryEntryId} 
                className={styles.bookCard}
                onClick={() => setSelectedBook(book)}
                style={{ cursor: 'pointer' }}
              >
                <div className={styles.cardImageWrapper}>
                  {book.thumbnail ? <img src={book.thumbnail} alt={book.title} /> : <div className={styles.noImage}>No Image</div>}
                </div>
                <div className={styles.cardInfo}>
                  <h4>{book.title}</h4>
                  <p>{book.author}</p>
                  <div style={{ marginTop: '0.5rem' }}>
                     <span style={{ fontSize: '0.75rem', color: '#666', background: '#eee', padding: '2px 6px', borderRadius: '4px' }}>
                       Sem {book.semester}
                     </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* SCENARIO 2: No Local, But External Found */}
        {!loading && localResults.length === 0 && externalResults.length > 0 && (
          <div style={{ animation: 'fadeIn 0.5s' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem', color: '#666' }}>
              <h3 style={{ color: 'var(--primary-color)' }}>Not in Library</h3>
              <p>We couldn't find "{query}" in the university catalog, but here are online resources:</p>
            </div>

            <div className={styles.resultsGrid}>
              {externalResults.map((book) => (
                <div 
                  key={book.googleId} 
                  className={styles.bookCard}
                  style={{ border: '1px solid var(--accent-color)' }} // Highlight external
                >
                  <div className={styles.cardImageWrapper}>
                    {book.thumbnail ? <img src={book.thumbnail} alt={book.title} /> : <div className={styles.noImage}>No Image</div>}
                  </div>
                  <div className={styles.cardInfo}>
                    <h4>{book.title}</h4>
                    <p>{book.author}</p>
                    
                    {/* View E-Book Button */}
                    <a 
                      href={book.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{
                        display: 'block',
                        marginTop: '1rem',
                        textAlign: 'center',
                        padding: '0.5rem',
                        backgroundColor: 'var(--accent-color)',
                        color: 'white',
                        textDecoration: 'none',
                        borderRadius: '4px',
                        fontSize: '0.85rem',
                        fontWeight: 'bold'
                      }}
                    >
                      View E-Book / Info ↗
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SCENARIO 3: Absolutely Nothing Found */}
        {searched && !loading && localResults.length === 0 && externalResults.length === 0 && (
          <div style={{ textAlign: 'center', color: '#888', marginTop: '3rem', padding: '2rem', border: '2px dashed #ccc', borderRadius: '10px' }}>
            <h3>No results found anywhere.</h3>
            <p>Try checking your spelling or searching for a more general topic.</p>
          </div>
        )}
      </div>

      {/* Modal for Local Books */}
      {selectedBook && (
        <StudentBookDetailModal 
          book={selectedBook} 
          onClose={() => setSelectedBook(null)} 
        />
      )}

    </div>
  );
};

export default StudentDashboard;