import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  async function submit(event) {
    event.preventDefault();
    setError("");

    try {
      await register(form.name, form.email, form.password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to register");
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <p className="eyebrow">TASKFLOW</p>
        <h1>Create your account.</h1>
        <p className="muted">A clean full-stack demo for the Codveda internship tasks.</p>

        {error && <div className="alert">{error}</div>}

        <form onSubmit={submit}>
          <label>Name<input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required minLength="2" /></label>
          <label>Email<input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></label>
          <label>Password<input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength="8" /></label>
          <button className="primary-button full" type="submit">Create account</button>
        </form>

        <p className="auth-footer">Already registered? <Link to="/login">Sign in</Link></p>
      </div>
    </div>
  );
}
