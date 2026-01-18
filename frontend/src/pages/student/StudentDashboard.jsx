import { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import styles from './StudentDashboard.module.css';
import StudentBookDetailModal from './StudentBookDetailModal';

const StudentDashboard = () => {
  const [query, setQuery] = useState('');
  const [localResults, setLocalResults] = useState([]);
  const [externalResults, setExternalResults] = useState([]); 
  
  const [loadingLocal, setLoadingLocal] = useState(true); 
  const [loadingExternal, setLoadingExternal] = useState(false);
  
  const [selectedBook, setSelectedBook] = useState(null);

 
  const [categoryFilter, setCategoryFilter] = useState('All'); 
  const [semesterFilter, setSemesterFilter] = useState('All');

  // search university library
  const fetchLocalBooks = useCallback( async () => {
    setLoadingLocal(true);
    setExternalResults([]); 
    
    try {
      let url = `/student/search?q=${encodeURIComponent(query)}`;
      
      if (categoryFilter !== 'All') url += `&category=${categoryFilter}`;
      
      if (semesterFilter !== 'All' && (categoryFilter === 'All' || categoryFilter === 'Academic')) {
        url += `&semester=${semesterFilter}`;
      }

      const response = await api.get(url);
      setLocalResults(response.data);

    } catch (error) {
      console.error(error);
    } finally {
      setLoadingLocal(false);
    }
  }, [query, semesterFilter, categoryFilter]); 

  // search external sources
  const handleExternalSearch = async () => {
    setLoadingExternal(true);
    try {
      const extResponse = await api.get(`/student/external-search?q=${encodeURIComponent(query)}`);
      setExternalResults(extResponse.data);
    } catch (error) {
      console.error("External search failed", error);
    } finally {
      setLoadingExternal(false);
    }
  };

  useEffect(() => {
    fetchLocalBooks();
  }, [semesterFilter, categoryFilter]); 

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchLocalBooks();
  };

  return (
    <div className={styles.container}>
      
     
      <div className={styles.headerWrapper}>
        <h1 className={styles.pageTitle}>Student Library</h1>
        
        <div className={styles.controlsCard}>
          <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
            <input 
              type="text" 
              placeholder="Search by Title, Author..." 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className={styles.searchInput}
            />
            <button type="submit" className={styles.searchButton}>Search</button>
          </form>

          <div className={styles.filterGroup}>
            <select 
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                if(e.target.value !== 'Academic' && e.target.value !== 'All') {
                    setSemesterFilter('All');
                }
              }}
              className={styles.selectInput}
            >
              <option value="All">All Categories</option>
              <option value="Academic">Academic</option>
              <option value="Novel">Novels / General</option>
              <option value="Magazine">Magazine</option>
            </select>

            {(categoryFilter === 'All' || categoryFilter === 'Academic') && (
              <select 
                value={semesterFilter}
                onChange={(e) => setSemesterFilter(e.target.value)}
                className={styles.selectInput}
              >
                <option value="All">All Semesters</option>
                {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                  <option key={sem} value={sem}>Semester {sem}</option>
                ))}
              </select>
            )}
          </div>
        </div>
      </div>

      
      <div>
        {loadingLocal && (
          <div className={styles.emptyState}>
             <p>Loading library...</p>
          </div>
        )}

        {/* University results */}
        {!loadingLocal && localResults.length > 0 && (
          <>
            <div className={styles.resultsGrid}>
              {localResults.map((book) => (
                <div 
                  key={book.libraryEntryId} 
                  className={styles.bookCard}
                  onClick={() => setSelectedBook(book)}
                >
                  <div className={styles.cardImageWrapper}>
                    {book.thumbnail ? (
                      <img src={book.thumbnail} alt={book.title} />
                    ) : (
                      <div className={styles.noImage}>No Cover</div>
                    )}
                  </div>
                  <div className={styles.cardInfo}>
                    <h4>{book.title}</h4>
                    <p>{book.author}</p>
                    
                    <div className={styles.badgeContainer}>
                       {(!book.category || book.category === 'Academic') ? (<>
                         <span className={styles.semesterBadge}>Sem {book.semester}</span>
                         <span className={styles.semesterBadge}>Year {book.year}</span>
                         <span className={book.status === 'Available' ? styles.statusAvailable : styles.statusOut}>
                            {book.status}
                          </span>
                         </>
                       ) : (
                        <>
                         <span className={styles.categoryBadge}>{book.category}</span>
                         <span className={book.status === 'Available' ? styles.statusAvailable : styles.statusOut}>
                            {book.status}
                          </span>
                          </>
                       )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* search external links too */}
            {query.trim() !== '' && externalResults.length === 0 && !loadingExternal && (
              <div className={styles.expandSearchContainer}>
                <p>Not what you are looking for?</p>
                <button 
                  onClick={handleExternalSearch} 
                  className={styles.secondaryButton}
                >
                  Search Google Books 🌐
                </button>
              </div>
            )}
          </>
        )}

     
        {!loadingLocal && localResults.length === 0 && query.trim() !== '' && externalResults.length === 0 && !loadingExternal && (
           <div className={styles.emptyState}>
             <h3>No results in Library</h3>
             <p>We couldn't find "{query}" in our catalog.</p>
             <button 
                onClick={handleExternalSearch} 
                className={styles.secondaryButton}
                style={{ marginTop: '1rem' }}
              >
                Search External Sources
              </button>
           </div>
        )}

        {/* Loading External results */}
        {loadingExternal && (
           <div style={{textAlign:'center', padding:'2rem', color:'#666'}}>
             <p>Searching global database...</p>
           </div>
        )}

        {/* External links */}
        {!loadingExternal && externalResults.length > 0 && (
          <div className={styles.externalSection}>
            <div className={styles.externalHeader}>
              <h3>Online Resources</h3>
              <p>Books found outside our library catalog:</p>
            </div>

            <div className={styles.resultsGrid}>
              {externalResults.map((book) => (
                <div 
                  key={book.googleId} 
                  className={`${styles.bookCard} ${styles.externalCard}`}
                >
                  <div className={styles.cardImageWrapper}>
                    {book.thumbnail ? <img src={book.thumbnail} alt={book.title} /> : <div className={styles.noImage}>No Image</div>}
                  </div>
                  <div className={styles.cardInfo}>
                    <h4>{book.title}</h4>
                    <p>{book.author}</p>
                    
                    <a 
                      href={book.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={styles.externalBtn}
                    >
                      View E-Book / Info ↗
                    </a>
                  </div>
                </div>
              ))}
            </div>
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