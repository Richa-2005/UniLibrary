import { useEffect, useState } from 'react';
import api from '../../../services/api.js';

import styles from './Transactional.module.css';
import toast from 'react-hot-toast';

const ActiveBorrowersModal = ({ book, onClose, onReturnSuccess }) => {
  const [borrowers, setBorrowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [finePerDay, setFinePerDay] = useState(0);
  
  const [selectedStudent, setSelectedStudent] = useState(null); 
  const [returnType, setReturnType] = useState('returned'); 
  const [damageCharge, setDamageCharge] = useState(0); 

  useEffect(() => {
    fetchData();
  }, [book]);

  const fetchData = async () => {
    try {
      const [borrowRes, settingsRes] = await Promise.all([
        api.get(`/admin/book-borrowers/${book.libraryEntryId}`),
        api.get('/admin/settings')
      ]);
      setBorrowers(borrowRes.data);
      setFinePerDay(settingsRes.data.finePerDay);
    } catch (err) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const calculateOverdueDays = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    today.setHours(0,0,0,0);
    due.setHours(0,0,0,0);
    if (today <= due) return 0;
    const diffTime = Math.abs(today - due);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  };

  const calculateTotal = () => {
    if (!selectedStudent) return 0;
    const days = calculateOverdueDays(selectedStudent.dueDate);
    const overdueFine = days * finePerDay;
    if (returnType === 'lost') return overdueFine + (book.price || 0);
    if (returnType === 'damaged') return overdueFine + parseFloat(damageCharge || 0);
    return overdueFine;
  };

  const performTransaction = async () => {
    const daysOverdue = calculateOverdueDays(selectedStudent.dueDate);
    const calculatedFine = daysOverdue * finePerDay;
    const calculatedDamage = returnType === 'damaged' ? parseFloat(damageCharge || 0) : 0;
    const calculatedLost = returnType === 'lost' ? (book.price || 0) : 0;

    try {
      await api.post('/admin/return-book', {
        libraryEntryId: book.libraryEntryId,
        rollNumber: selectedStudent.student.rollNumber,
        status: returnType,
        fineAmount: calculatedFine,
        damageAmount: calculatedDamage,
        lostAmount: calculatedLost
      });
      toast.success("Book returned successfully!");
      setBorrowers(prev => prev.filter(b => b.student.id !== selectedStudent.student.id));
      setSelectedStudent(null);
      setReturnType('returned');
      setDamageCharge(0);
      if (borrowers.length <= 1) onReturnSuccess();
      else onReturnSuccess(false); 
    } catch (err) {
      toast.error(err.response?.data?.error || "Transaction failed.");
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
     
      <div className={`${styles.modalContainer} ${styles.modalLarge}`} onClick={e => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>&times;</button>
        
        {/* Heading */}
        <div className={styles.header}>
          <h2 className={styles.title}>Manage Returns</h2>
          <p className={styles.subtitle}>
            Book: <span style={{color: '#0f172a', fontWeight:'bold'}}>{book.title}</span> 
            <span style={{marginLeft: '10px', background:'#f1f5f9', padding:'2px 8px', borderRadius:'4px', fontSize:'0.85rem'}}>
               Price: ₹{book.price || 'N/A'}
            </span>
          </p>
        </div>

        <div className={styles.body}>
          {!selectedStudent ? (
             <div className={styles.tableContainer}>
               {loading ? <p style={{padding:'1rem'}}>Loading...</p> : borrowers.length === 0 ? <p style={{padding:'1rem'}}>No active loans.</p> : (
                 <table className={styles.table}>
                   <thead>
                     <tr><th>Student</th><th>Due Date</th><th>Status</th><th>Action</th></tr>
                   </thead>
                   <tbody>
                     {borrowers.map(rec => {
                       const days = calculateOverdueDays(rec.dueDate);
                       return (
                         <tr key={rec.id}>
                           <td><strong>{rec.student.rollNumber}</strong><br/>{rec.student.name}</td>
                           <td>{new Date(rec.dueDate).toLocaleDateString()}</td>
                           <td>{days > 0 ? <span style={{color:'red', fontWeight:'bold'}}>{days} Days Late</span> : <span style={{color:'green', fontWeight:'bold'}}>On Time</span>}</td>
                           <td><button onClick={() => setSelectedStudent(rec)} className={styles.actionBtn}>Select</button></td>
                         </tr>
                       )
                     })}
                   </tbody>
                 </table>
               )}
             </div>
          ) : (
            <div style={{height: '100%', display: 'flex', flexDirection: 'column'}}>
              <button className={styles.backBtn} onClick={() => setSelectedStudent(null)}>← Back to list</button>
              
            
              <div className={styles.splitLayout}>
                
                <div>
                   <h3 style={{marginBottom:'1rem', color:'#64748b', textTransform:'uppercase', fontSize:'0.8rem', fontWeight:'700'}}>Return Status</h3>
                   <div className={styles.radioGroup}>
                     <label className={`${styles.radioOption} ${returnType==='returned' ? styles.selectedOption : ''}`}>
                       <input type="radio" checked={returnType==='returned'} onChange={()=>setReturnType('returned')} /> Normal Return
                     </label>
                     <label className={`${styles.radioOption} ${returnType==='damaged' ? styles.selectedOption : ''}`}>
                       <input type="radio" checked={returnType==='damaged'} onChange={()=>setReturnType('damaged')} /> Book Damaged
                     </label>
                     <label className={`${styles.radioOption} ${returnType==='lost' ? styles.selectedOption : ''}`}>
                       <input type="radio" checked={returnType==='lost'} onChange={()=>setReturnType('lost')} /> Book Lost
                     </label>
                     {returnType === 'damaged' && (
                       <div className={styles.inputGroup} style={{marginTop:'1rem'}}>
                         <label>Damage Charge</label>
                         <input type="number" value={damageCharge} onChange={e=>setDamageCharge(e.target.value)} />
                       </div>
                     )}
                   </div>
                </div>

       
                <div className={styles.summaryCard}>
                   <h3 style={{ margin: '0 0 1rem 0', color: '#0f172a', fontSize: '1.2rem', fontWeight:'700' }}>Payment Due</h3>
                   <div className={styles.summaryRow}><span>Student:</span><span style={{color:'#0f172a', fontWeight:'bold'}}>{selectedStudent.student.rollNumber}</span></div>
                   <div className={styles.summaryRow}><span>Overdue Fine:</span><span>₹{calculateOverdueDays(selectedStudent.dueDate) * finePerDay}</span></div>
                   {returnType === 'damaged' && <div className={styles.summaryRow} style={{color:'#f59e0b', fontWeight:'bold'}}><span>Damage:</span><span>+ ₹{parseFloat(damageCharge||0)}</span></div>}
                   {returnType === 'lost' && <div className={styles.summaryRow} style={{color:'#ef4444', fontWeight:'bold'}}><span>Book Price:</span><span>+ ₹{book.price}</span></div>}
                   <div className={styles.totalRow}><span>TOTAL:</span><span>₹{calculateTotal()}</span></div>
                   <button className={styles.primaryBtn} onClick={performTransaction}>Confirm Transaction</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActiveBorrowersModal;