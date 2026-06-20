import { useState } from "react";
import axios from "axios";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const register = async () => {
    try {
      await axios.post("http://127.0.0.1:8000/register", form);
      alert("Registration successful");
      window.location.href = "/";
    } catch (err) {
      alert(err.response?.data?.detail || "Registration failed");
    }
  };

  return (
    <div className="page">
      <div className="card">
        <h1>Sign Up</h1>

        <input
          placeholder="Name"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          placeholder="Email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <select onChange={(e) => setForm({ ...form, role: e.target.value })}>
          <option value="user">Student/User</option>
          <option value="organization">Organization/Foundation</option>
        </select>

        <button onClick={register}>Register</button>
        <button onClick={() => (window.location.href = "/")}>Back</button>
      </div>
    </div>
  );
}

export default Register;