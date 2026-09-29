import React from "react";
import { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import api from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import TaskCard from "../components/TaskCard.jsx";
import TaskForm from "../components/TaskForm.jsx";

export default function Dashboard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [editing, setEditing] = useState(null);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [live, setLive] = useState(false);

  async function loadTasks() {
    try {
      setError("");
      const { data } = await api.get("/tasks");
      setTasks(data.tasks);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load tasks");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    const socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:3000", {
      withCredentials: true
    });

    socket.on("connect", () => {
      setLive(true);
      socket.emit("join:user", user?.id);
    });

    socket.on("disconnect", () => setLive(false));

    socket.on("task:created", loadTasks);
    socket.on("task:updated", loadTasks);
    socket.on("task:deleted", loadTasks);

    return () => socket.disconnect();
  }, [user?.id]);

  async function saveTask(payload) {
    try {
      if (editing) {
        await api.patch(`/tasks/${editing._id}`, payload);
      } else {
        await api.post("/tasks", payload);
      }

      setEditing(null);
      await loadTasks();
    } catch (err) {
      setError(err.response?.data?.message || "Could not save task");
    }
  }

  async function deleteTask(id) {
    if (!window.confirm("Delete this task?")) return;

    try {
      await api.delete(`/tasks/${id}`);
      await loadTasks();
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete task");
    }
  }

  const visibleTasks = useMemo(
    () => filter === "all" ? tasks : tasks.filter((task) => task.status === filter),
    [tasks, filter]
  );

  const stats = {
    total: tasks.length,
    active: tasks.filter((task) => task.status !== "done").length,
    done: tasks.filter((task) => task.status === "done").length
  };

  return (
    <>
      <section className="hero">
        <div>
          <p className="eyebrow">YOUR WORKSPACE</p>
          <h1>Build. Ship. <span>Repeat.</span></h1>
          <p className="hero-copy">A task manager with JWT auth, MongoDB, REST, GraphQL and real-time Socket.io updates.</p>
        </div>
        <div className={`live-pill ${live ? "online" : ""}`}>
          <span /> {live ? "Realtime connected" : "Connecting…"}
        </div>
      </section>

      <section className="stats">
        <div><span>Total</span><strong>{stats.total}</strong></div>
        <div><span>Active</span><strong>{stats.active}</strong></div>
        <div><span>Completed</span><strong>{stats.done}</strong></div>
      </section>

      <div className="dashboard-grid">
        <TaskForm task={editing} onSubmit={saveTask} onCancel={() => setEditing(null)} />

        <section className="task-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">TASK BOARD</p>
              <h2>Your tasks</h2>
            </div>
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="all">All</option>
              <option value="todo">To do</option>
              <option value="in-progress">In progress</option>
              <option value="done">Done</option>
            </select>
          </div>

          {error && <div className="alert">{error}</div>}

          {loading ? (
            <div className="empty">Loading tasks…</div>
          ) : visibleTasks.length === 0 ? (
            <div className="empty">No tasks here yet. Create one on the left.</div>
          ) : (
            <div className="task-list">
              {visibleTasks.map((task) => (
                <TaskCard key={task._id} task={task} onEdit={setEditing} onDelete={deleteTask} />
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
