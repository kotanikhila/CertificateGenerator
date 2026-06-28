import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { api } from './services/api';

// Home Component
function Home() {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>🎓 Certificate Generator</h1>
        <p style={styles.subtitle}>Generate, manage, and verify digital certificates with ease.</p>
        <div style={styles.buttons}>
          <Link to="/login" style={styles.loginBtn}>Login</Link>
          <Link to="/signup" style={styles.signupBtn}>Sign Up</Link>
        </div>
      </div>
    </div>
  );
}

// Login Component
function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/login', { email, password });
      
      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data));
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.subtitle}>Login</h2>
        {error && <div style={styles.error}>{error}</div>}
        <form onSubmit={handleLogin} style={styles.form}>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={styles.input} required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={styles.input} required />
          <button type="submit" style={styles.loginBtn} disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p style={styles.link}><Link to="/signup">Don't have an account? Sign Up</Link></p>
      </div>
    </div>
  );
}

// SignUp Component
function SignUp() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'user' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await api.post('/register', formData);
      if (response.data) {
        setSuccess('Registration successful! Redirecting to login...');
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.subtitle}>Sign Up</h2>
        {error && <div style={styles.error}>{error}</div>}
        {success && <div style={styles.success}>{success}</div>}
        <form onSubmit={handleSignUp} style={styles.form}>
          <input type="text" placeholder="Full Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} style={styles.input} required />
          <input type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} style={styles.input} required />
          <input type="password" placeholder="Password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} style={styles.input} required />
          <select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} style={styles.input}>
            <option value="user">User</option>
            <option value="organization">Organization</option>
          </select>
          <button type="submit" style={styles.signupBtn} disabled={loading}>
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>
        <p style={styles.link}><Link to="/login">Already have an account? Login</Link></p>
      </div>
    </div>
  );
}

// Dashboard Component
function Dashboard() {
  const [user, setUser] = useState(null);
  const [certificates, setCertificates] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(userData);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.subtitle}>Dashboard</h2>
        <p><strong>Welcome, {user?.name || 'User'}!</strong></p>
        <p>Role: {user?.role || 'User'}</p>
        <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
      </div>
    </div>
  );
}

// Styles
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: '#f0f2f5',
    padding: '20px',
  },
  card: {
    background: 'white',
    padding: '40px',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    textAlign: 'center',
    maxWidth: '400px',
    width: '100%',
  },
  title: {
    fontSize: '32px',
    color: '#1a1a2e',
    marginBottom: '10px',
  },
  subtitle: {
    fontSize: '20px',
    color: '#666',
    marginBottom: '30px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  input: {
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '16px',
  },
  loginBtn: {
    padding: '12px',
    background: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer',
  },
  signupBtn: {
    padding: '12px',
    background: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer',
  },
  logoutBtn: {
    padding: '12px',
    background: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  error: {
    background: '#ffebee',
    color: '#c62828',
    padding: '10px',
    borderRadius: '5px',
    marginBottom: '15px',
  },
  success: {
    background: '#e8f5e9',
    color: '#2e7d32',
    padding: '10px',
    borderRadius: '5px',
    marginBottom: '15px',
  },
  buttons: {
    display: 'flex',
    justifyContent: 'center',
    gap: '15px',
    marginTop: '20px',
  },
  link: {
    marginTop: '20px',
    color: '#666',
  },
};

function App() {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={
          isAuthenticated ? <Dashboard /> : <Navigate to="/login" />
        } />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
