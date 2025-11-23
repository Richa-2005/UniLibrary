import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import styles from './StudentSection.module.css';

const StudentSection = () => {
  // Form State
  const [formData, setFormData] = useState({ name: '', rollNumber: '', password: '' });
  const [submitting, setSubmitting] = useState(false);

  // List State
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch Students on Load
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

  // 2. Handle Add Student
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/admin/add-student', formData);
      alert(`Success! Student "${formData.name}" added.`);
      setFormData({ name: '', rollNumber: '', password: '' }); // Reset form
      fetchStudents(); // Refresh the list immediately
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to add student.');
    } finally {
      setSubmitting(false);
    }
  };

  // 3. Handle Delete Student
  const handleDelete = async (id, name) => {
    if(!window.confirm(`Remove student "${name}"? This cannot be undone.`)) return;

    try {
      await api.delete(`/admin/student/${id}`);
      setStudents(students.filter(s => s.id !== id)); // Update UI
    } catch (error) {
      alert('Failed to delete student.');
    }
  };

  return (
    <div className={styles.container}>
      
      {/* --- LEFT: Registration Form --- */}
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

      {/* --- RIGHT: Student Directory --- */}
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
                        onClick={() => handleDelete(student.id, student.name)}
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