import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Home Component
function Home() {
  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>🎓 Certificate Generator</h1>
      <p>Welcome to the Certificate Generator and Verification System</p>
      <div style={{ marginTop: '30px' }}>
        <a href="/login" style={{ margin: '10px', padding: '10px 20px', background: '#007bff', color: 'white', textDecoration: 'none', borderRadius: '5px' }}>Login</a>
        <a href="/signup" style={{ margin: '10px', padding: '10px 20px', background: '#28a745', color: 'white', textDecoration: 'none', borderRadius: '5px' }}>Sign Up</a>
      </div>
    </div>
  );
}

// Login Component
function Login() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [message, setMessage] = React.useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('Logging in...');
    
    try {
      const response = await fetch('https://certificategenerator-production-695e.up.railway.app/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setMessage('✅ Login successful!');
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data));
      } else {
        setMessage('❌ ' + (data.detail || 'Login failed'));
      }
    } catch (error) {
      setMessage('❌ Network error. Make sure the backend is running.');
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h2>Login</h2>
      {message && <p style={{ color: message.includes('successful') ? 'green' : 'red' }}>{message}</p>}
      <form onSubmit={handleLogin} style={{ display: 'inline-block', textAlign: 'left' }}>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ padding: '10px', width: '300px', border: '1px solid #ccc', borderRadius: '5px' }}
            required
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ padding: '10px', width: '300px', border: '1px solid #ccc', borderRadius: '5px' }}
            required
          />
        </div>
        <button type="submit" style={{ padding: '10px 30px', background: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          Login
        </button>
      </form>
      <p><a href="/signup">Don't have an account? Sign Up</a></p>
    </div>
  );
}

// SignUp Component
function SignUp() {
  const [formData, setFormData] = React.useState({ name: '', email: '', password: '', role: 'user' });
  const [message, setMessage] = React.useState('');

  const handleSignUp = async (e) => {
    e.preventDefault();
    setMessage('Registering...');
    
    try {
      const response = await fetch('https://certificategenerator-production-695e.up.railway.app/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setMessage('✅ Registration successful! Redirecting to login...');
        setTimeout(() => { window.location.href = '/login'; }, 2000);
      } else {
        setMessage('❌ ' + (data.detail || 'Registration failed'));
      }
    } catch (error) {
      setMessage('❌ Network error. Make sure the backend is running.');
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h2>Sign Up</h2>
      {message && <p style={{ color: message.includes('successful') ? 'green' : 'red' }}>{message}</p>}
      <form onSubmit={handleSignUp} style={{ display: 'inline-block', textAlign: 'left' }}>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="text"
            placeholder="Full Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            style={{ padding: '10px', width: '300px', border: '1px solid #ccc', borderRadius: '5px' }}
            required
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            style={{ padding: '10px', width: '300px', border: '1px solid #ccc', borderRadius: '5px' }}
            required
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            style={{ padding: '10px', width: '300px', border: '1px solid #ccc', borderRadius: '5px' }}
            required
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <select
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            style={{ padding: '10px', width: '300px', border: '1px solid #ccc', borderRadius: '5px' }}
          >
            <option value="user">User</option>
            <option value="organization">Organization</option>
          </select>
        </div>
        <button type="submit" style={{ padding: '10px 30px', background: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          Register
        </button>
      </form>
      <p><a href="/login">Already have an account? Login</a></p>
    </div>
  );
}

// Dashboard Component (protected route)
function Dashboard() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>Dashboard</h1>
      <p>Welcome, {user.name || 'User'}!</p>
      <p>Role: {user.role || 'User'}</p>
      <button onClick={handleLogout} style={{ padding: '10px 30px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
        Logout
      </button>
    </div>
  );
}

// App Component
function App() {
  const isAuthenticated = localStorage.getItem('token');

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={
          isAuthenticated ? <Dashboard /> : <Navigate to="/login" />
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
