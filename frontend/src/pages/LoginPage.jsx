import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styles from './LoginPage.module.css';
import api from '../services/api'; 

const LoginPage = () => {
  const [mode, setMode] = useState('login'); // 'login' or 'signup'
  
  // Fields for both modes
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Field just for signup
  const [universityName, setUniversityName] = useState('');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(''); // For successful signup
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const auth = useAuth(); // Get the login function from context

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (mode === 'login') {
      //LOGIN LOGIC
      try {
        await auth.login(email, password);
        navigate('/admin/dashboard');
      } catch (err) {
        setError('Failed to log in. Please check your email and password.');
        console.error(err);
      }
    } else {
      // SIGN UP LOGIC
      try {
        // We call the register API directly
        await api.post('/admin/register', {
          name: universityName,
          adminEmail: email,
          password: password,
        });
        setSuccess('Account created! Please log in.');
        setMode('login'); // Switch back to login mode
  
        setUniversityName('');
        setEmail('');
        setPassword('');
      } catch (err) {
        setError('Failed to create account. Email may already be in use.');
        console.error(err);
      }
    }
    setLoading(false);
  };

  const toggleMode = () => {
    setMode(prevMode => (prevMode === 'login' ? 'signup' : 'login'));
    setError('');
    setSuccess('');
  };

  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
      <div className={`${styles.infoSection} ${styles.glassCard}`}>
          <h1 className={styles.mainTitle}>UniLibrary</h1>
          <p className={styles.tagline}>
            Bridging the Stacks to the Screen.
          </p>
          <p className={styles.description}>
            Welcome to the central hub where your university's entire collection 
            comes to life. We provide students with a sophisticated yet simple 
            tool to explore every resource, check real-time availability, and 
            find crucial e-book links when a physical copy isn't an option. 
            Simultaneously, we empower administrators with a robust platform to 
            meticulously manage their inventory, add new acquisitions via smart 
            API tools, and ensure their library's valuable collection is always 
            accessible to the next generation of scholars
          </p>
        </div>
      <form className={`card ${styles.loginBox}`} onSubmit={handleSubmit}>
        <h2>{mode === 'login' ? 'Admin Login' : 'Admin Sign Up'}</h2>
        
        {error && <p className={styles.error}>{error}</p>}
        {success && <p className={styles.success}>{success}</p>}
        {/* only sign up field */}
        {mode === 'signup' && (
          <div className={styles.inputGroup}>
            <label htmlFor="name">University Name</label>
            <input
              type="text"
              id="name"
              value={universityName}
              onChange={(e) => setUniversityName(e.target.value)}
              required
            />
          </div>
        )}

        {/* Email (Both Modes) */}
        <div className={styles.inputGroup}>
          <label htmlFor="email">Admin Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Password (Both Modes) */}
        <div className={styles.inputGroup}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button 
          type="submit" 
          className={styles.loginButton} 
          disabled={loading}
        >

          {loading 
            ? 'Processing...' 
            : (mode === 'login' ? 'Login' : 'Create Account')}
        </button>
        
        {/* Mode Toggle */}
        <p className={styles.toggleText}>
          {mode === 'login' 
            ? "Don't have an account?" 
            : "Already have an account?"}
          <button type="button" onClick={toggleMode} className={styles.toggleButton}>
            {mode === 'login' ? 'Sign Up' : 'Login'}
          </button>
        </p>
      </form>
      </div>
    </div>
  );
};

export default LoginPage;