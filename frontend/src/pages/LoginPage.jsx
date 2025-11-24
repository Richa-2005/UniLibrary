import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styles from './LoginPage.module.css';
import api from '../services/api';

const LoginPage = () => {
  // --- STATE ---
  const [userType, setUserType] = useState('student'); // 'student' | 'admin'
  const [mode, setMode] = useState('login'); // 'login' | 'signup' (Admin only)
  
  // Form Fields
  const [universities, setUniversities] = useState([]); // List for dropdown
  const [selectedUniId, setSelectedUniId] = useState(''); // Selected Uni ID
  
  const [email, setEmail] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [password, setPassword] = useState('');
  const [universityName, setUniversityName] = useState(''); // For Admin Signup

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const auth = useAuth();

  // --- FETCH UNIVERSITIES ON LOAD ---
  useEffect(() => {
    const fetchUnis = async () => {
      try {
 
        const response = await api.get('/student/universities');
        setUniversities(response.data);
        // Default to first option if available
        if (response.data.length > 0) {
          setSelectedUniId(response.data[0].id);
        }
      } catch (err) {
        console.error("Failed to load universities", err);
      }
    };
    fetchUnis();
  }, []);

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (userType === 'admin') {
        // ADMIN FLOW 
        if (mode === 'login') {
          await auth.login(email, password);
          navigate('/admin/dashboard');
        } else {
          await api.post('/admin/register', { name: universityName, adminEmail: email, password });
          setSuccess('University registered! Please log in.');
          setMode('login');

          const res = await api.get('/student/universities');
          setUniversities(res.data);
        }
      } else {
        // STUDENT FLOW 
        // Login using the specific Student API
        const response = await api.post('/student/login', {
          rollNumber,
          password,
          universityId: selectedUniId 
        });

        
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userRole', 'student'); 
        localStorage.setItem('studentData', JSON.stringify(response.data.user));
       
        navigate('/student/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Operation failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
        
      
        <div className={`${styles.infoSection} ${styles.glassCard}`}>
          <h1 className={styles.mainTitle}>UniLibrary</h1>
          <p className={styles.tagline}>
            **Bridging the Stacks to the Screen.**
          </p>
          <p className={styles.description}>
            Welcome to the central hub where your university's entire collection comes to life. 
            Students can explore every resource and check real-time availability instantly.
          </p>
        </div>
        
        
        <form className={`${styles.loginBox} ${styles.glassCard}`} onSubmit={handleSubmit}>
          
          {/* Tabs */}
          <div className={styles.userTypeTabs}>
            <button 
              type="button"
              className={`${styles.typeTab} ${userType === 'student' ? styles.activeType : ''}`}
              onClick={() => setUserType('student')}
            >
              Student
            </button>
            <button 
              type="button"
              className={`${styles.typeTab} ${userType === 'admin' ? styles.activeType : ''}`}
              onClick={() => setUserType('admin')}
            >
              Admin
            </button>
          </div>

          <h2>
            {userType === 'student' ? 'Student Login' : (mode === 'login' ? 'Admin Login' : 'Admin Sign Up')}
          </h2>
          
          {error && <p className={styles.error}>{error}</p>}
          {success && <p className={styles.success}>{success}</p>}

          {/* --- ADMIN FIELDS --- */}
          {userType === 'admin' && (
            <>
              {mode === 'signup' && (
                <div className={styles.inputGroup}>
                  <label>University Name</label>
                  <input type="text" value={universityName} onChange={e => setUniversityName(e.target.value)} required />
                </div>
              )}
              <div className={styles.inputGroup}>
                <label>Admin Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
            </>
          )}

          {/* --- STUDENT FIELDS --- */}
          {userType === 'student' && (
            <>
              {/* 1. Select University Dropdown */}
              <div className={styles.inputGroup}>
                <label>Select University</label>
                <select 
                  value={selectedUniId} 
                  onChange={(e) => setSelectedUniId(e.target.value)}
                  className={styles.selectInput}
                  required
                >
                  <option value="" disabled>-- Choose your University --</option>
                  {universities.map(uni => (
                    <option key={uni.id} value={uni.id}>{uni.name}</option>
                  ))}
                </select>
              </div>

              {/* 2. Roll Number */}
              <div className={styles.inputGroup}>
                <label>Roll Number</label>
                <input 
                  type="text" 
                  placeholder="e.g. 37"
                  value={rollNumber} 
                  onChange={e => setRollNumber(e.target.value)} 
                  required 
                />
              </div>
            </>
          )}

          {/* --- PASSWORD (BOTH) --- */}
          <div className={styles.inputGroup}>
            <label>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
            />
          </div>

          <button type="submit" className={styles.loginButton} disabled={loading}>
            {loading ? 'Processing...' : (mode === 'signup' ? 'Create Account' : 'Login')}
          </button>
          
          {/* --- TOGGLE (ADMIN ONLY) --- */}
          {userType === 'admin' && (
            <p className={styles.toggleText}>
              {mode === 'login' ? "New University?" : "Already registered?"}
              <button type="button" onClick={() => setMode(mode === 'login' ? 'signup' : 'login')} className={styles.toggleButton}>
                {mode === 'login' ? 'Sign Up' : 'Login'}
              </button>
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default LoginPage;