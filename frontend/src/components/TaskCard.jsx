import React from "react";
export default function TaskCard({ task, onEdit, onDelete }) {
  return (
    <article className="task-card">
      <div className="task-card-top">
        <span className={`badge status-${task.status}`}>{task.status.replace("-", " ")}</span>
        <span className={`priority priority-${task.priority}`}>{task.priority}</span>
      </div>

      <h3>{task.title}</h3>
      {task.description && <p>{task.description}</p>}

      <div className="task-meta">
        <span>{task.dueDate ? `Due ${new Date(task.dueDate).toLocaleDateString()}` : "No due date"}</span>
        <span>{new Date(task.createdAt).toLocaleDateString()}</span>
      </div>

      <div className="card-actions">
        <button onClick={() => onEdit(task)}>Edit</button>
        <button className="danger-button" onClick={() => onDelete(task._id)}>Delete</button>
      </div>
    </article>
  );
}
