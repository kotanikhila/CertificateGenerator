import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>🎓 Certificate Generator</h1>
        <p style={styles.subtitle}>
          Welcome to the Certificate Generator and Verification System
        </p>
        <p style={styles.description}>
          Generate, manage, and verify digital certificates with ease.
        </p>
        <div style={styles.buttons}>
          <Link to="/login" style={styles.loginBtn}>Login</Link>
          <Link to="/signup" style={styles.signupBtn}>Sign Up</Link>
        </div>
        <div style={styles.features}>
          <h3>Features:</h3>
          <ul>
            <li>✅ Generate PDF Certificates</li>
            <li>✅ QR Code Verification</li>
            <li>✅ Bulk Certificate Generation</li>
            <li>✅ Email Notifications</li>
            <li>✅ Secure Authentication</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: '#f0f2f5',
    margin: 0,
    padding: '20px',
  },
  card: {
    background: 'white',
    padding: '40px',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    textAlign: 'center',
    maxWidth: '600px',
    width: '100%',
  },
  title: {
    fontSize: '36px',
    color: '#1a1a2e',
    marginBottom: '10px',
  },
  subtitle: {
    fontSize: '20px',
    color: '#666',
    marginBottom: '10px',
  },
  description: {
    fontSize: '16px',
    color: '#888',
    marginBottom: '30px',
  },
  buttons: {
    display: 'flex',
    justifyContent: 'center',
    gap: '15px',
    marginBottom: '30px',
  },
  loginBtn: {
    padding: '12px 30px',
    background: '#007bff',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '5px',
    fontSize: '16px',
  },
  signupBtn: {
    padding: '12px 30px',
    background: '#28a745',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '5px',
    fontSize: '16px',
  },
  features: {
    textAlign: 'left',
    marginTop: '20px',
    padding: '20px',
    background: '#f8f9fa',
    borderRadius: '5px',
  },
};

export default Home;
