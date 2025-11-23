import React, { useState } from 'react';
import api from '../../services/api';
import styles from '../admin/components/AddBookSection.module.css'; // Re-use Admin styles for cards!

const StudentDashboard = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false); // To show "No results" only after searching

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setSearched(true);
    try {
      // Call our new Student Search API
      const response = await api.get(`/student/search?q=${encodeURIComponent(query)}`);
      setResults(response.data);
    } catch (error) {
      console.error(error);
      alert("Search failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* 1. Welcome / Search Header */}
      <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
        <h1 style={{ color: 'var(--primary-color)', marginTop: 0 }}>Find Your Next Book</h1>
        <form onSubmit={handleSearch} style={{ display: 'flex', maxWidth: '600px', margin: '1rem auto', gap: '1rem' }}>
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
        {results.length > 0 && <h2 style={{ color: 'var(--text-color)' }}>Search Results</h2>}
        
        <div className={styles.resultsGrid}>
          {results.map((book) => (
            <div key={book.libraryEntryId} className={styles.bookCard}>
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

        {/* Empty State */}
        {searched && !loading && results.length === 0 && (
          <div style={{ textAlign: 'center', color: '#888', marginTop: '2rem' }}>
            <h3>No books found in the library.</h3>
            {/* Fallback Link Logic would go here */}
            <p>Try searching for a different title.</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default StudentDashboard;