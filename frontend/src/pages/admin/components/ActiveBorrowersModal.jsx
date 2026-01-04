import React, { useEffect, useState } from 'react';
import api from '../../../services/api.js';
import styles from './BookDetailModal.module.css';

const ActiveBorrowersModal = ({ book, onClose, onReturnSuccess }) => {
  const [borrowers, setBorrowers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Settings
  const [finePerDay, setFinePerDay] = useState(0);
  
  // Interaction State
  const [selectedStudent, setSelectedStudent] = useState(null); // Which student is being processed
  const [returnType, setReturnType] = useState('returned'); // 'returned', 'damaged', 'lost'
  const [damageCharge, setDamageCharge] = useState(0); // Manual input for damage

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
      alert("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  // --- CALCULATION LOGIC ---
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
    
    // 1. Overdue Fine
    const days = calculateOverdueDays(selectedStudent.dueDate);
    const overdueFine = days * finePerDay;

    // 2. Extra Charges
    if (returnType === 'lost') {
       // For lost, usually we charge Book Price. (Overdue might be waived or added depending on policy)
       // Let's assume Total = Price + Overdue
       return overdueFine + (book.price || 0);
    } 
    else if (returnType === 'damaged') {
       return overdueFine + parseFloat(damageCharge || 0);
    }
    
    // Normal Return
    return overdueFine;
  };

 
  const handleConfirm = async () => {
    if (!window.confirm("Confirm this transaction?")) return;
    
    const daysOverdue = calculateOverdueDays(selectedStudent.dueDate);
    const calculatedFine = daysOverdue * finePerDay;
    const calculatedDamage = returnType === 'damaged' ? parseFloat(damageCharge || 0) : 0;
    const calculatedLost = returnType === 'lost' ? (book.price || 0) : 0;

    try {
      await api.post('/admin/return-book', {
        libraryEntryId: book.libraryEntryId,
        rollNumber: selectedStudent.student.rollNumber,
        status: returnType, // 'returned', 'lost', 'damaged'
        fineAmount: calculatedFine,
        damageAmount: calculatedDamage,
        lostAmount: calculatedLost
      });
      
      setBorrowers(prev => prev.filter(b => b.student.id !== selectedStudent.student.id));
      setSelectedStudent(null);
      setReturnType('returned');
      setDamageCharge(0);
      
      // If list empty, notify parent
      if (borrowers.length <= 1) onReturnSuccess();
      else onReturnSuccess(false); 
      
    } catch (err) {
      alert("Transaction failed.");
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()} style={{maxWidth: '800px'}}>
        <button className={styles.closeButton} onClick={onClose}>&times;</button>
        
        <div style={{ padding: '2rem' }}>
          <h2 className={styles.title}>Manage Returns</h2>
          <p className={styles.author}>Book: {book.title} (Price: ₹{book.price || 'N/A'})</p>
          <hr className={styles.divider} />

          {/* LIST OF BORROWERS */}
          {!selectedStudent && (
             <div>
               {loading ? <p>Loading...</p> : borrowers.length === 0 ? <p>No active loans.</p> : (
                 <table style={{width:'100%', borderCollapse:'collapse'}}>
                   <thead>
                     <tr style={{textAlign:'left', color:'#666', borderBottom:'1px solid #ccc'}}>
                       <th style={{padding:'10px'}}>Student</th>
                       <th style={{padding:'10px'}}>Due Date</th>
                       <th style={{padding:'10px'}}>Status</th>
                       <th style={{padding:'10px'}}>Action</th>
                     </tr>
                   </thead>
                   <tbody>
                     {borrowers.map(rec => {
                       const days = calculateOverdueDays(rec.dueDate);
                       return (
                         <tr key={rec.id} style={{borderBottom:'1px solid #eee'}}>
                           <td style={{padding:'10px'}}>
                             <strong>{rec.student.rollNumber}</strong><br/>
                             {rec.student.name}
                           </td>
                           <td style={{padding:'10px'}}>
                             {new Date(rec.dueDate).toLocaleDateString()}
                           </td>
                           <td style={{padding:'10px', color: days > 0 ? 'red' : 'green'}}>
                             {days > 0 ? `${days} Days Late` : 'On Time'}
                           </td>
                           <td style={{padding:'10px'}}>
                             <button 
                               onClick={() => setSelectedStudent(rec)}
                               style={{padding:'5px 10px', background:'var(--primary-color)', color:'white', border:'none', borderRadius:'4px', cursor:'pointer'}}
                             >
                               Select
                             </button>
                           </td>
                         </tr>
                       )
                     })}
                   </tbody>
                 </table>
               )}
             </div>
          )}

          {/* ACTION AREA (Only shows when a student is selected) */}
          {selectedStudent && (
            <div style={{animation: 'fadeIn 0.3s'}}>
              <button 
                onClick={() => setSelectedStudent(null)}
                style={{marginBottom:'1rem', background:'none', border:'none', color:'#666', cursor:'pointer', textDecoration:'underline'}}
              >
                &larr; Back to list
              </button>

              <div style={{background:'#f9f9f9', padding:'1.5rem', borderRadius:'8px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'2rem'}}>
                
                {/* LEFT: Options */}
                <div>
                   <h3 style={{margin:'0 0 1rem 0'}}>Return Options</h3>
                   
                   <div style={{display:'flex', flexDirection:'column', gap:'0.8rem'}}>
                     <label style={{cursor:'pointer', padding:'10px', border: returnType==='returned'?'2px solid green':'1px solid #ddd', borderRadius:'6px', fontWeight: returnType==='returned'?'bold':'normal'}}>
                       <input type="radio" name="type" checked={returnType==='returned'} onChange={()=>setReturnType('returned')} />
                       &nbsp; Normal Return
                     </label>

                     <label style={{cursor:'pointer', padding:'10px', border: returnType==='damaged'?'2px solid orange':'1px solid #ddd', borderRadius:'6px', fontWeight: returnType==='damaged'?'bold':'normal'}}>
                       <input type="radio" name="type" checked={returnType==='damaged'} onChange={()=>setReturnType('damaged')} />
                       &nbsp; Book Damaged
                     </label>

                     <label style={{cursor:'pointer', padding:'10px', border: returnType==='lost'?'2px solid red':'1px solid #ddd', borderRadius:'6px', fontWeight: returnType==='lost'?'bold':'normal'}}>
                       <input type="radio" name="type" checked={returnType==='lost'} onChange={()=>setReturnType('lost')} />
                       &nbsp; Book Lost
                     </label>
                   </div>

                   {/* Conditional Input for Damaged */}
                   {returnType === 'damaged' && (
                     <div style={{marginTop:'1rem'}}>
                       <label>Damage Charge (₹):</label>
                       <input 
                         type="number" 
                         value={damageCharge} 
                         onChange={e=>setDamageCharge(e.target.value)} 
                         style={{marginLeft:'10px', padding:'5px', width:'80px'}}
                       />
                     </div>
                   )}
                </div>

                {/* RIGHT: Bill Calculation */}
                <div style={{background:'white', padding:'1.5rem', borderRadius:'8px', boxShadow:'0 2px 5px rgba(0,0,0,0.05)'}}>
                   <h3 style={{margin:'0 0 1rem 0', color:'#444'}}>Payment Due</h3>
                   
                   <div style={{display:'flex', justifyContent:'space-between', marginBottom:'0.5rem'}}>
                     <span>Overdue Fine:</span>
                     <span>₹{calculateOverdueDays(selectedStudent.dueDate) * finePerDay}</span>
                   </div>

                   {returnType === 'damaged' && (
                     <div style={{display:'flex', justifyContent:'space-between', marginBottom:'0.5rem', color:'orange'}}>
                       <span>Damage Charge:</span>
                       <span>₹{parseFloat(damageCharge||0)}</span>
                     </div>
                   )}

                   {returnType === 'lost' && (
                     <div style={{display:'flex', justifyContent:'space-between', marginBottom:'0.5rem', color:'red'}}>
                       <span>Book Price (Lost):</span>
                       <span>₹{book.price || 0}</span>
                     </div>
                   )}

                   <hr />
                   <div style={{display:'flex', justifyContent:'space-between', marginTop:'0.5rem', fontSize:'1.2rem', fontWeight:'bold'}}>
                     <span>TOTAL:</span>
                     <span style={{color:'var(--primary-color)'}}>₹{calculateTotal()}</span>
                   </div>

                   <button 
                     onClick={handleConfirm}
                     style={{width:'100%', marginTop:'1.5rem', padding:'10px', background:'var(--primary-color)', color:'white', border:'none', borderRadius:'6px', fontWeight:'bold', cursor:'pointer'}}
                   >
                     Confirm {returnType === 'lost' ? 'Lost' : 'Return'} & Collect
                   </button>
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