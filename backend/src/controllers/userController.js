import User from "../models/User.js";

export async function listUsers(req, res) {
  const users = await User.find().select("-password").sort({ createdAt: -1 });
  res.json({ users });
}

export async function getUser(req, res) {
  const user = await User.findById(req.params.id).select("-password");

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json({ user });
}
