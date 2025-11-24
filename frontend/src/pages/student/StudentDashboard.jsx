import React, { useState,useCallback,useEffect } from 'react';
import api from '../../services/api';
import styles from '../admin/components/AddBookSection.module.css'; 
import StudentBookDetailModal from './StudentBookDetailModal';

const StudentDashboard = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false); // To show "No results" only after searching
  
  const [selectedBook, setSelectedBook] = useState(null); // For Modal
  const [semesterFilter, setSemesterFilter] = useState('All'); // For Filtering

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    try {
      // Send both query and semester to backend
      const response = await api.get(`/student/search?q=${encodeURIComponent(query)}&semester=${semesterFilter}`);
      setResults(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [query, semesterFilter]);

  useEffect(() => {
    // Only fetch automatically if we have a filter OR it's the first load
    // If you want it to load EVERYTHING on start, remove the condition.
    fetchBooks();
  }, [semesterFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchBooks();
  };

  const filteredResults = results.filter(book => {
    if (semesterFilter === 'All') return true;
    return book.semester.toString() === semesterFilter;
  });

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* 1. Welcome / Search Header */}
      <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
        <h1 style={{ color: 'var(--primary-color)', marginTop: 0 }}>Find Your Next Book</h1>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', maxWidth: '600px', margin: '1rem auto', gap: '1rem' }}>
          <input 
            type="text" 
            placeholder="Search by Title, Author, or ISBN..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ flex: 1, padding: '0.8rem', borderRadius: '8px', border: '1px solid #ccc' }}
          />
          <button 
            type="submit" 
            style={{ padding: '0.8rem 2rem', background: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
            disabled={loading}
          >
            {loading ? '...' : 'Search'}
          </button>
        </form>
      </div>

      {/* 2. Results Area */}
      <div>
        {/* FILTER DROPDOWN */}
        <select 
              value={semesterFilter}
              onChange={(e) => setSemesterFilter(e.target.value)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                border: '1px solid var(--primary-color)',
                outline: 'none',
                color: 'var(--text-color)',
                fontWeight: '500',
                marginBottom: '1rem'
              }}
            >
              <option value="All">All Semesters</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                <option key={sem} value={sem}>Semester {sem}</option>
              ))}
            </select>

        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          marginBottom: '1rem',
          minWidth: '100px' 
        }}>
          {results.length > 0 && <h2 style={{ color: 'var(--text-color)', margin: 0 }}>Search Results</h2> } <br/> 

        </div>
        
        <div className={styles.resultsGrid}>
          {filteredResults.map((book) => (
            <div 
              key={book.libraryEntryId} 
              className={styles.bookCard} 
              onClick={() => setSelectedBook(book)} 
              style={{ cursor: 'pointer' }}
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
                <p>{book.author}</p>
                
                {/* Availability Badge */}
                <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                   <span style={{ 
                     fontSize: '0.8rem', 
                     fontWeight: 'bold', 
                     color: book.status === 'Available' ? '#155724' : '#721c24',
                     backgroundColor: book.status === 'Available' ? '#d4edda' : '#f8d7da',
                     padding: '2px 8px',
                     borderRadius: '10px'
                   }}>
                     {book.status}
                   </span>
                   <span style={{ fontSize: '0.75rem', color: '#666' }}>
                     Sem {book.semester}
                   </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {results.length > 0 && filteredResults.length === 0 && (
           <div style={{ textAlign: 'center', color: '#888', marginTop: '2rem' }}>
             <p>No books found for <strong>Semester {semesterFilter}</strong>.</p>
           </div>
        )}

        {/* Empty State */}
       {searched && !loading && results.length === 0 && (
          <div style={{ textAlign: 'center', color: '#888', marginTop: '2rem' }}>
            <h3>No books found in the library.</h3>
            <p>Try searching for a different title.</p>
          </div>
        )}
      </div>

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