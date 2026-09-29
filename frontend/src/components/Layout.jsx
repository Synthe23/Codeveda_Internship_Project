import React from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <Link className="brand" to="/">Task<span>Flow</span></Link>

        <nav>
          <NavLink to="/" end>Dashboard</NavLink>
          {user?.role === "admin" && <NavLink to="/users">Users</NavLink>}
        </nav>

        <div className="profile">
          <span>{user?.name}</span>
          <button className="ghost-button" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
