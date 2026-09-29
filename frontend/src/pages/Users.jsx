import React from "react";
import { useEffect, useState } from "react";
import api from "../services/api.js";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/users")
      .then(({ data }) => setUsers(data.users))
      .catch((err) => setError(err.response?.data?.message || "Unable to load users"));
  }, []);

  return (
    <section>
      <div className="section-heading page-heading">
        <div>
          <p className="eyebrow">ADMIN</p>
          <h1>Users</h1>
        </div>
      </div>

      {error && <div className="alert">{error}</div>}

      <div className="user-table">
        <div className="user-row user-header"><span>Name</span><span>Email</span><span>Role</span></div>
        {users.map((user) => (
          <div className="user-row" key={user._id}>
            <span>{user.name}</span>
            <span>{user.email}</span>
            <span className="badge">{user.role}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
