import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  async function submit(event) {
    event.preventDefault();
    setError("");

    try {
      await login(form.email, form.password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to login");
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <p className="eyebrow">CODVEDA • FULL STACK</p>
        <h1>Welcome back.</h1>
        <p className="muted">Sign in to manage your TaskFlow workspace.</p>

        {error && <div className="alert">{error}</div>}

        <form onSubmit={submit}>
          <label>Email<input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></label>
          <label>Password<input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required /></label>
          <button className="primary-button full" type="submit">Sign in</button>
        </form>

        <p className="auth-footer">New here? <Link to="/register">Create an account</Link></p>
      </div>
    </div>
  );
}
