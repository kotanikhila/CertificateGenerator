import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import { api } from './services/api';

// ========== STYLES ==========
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '20px',
  },
  card: {
    background: 'white',
    padding: '40px',
    borderRadius: '10px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
    textAlign: 'center',
    maxWidth: '400px',
    width: '100%',
  },
  dashboardContainer: {
    padding: '20px',
    maxWidth: '800px',
    margin: '0 auto',
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
    transition: 'border-color 0.3s',
  },
  inputFocus: {
    borderColor: '#667eea',
    outline: 'none',
  },
  loginBtn: {
    padding: '12px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'transform 0.2s',
  },
  signupBtn: {
    padding: '12px',
    background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'transform 0.2s',
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
    borderLeft: '4px solid #c62828',
  },
  success: {
    background: '#e8f5e9',
    color: '#2e7d32',
    padding: '10px',
    borderRadius: '5px',
    marginBottom: '15px',
    borderLeft: '4px solid #2e7d32',
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
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    padding: '20px',
    background: 'white',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  list: {
    listStyle: 'none',
    padding: 0,
  },
  listItem: {
    padding: '10px',
    borderBottom: '1px solid #eee',
  },
  loading: {
    textAlign: 'center',
    padding: '50px',
    fontSize: '20px',
  },
};

// ========== HOME COMPONENT ==========
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

// ========== LOGIN COMPONENT ==========
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
          <input 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            style={styles.input} 
            required 
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            style={styles.input} 
            required 
          />
          <button type="submit" style={styles.loginBtn} disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p style={styles.link}><Link to="/signup">Don't have an account? Sign Up</Link></p>
      </div>
    </div>
  );
}

// ========== SIGNUP COMPONENT ==========
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
          <input 
            type="text" 
            placeholder="Full Name" 
            value={formData.name} 
            onChange={(e) => setFormData({...formData, name: e.target.value})} 
            style={styles.input} 
            required 
          />
          <input 
            type="email" 
            placeholder="Email" 
            value={formData.email} 
            onChange={(e) => setFormData({...formData, email: e.target.value})} 
            style={styles.input} 
            required 
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={formData.password} 
            onChange={(e) => setFormData({...formData, password: e.target.value})} 
            style={styles.input} 
            required 
          />
          <select 
            value={formData.role} 
            onChange={(e) => setFormData({...formData, role: e.target.value})} 
            style={styles.input}
          >
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

// ========== DASHBOARD COMPONENT ==========
function Dashboard() {
  const [user, setUser] = useState(null);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(userData);
    fetchCertificates();
  }, [navigate]);

  const fetchCertificates = async () => {
    try {
      const response = await api.get('/all-certificates');
      setCertificates(response.data || []);
    } catch (error) {
      console.error('Error fetching certificates:', error);
      setError('Failed to load certificates');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) {
    return <div style={styles.loading}>Loading...</div>;
  }

  return (
    <div style={styles.dashboardContainer}>
      <div style={styles.header}>
        <h1>🎓 Dashboard</h1>
        <div style={styles.headerRight}>
          <span>Welcome, {user?.name || 'User'}!</span>
          <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
        </div>
      </div>
      {error && <div style={styles.error}>{error}</div>}
      <div style={{...styles.card, maxWidth: '100%'}}>
        <h3>Profile Information</h3>
        <p><strong>Name:</strong> {user?.name}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Role:</strong> {user?.role}</p>
      </div>
      <div style={{...styles.card, maxWidth: '100%'}}>
        <h3>Your Certificates</h3>
        {certificates.length === 0 ? (
          <p>No certificates found.</p>
        ) : (
          <ul style={styles.list}>
            {certificates.map((cert) => (
              <li key={cert.id} style={styles.listItem}>
                <strong>{cert.student_name}</strong> - {cert.achievement}
                <br />
                <small>Code: {cert.certificate_code}</small>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div style={{...styles.card, maxWidth: '100%'}}>
        <Link to="/generate" style={{...styles.loginBtn, display: 'inline-block', padding: '12px 30px'}}>
          Generate Certificate
        </Link>
      </div>
    </div>
  );
}

// ========== GENERATE CERTIFICATE COMPONENT ==========
function GenerateCertificate() {
  const [formData, setFormData] = useState({
    student_name: '',
    student_email: '',
    achievement: '',
    event_name: '',
    organization_name: '',
    course_details: '',
    template_name: 'Template 1',
    font_size: 20,
    font_style: 'Helvetica',
    expiry_date: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const response = await api.post(/generate-certificate/, formData);
      if (response.data) {
        setSuccess('Certificate generated successfully!');
        setTimeout(() => navigate('/dashboard'), 2000);
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to generate certificate. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={{...styles.card, maxWidth: '500px'}}>
        <h2 style={styles.subtitle}>Generate Certificate</h2>
        {error && <div style={styles.error}>{error}</div>}
        {success && <div style={styles.success}>{success}</div>}
        <form onSubmit={handleSubmit} style={styles.form}>
          <input 
            type="text" 
            placeholder="Student Name" 
            value={formData.student_name} 
            onChange={(e) => setFormData({...formData, student_name: e.target.value})} 
            style={styles.input} 
            required 
          />
          <input 
            type="email" 
            placeholder="Student Email" 
            value={formData.student_email} 
            onChange={(e) => setFormData({...formData, student_email: e.target.value})} 
            style={styles.input} 
            required 
          />
          <input 
            type="text" 
            placeholder="Achievement" 
            value={formData.achievement} 
            onChange={(e) => setFormData({...formData, achievement: e.target.value})} 
            style={styles.input} 
            required 
          />
          <input 
            type="text" 
            placeholder="Event Name" 
            value={formData.event_name} 
            onChange={(e) => setFormData({...formData, event_name: e.target.value})} 
            style={styles.input} 
            required 
          />
          <input 
            type="text" 
            placeholder="Organization Name" 
            value={formData.organization_name} 
            onChange={(e) => setFormData({...formData, organization_name: e.target.value})} 
            style={styles.input} 
            required 
          />
          <input 
            type="text" 
            placeholder="Course Details" 
            value={formData.course_details} 
            onChange={(e) => setFormData({...formData, course_details: e.target.value})} 
            style={styles.input} 
          />
          <input 
            type="date" 
            placeholder="Expiry Date" 
            value={formData.expiry_date} 
            onChange={(e) => setFormData({...formData, expiry_date: e.target.value})} 
            style={styles.input} 
          />
          <button type="submit" style={styles.loginBtn} disabled={loading}>
            {loading ? 'Generating...' : 'Generate Certificate'}
          </button>
        </form>
        <p style={styles.link}><Link to="/dashboard">Back to Dashboard</Link></p>
      </div>
    </div>
  );
}

// ========== MAIN APP ==========
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
        <Route path="/generate" element={
          isAuthenticated ? <GenerateCertificate /> : <Navigate to="/login" />
        } />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
