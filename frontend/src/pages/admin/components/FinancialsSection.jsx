import React, { useEffect, useState } from 'react';
import api from '../../../services/api';
import styles from './InventorySection.module.css'; 

const FinancialsSection = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await api.get('/admin/transactions');
      setTransactions(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getTotalRevenue = () => {
    return transactions.reduce((sum, t) => sum + t.totalCollected, 0);
  };

  return (
    <div className={styles.container}>
      {/* Header Card */}
      <div style={{
        background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
        color: 'white',
        padding: '2rem',
        borderRadius: '12px',
        marginBottom: '2rem',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ margin: 0, opacity: 0.9 }}>Total Collections</h2>
        <h1 style={{ margin: '0.5rem 0 0', fontSize: '2.5rem' }}>₹{getTotalRevenue().toLocaleString()}</h1>
        <p style={{ opacity: 0.8, fontSize: '0.9rem' }}>From Fines, Damages, and Lost Books</p>
      </div>

      {/* Table */}
      <h3 style={{ color: '#444' }}>Transaction History</h3>
      {loading ? <p>Loading...</p> : transactions.length === 0 ? <p>No transactions yet.</p> : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Student</th>
                <th>Book</th>
                <th>Type</th>
                <th>Collected</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(t => (
                <tr key={t.id}>
                  <td>{new Date(t.date).toLocaleDateString()}</td>
                  <td>
                    <strong>{t.rollNumber}</strong><br/>
                    <span style={{fontSize:'0.85rem', color:'#666'}}>{t.studentName}</span>
                  </td>
                  <td style={{maxWidth:'200px'}}>{t.bookTitle}</td>
                  <td>
                    <span style={{
                      padding: '4px 8px', 
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      fontWeight: 'bold',
                      background: t.type === 'lost' ? '#ffebee' : t.type === 'damaged' ? '#fff3e0' : '#e8f5e9',
                      color: t.type === 'lost' ? '#c62828' : t.type === 'damaged' ? '#ef6c00' : '#2e7d32'
                    }}>
                      {t.type.toUpperCase()}
                    </span>
                  </td>
                  <td style={{fontWeight:'bold', color: '#2e7d32'}}>₹{t.totalCollected}</td>
                  <td style={{fontSize:'0.85rem', color:'#666'}}>
                    {t.breakdown.fine > 0 && <div>Fine: ₹{t.breakdown.fine}</div>}
                    {t.breakdown.damage > 0 && <div>Dmg: ₹{t.breakdown.damage}</div>}
                    {t.breakdown.lost > 0 && <div>Book: ₹{t.breakdown.lost}</div>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FinancialsSection;