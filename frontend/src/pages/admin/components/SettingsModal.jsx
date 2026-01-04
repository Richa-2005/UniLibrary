import React, { useState, useEffect } from 'react';
import api from '../../../services/api.js';
import styles from './BookDetailModal.module.css';

const SettingsModal = ({ onClose }) => {
  const [fine, setFine] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/admin/settings').then(res => setFine(res.data.finePerDay));
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      await api.put('/admin/settings', { finePerDay: fine });
      alert("Settings Saved!");
      onClose();
    } catch(e) { alert("Error saving"); }
    setLoading(false);
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()} style={{maxWidth:'400px'}}>
        <button className={styles.closeButton} onClick={onClose}>&times;</button>
        <div style={{padding:'2rem'}}>
          <h2 className={styles.title}>Library Settings</h2>
          <hr className={styles.divider} />
          
          <label style={{fontWeight:'bold', display:'block', marginTop:'1rem'}}>
            Overdue Fine (per day)
          </label>
          <div style={{display:'flex', alignItems:'center', gap:'10px', marginTop:'0.5rem'}}>
             <span style={{fontSize:'1.2rem', fontWeight:'bold'}}>₹</span>
             <input 
               type="number" 
               value={fine} 
               onChange={e => setFine(e.target.value)}
               style={{padding:'0.5rem', width:'100%', borderRadius:'4px', border:'1px solid #ccc'}}
             />
          </div>

          <button onClick={handleSave} className={styles.addButton} style={{marginTop:'1.5rem'}} disabled={loading}>
            {loading ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;