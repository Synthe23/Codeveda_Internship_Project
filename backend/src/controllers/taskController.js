import Task from "../models/Task.js";

function emitTaskEvent(req, event, payload) {
  req.app.get("io")?.emit(event, payload);
}

export async function listTasks(req, res) {
  const filter = req.user.role === "admin" && req.query.all === "true"
    ? {}
    : { owner: req.user._id };

  if (req.query.status) filter.status = req.query.status;
  if (req.query.priority) filter.priority = req.query.priority;

  const tasks = await Task.find(filter)
    .populate("owner", "name email")
    .sort({ createdAt: -1 });

  res.json({ tasks });
}

export async function getTask(req, res) {
  const filter = req.user.role === "admin"
    ? { _id: req.params.id }
    : { _id: req.params.id, owner: req.user._id };

  const task = await Task.findOne(filter).populate("owner", "name email");

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  res.json({ task });
}

export async function createTask(req, res) {
  const task = await Task.create({
    ...req.body,
    owner: req.user._id
  });

  const populated = await task.populate("owner", "name email");

  emitTaskEvent(req, "task:created", populated);

  res.status(201).json({
    message: "Task created",
    task: populated
  });
}

export async function updateTask(req, res) {
  const filter = req.user.role === "admin"
    ? { _id: req.params.id }
    : { _id: req.params.id, owner: req.user._id };

  const task = await Task.findOneAndUpdate(filter, req.body, {
    new: true,
    runValidators: true
  }).populate("owner", "name email");

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  emitTaskEvent(req, "task:updated", task);

  res.json({
    message: "Task updated",
    task
  });
}

export async function deleteTask(req, res) {
  const filter = req.user.role === "admin"
    ? { _id: req.params.id }
    : { _id: req.params.id, owner: req.user._id };

  const task = await Task.findOneAndDelete(filter);

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  emitTaskEvent(req, "task:deleted", { id: task._id });

  res.json({ message: "Task deleted" });
}
