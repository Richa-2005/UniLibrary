import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styles from './LoginPage.module.css';
import api from '../services/api';

const LoginPage = () => {
  
  const [userType, setUserType] = useState('student'); // 'student' | 'admin'
  const [mode, setMode] = useState('login'); // 'login' | 'signup' (Admin only)
  
  // Form Fields
  const [universities, setUniversities] = useState([]); 
  const [selectedUniId, setSelectedUniId] = useState(''); 
  
  const [email, setEmail] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [password, setPassword] = useState('');
  const [universityName, setUniversityName] = useState(''); 
  
  // Secret Key State (Admin signup)
  const [secretKey, setSecretKey] = useState(''); 

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const auth = useAuth();

  useEffect(() => {
    const fetchUnis = async () => {
      try {
        const response = await api.get('/student/universities');
        setUniversities(response.data);
        if (response.data.length > 0) {
          setSelectedUniId(response.data[0].id);
        }
      } catch (err) {
        console.error("Failed to load universities", err);
      }
    };
    fetchUnis();
  }, []);

  const fillAdminDemo = () => {
  setUserType('admin');
  setMode('login');
  setEmail('demo_abc@gmail.com');
  setPassword('Demo@123');
};

const fillStudentDemo = () => {
  setUserType('student');
  setRollNumber('37');
  setPassword('Student@123');

  const demoUni = universities.find(
    (uni) => uni.name.toLowerCase() === 'ABC'
  );

  if (demoUni) {
    setSelectedUniId(demoUni.id);
  }
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (userType === 'admin') {
        
        if (mode === 'login') {
          await auth.login(email, password);
          navigate('/admin/dashboard');
        } 
        else { 
          await api.post('/admin/register', { 
            name: universityName, 
            adminEmail: email, 
            password,
            secretKey 
          });
          
          setSuccess('University registered! Please log in.');
          setMode('login');
          setSecretKey(''); 

          const res = await api.get('/student/universities');
          setUniversities(res.data);
        }
      } 
      else {
      
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
            Bridging the Stacks to the Screen.
          </p>
          <p className={styles.description}>
            Welcome to the central hub where your university's entire collection comes to life. 
            Students can explore every resource and check real-time availability instantly.
          </p>
        </div>
        
        <form className={`${styles.loginBox} ${styles.glassCard}`} onSubmit={handleSubmit}>
          
          <div className={styles.userTypeTabs}>

            <button 
              type="button"
              className={`${styles.typeTab} ${userType === 'student' ? styles.activeType : ''}`}
              onClick={() => setUserType('student')}
              disabled={mode === 'signup'}
              style={{ 
                opacity: mode === 'signup' ? 0.5 : 1, 
                cursor: mode === 'signup' ? 'not-allowed' : 'pointer' 
              }}
              title={mode === 'signup' ? "Switch to Login first" : "Student Login"}
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

          
          {userType === 'admin' && (
            <>
              {/* Admin Signup */}
              {mode === 'signup' && (
                <>
                  <div className={styles.inputGroup}>
                    <label>University Name</label>
                    <input type="text" value={universityName} onChange={e => setUniversityName(e.target.value)} required />
                  </div>
                  
                  <div className={styles.inputGroup}>
                    <label>Master Secret Key</label>
                    <input 
                      type="password" 
                      placeholder="Required for registration"
                      value={secretKey} 
                      onChange={e => setSecretKey(e.target.value)} 
                      required 
                      style={{ border: '1px solid var(--accent-color)' }}
                    />
                  </div>
                </>
              )}
              {/* Admin Login */}
              <div className={styles.inputGroup}>
                <label>Admin Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <div className={styles.inputGroup}>
  <label>Password</label>
  <input
    type="password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    required
  />
</div>
            </>
          )}

          {/* Student Login */}
          {userType === 'student' && (
            <>
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

              <div className={styles.inputGroup}>
  <label>Password</label>
  <input
    type="password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    required
  />
</div>
            </>
          )}

         
          {mode === 'login' && (
  <div className={styles.demoBox}>
    <h3 className={styles.demoTitle}>Demo Access</h3>
    <p className={styles.demoNote}>
      Use demo credentials to explore the platform without registration.
    </p>

    {userType === 'admin' ? (
      <div className={styles.demoCard}>
        <p><strong>Admin Demo</strong></p>
        <p>Email: demo_abc@gmail.com</p>
        <p>Password: Demo@123</p>
        <button
          type="button"
          className={styles.demoFillButton}
          onClick={fillAdminDemo}
        >
          Use Admin Demo
        </button>
      </div>
    ) : (
      <div className={styles.demoCard}>
        <p><strong>Student Demo</strong></p>
        <p>University: ABC</p>
        <p>Roll Number: 37</p>
        <p>Password: Student@123</p>
        <button
          type="button"
          className={styles.demoFillButton}
          onClick={fillStudentDemo}
        >
          Use Student Demo
        </button>
      </div>
    )}
  </div>
)}

<button type="submit" className={styles.loginButton} disabled={loading}>
  {loading ? 'Processing...' : (mode === 'signup' ? 'Create Account' : 'Login')}
</button>
          
          {/* Admin signup toggle*/}
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