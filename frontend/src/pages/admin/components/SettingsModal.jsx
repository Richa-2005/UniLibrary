import { useState, useEffect } from 'react';
import api from '../../../services/api.js';
import styles from './BookDetailModal.module.css';
import toast from 'react-hot-toast';

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
      toast.success("Settings Saved!");
      onClose();
    } catch(e) { toast.error("Error saving"); }
    setLoading(false);
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()} style={{ maxWidth: '400px' }}>
        <button className={styles.closeButton} onClick={onClose}>&times;</button>
        
        <div style={{ padding: '2.5rem' }}>
          <h2 className={styles.title}>Library Settings</h2>
          <hr className={styles.divider} />
          
          <div className={styles.inputGroup}>
            <label>Overdue Fine (per day)</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
               <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#1e293b' }}>₹</span>
               <input 
                 type="number" 
                 value={fine} 
                 onChange={e => setFine(e.target.value)}
               />
            </div>
          </div>

          <button onClick={handleSave} className={styles.addButton} disabled={loading}>
            {loading ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;