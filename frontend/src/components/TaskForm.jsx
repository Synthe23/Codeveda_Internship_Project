import React from "react";
import { useEffect, useState } from "react";

const empty = {
  title: "",
  description: "",
  status: "todo",
  priority: "medium",
  dueDate: ""
};

export default function TaskForm({ task, onSubmit, onCancel }) {
  const [form, setForm] = useState(empty);

  useEffect(() => {
    setForm(task
      ? {
          title: task.title,
          description: task.description || "",
          status: task.status,
          priority: task.priority,
          dueDate: task.dueDate ? task.dueDate.slice(0, 10) : ""
        }
      : empty
    );
  }, [task]);

  function change(event) {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value
    }));
  }

  async function submit(event) {
    event.preventDefault();
    await onSubmit({
      ...form,
      dueDate: form.dueDate || null
    });
    if (!task) setForm(empty);
  }

  return (
    <form className="task-form" onSubmit={submit}>
      <div className="form-heading">
        <div>
          <p className="eyebrow">{task ? "UPDATE TASK" : "NEW TASK"}</p>
          <h2>{task ? "Edit task" : "Create a task"}</h2>
        </div>
      </div>

      <label>
        Title
        <input name="title" value={form.title} onChange={change} placeholder="e.g. Build REST API" required />
      </label>

      <label>
        Description
        <textarea name="description" value={form.description} onChange={change} placeholder="What needs to be done?" rows="4" />
      </label>

      <div className="two-col">
        <label>
          Status
          <select name="status" value={form.status} onChange={change}>
            <option value="todo">To do</option>
            <option value="in-progress">In progress</option>
            <option value="done">Done</option>
          </select>
        </label>

        <label>
          Priority
          <select name="priority" value={form.priority} onChange={change}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </label>
      </div>

      <label>
        Due date
        <input type="date" name="dueDate" value={form.dueDate} onChange={change} />
      </label>

      <div className="form-actions">
        {task && <button type="button" className="secondary-button" onClick={onCancel}>Cancel</button>}
        <button className="primary-button" type="submit">{task ? "Save changes" : "Add task"}</button>
      </div>
    </form>
  );
}
