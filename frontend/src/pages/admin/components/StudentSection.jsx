import { useState, useEffect } from 'react';
import api from '../../../services/api';
import styles from './StudentSection.module.css';
import toast from 'react-hot-toast';

const StudentSection = () => {
  // Form State
  const [formData, setFormData] = useState({ name: '', rollNumber: '', password: '' });
  const [submitting, setSubmitting] = useState(false);

  // List State
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Students
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await api.get('/admin/my-students');
      setStudents(response.data);
    } catch (error) {
      console.error("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  // Handle Add Student
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/admin/add-student', formData);
      toast.success(`Success! Student "${formData.name}" added.`);
      setFormData({ name: '', rollNumber: '', password: '' }); 
      fetchStudents(); 
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to add student.');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Delete Student 
  const handleDeleteRequest = (id, name) => {
    toast((t) => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <p style={{ margin: 0, fontWeight: 500 }}>
          Remove student <b>"{name}"</b>?
          <br />
          <span style={{ fontSize: '0.85em', color: '#666' }}>This cannot be undone.</span>
        </p>
        <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
          <button 
            onClick={() => toast.dismiss(t.id)}
            style={{ padding: '6px 12px', border: '1px solid #ccc', borderRadius: '4px', background: 'white', cursor: 'pointer' }}
          >
            Cancel
          </button>
          <button 
            onClick={() => {
              performDelete(id); 
              toast.dismiss(t.id);
            }}
            style={{ padding: '6px 12px', border: 'none', borderRadius: '4px', background: '#ef4444', color: 'white', cursor: 'pointer' }}
          >
            Delete
          </button>
        </div>
      </div>
    ), { duration: 5000, position: 'top-center', style: { border: '1px solid #ef4444', padding: '16px' } });
  };

  // Delete Logic
  const performDelete = async (id) => {
    try {
      await api.delete(`/admin/student/${id}`);
      setStudents(students.filter(s => s.id !== id)); 
      toast.success('Student removed successfully.');
    } catch (error) {
      toast.error('Failed to delete student.');
    }
  };

  return (
    <div className={styles.container}>
      
      {/* Registration Form */}
      <div className={`card ${styles.formCard}`}>
        <h2>Register New Student</h2>
        <p className={styles.instruction}>
          Create an account for a student. Share the password with them.
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label>Full Name</label>
            <input 
              type="text" 
              placeholder="e.g. John Doe"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Roll Number</label>
            <input 
              type="text" 
              placeholder="e.g. 2K23/CS/101"
              value={formData.rollNumber}
              onChange={(e) => setFormData({...formData, rollNumber: e.target.value})}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Assign Password</label>
            <input 
              type="text" 
              placeholder="e.g. student123"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
          </div>

          <button type="submit" className={styles.submitBtn} disabled={submitting}>
            {submitting ? 'Creating...' : 'Create Student Account'}
          </button>
        </form>
      </div>

      {/* Student List */}
      <div className={`card ${styles.listCard}`}>
        <div className={styles.listHeader}>
          <h2>Student Directory</h2>
          <span className={styles.countBadge}>{students.length} Students</span>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Roll Number</th>
                <th>Name</th>
                <th style={{textAlign: 'right'}}>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="3" className={styles.centerText}>Loading...</td></tr>
              ) : students.length === 0 ? (
                <tr><td colSpan="3" className={styles.centerText}>No students registered yet.</td></tr>
              ) : (
                students.map(student => (
                  <tr key={student.id}>
                    <td className={styles.rollCol}>{student.rollNumber}</td>
                    <td className={styles.nameCol}>{student.name}</td>
                    <td style={{textAlign: 'right'}}>
                      <button 
                        className={styles.deleteBtn}
                        onClick={() => handleDeleteRequest(student.id, student.name)} 
                        title="Remove Student"
                      >
                        &times;
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default StudentSection;