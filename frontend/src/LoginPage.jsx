import React, { useState } from 'react';
import styles from './LoginPage.module.css';
// We need useNavigate to redirect after login
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [role, setRole] = useState('student');
  const [id, setId] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // In a real app, you'd check the ID/password
    // For now, we just redirect based on role.
    if (role === 'student') {
      navigate('/student');
    } else {
      navigate('/admin');
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.loginBox} onSubmit={handleLogin}>
        <h2>UniLibrary Login</h2>
        <div className={styles.toggle}>
          <button
            type="button"
            className={role === 'student' ? styles.active : ''}
            onClick={() => setRole('student')}
          >
            Student
          </button>
          <button
            type="button"
            className={role === 'admin' ? styles.active : ''}
            onClick={() => setRole('admin')}
          >
            Admin
          </button>
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="id">
            {role === 'student' ? 'Roll Number' : 'Admin Email'}
          </label>
          <input
            type={role === 'student' ? 'text' : 'email'}
            id="id"
            value={id}
            onChange={(e) => setId(e.target.value)}
            placeholder={role === 'student' ? 'e.g., 2410111037' : 'e.g., admin@adaniuni.ac.in'}
          />
        </div>

        <button type="submit" className={styles.loginButton}>Login</button>
      </form>
    </div>
  );
};

export default LoginPage;