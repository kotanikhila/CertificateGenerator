import { useState } from "react";
import axios from "axios";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });

  const login = async () => {
    try {
      const res = await axios.post("http://127.0.0.1:8000/login", form);
      localStorage.setItem("user", JSON.stringify(res.data));
      window.location.href = "/dashboard";
    } catch (err) {
      alert(err.response?.data?.detail || "Login failed");
    }
  };

  return (
    <div className="page">
      <div className="card">
        <h1>Login</h1>

        <input
          placeholder="Email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button onClick={login}>Login</button>
        <button onClick={() => (window.location.href = "/register")}>
          Sign Up
        </button>
      </div>
    </div>
  );
}

export default Login;