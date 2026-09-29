import Task from "../models/Task.js";

function requireUser(context) {
  if (!context.user) {
    throw new Error("Authentication required");
  }

  return context.user;
}

function formatTask(task) {
  return {
    id: task._id.toString(),
    title: task.title,
    description: task.description,
    status: task.status.replace("-", "_"),
    priority: task.priority,
    dueDate: task.dueDate?.toISOString() ?? null,
    owner: task.owner,
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString()
  };
}

export const resolvers = {
  Query: {
    me: (_, __, context) => context.user ?? null,

    tasks: async (_, { status, priority }, context) => {
      const user = requireUser(context);
      const filter = { owner: user._id };

      if (status) filter.status = status.replace("_", "-");
      if (priority) filter.priority = priority;

      const tasks = await Task.find(filter).populate("owner", "name email role");
      return tasks.map(formatTask);
    }
  },

  Mutation: {
    createTask: async (_, args, context) => {
      const user = requireUser(context);

      const task = await Task.create({
        title: args.title,
        description: args.description ?? "",
        status: args.status ? args.status.replace("_", "-") : "todo",
        priority: args.priority ?? "medium",
        dueDate: args.dueDate ?? null,
        owner: user._id
      });

      const populated = await task.populate("owner", "name email role");
      return formatTask(populated);
    },

    updateTask: async (_, args, context) => {
      const user = requireUser(context);
      const updates = { ...args };
      delete updates.id;

      if (updates.status) updates.status = updates.status.replace("_", "-");

      const task = await Task.findOneAndUpdate(
        { _id: args.id, owner: user._id },
        updates,
        { new: true, runValidators: true }
      ).populate("owner", "name email role");

      if (!task) throw new Error("Task not found");

      return formatTask(task);
    },

    deleteTask: async (_, { id }, context) => {
      const user = requireUser(context);
      const result = await Task.deleteOne({ _id: id, owner: user._id });
      return result.deletedCount === 1;
    }
  },

  Task: {
    owner: (task) => task.owner
  }
};
