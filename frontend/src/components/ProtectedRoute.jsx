import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) return <div className="screen-center">Loading session…</div>;

  return user ? <Outlet /> : <Navigate to="/login" replace />;
}
