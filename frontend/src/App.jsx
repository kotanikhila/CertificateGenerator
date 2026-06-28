import React, { useState } from 'react';

// Simple Home Component
function Home() {
  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>🎓 Certificate Generator</h1>
      <p>Welcome to the Certificate Generator System</p>
      <div>
        <a href="/login" style={{ margin: '10px', padding: '10px 20px', background: 'blue', color: 'white', textDecoration: 'none', borderRadius: '5px' }}>Login</a>
        <a href="/signup" style={{ margin: '10px', padding: '10px 20px', background: 'green', color: 'white', textDecoration: 'none', borderRadius: '5px' }}>Sign Up</a>
      </div>
    </div>
  );
}

// Simple Login Component
function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

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
        window.location.href = '/dashboard';
      } else {
        setMessage('❌ ' + (data.detail || 'Login failed'));
      }
    } catch (error) {
      setMessage('❌ Network error. Backend not running.');
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h2>Login</h2>
      {message && <p style={{ color: message.includes('successful') ? 'green' : 'red' }}>{message}</p>}
      <form onSubmit={handleLogin} style={{ display: 'inline-block', textAlign: 'left' }}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ display: 'block', margin: '10px', padding: '10px', width: '300px' }} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ display: 'block', margin: '10px', padding: '10px', width: '300px' }} required />
        <button type="submit" style={{ padding: '10px 30px', background: 'blue', color: 'white', border: 'none', borderRadius: '5px' }}>Login</button>
      </form>
      <p><a href="/signup">Don't have an account? Sign Up</a></p>
    </div>
  );
}

// Simple SignUp Component
function SignUp() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'user' });
  const [message, setMessage] = useState('');

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
        setMessage('✅ Registration successful!');
        setTimeout(() => { window.location.href = '/login'; }, 2000);
      } else {
        setMessage('❌ ' + (data.detail || 'Registration failed'));
      }
    } catch (error) {
      setMessage('❌ Network error. Backend not running.');
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h2>Sign Up</h2>
      {message && <p style={{ color: message.includes('successful') ? 'green' : 'red' }}>{message}</p>}
      <form onSubmit={handleSignUp} style={{ display: 'inline-block', textAlign: 'left' }}>
        <input type="text" placeholder="Full Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} style={{ display: 'block', margin: '10px', padding: '10px', width: '300px' }} required />
        <input type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} style={{ display: 'block', margin: '10px', padding: '10px', width: '300px' }} required />
        <input type="password" placeholder="Password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} style={{ display: 'block', margin: '10px', padding: '10px', width: '300px' }} required />
        <select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} style={{ display: 'block', margin: '10px', padding: '10px', width: '300px' }}>
          <option value="user">User</option>
          <option value="organization">Organization</option>
        </select>
        <button type="submit" style={{ padding: '10px 30px', background: 'green', color: 'white', border: 'none', borderRadius: '5px' }}>Sign Up</button>
      </form>
      <p><a href="/login">Already have an account? Login</a></p>
    </div>
  );
}

// Simple Dashboard
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
      <button onClick={handleLogout} style={{ padding: '10px 30px', background: 'red', color: 'white', border: 'none', borderRadius: '5px' }}>Logout</button>
    </div>
  );
}

// Main App - Simple Router
function App() {
  const path = window.location.pathname;
  const isAuthenticated = !!localStorage.getItem('token');

  // Simple routing
  if (path === '/login') return <Login />;
  if (path === '/signup') return <SignUp />;
  if (path === '/dashboard') {
    return isAuthenticated ? <Dashboard /> : <Login />;
  }
  return <Home />;
}

export default App;
