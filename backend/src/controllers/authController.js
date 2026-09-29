import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { signToken } from "../utils/jwt.js";

function setAuthCookie(res, token) {
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
}

function publicUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role
  };
}

export async function register(req, res) {
  const { name, email, password, role } = req.body;

  const exists = await User.findOne({ email: email.toLowerCase() });
  if (exists) {
    return res.status(409).json({ message: "Email is already registered" });
  }

  const requestedRole = role === "admin" && process.env.ALLOW_ADMIN_REGISTRATION === "true"
    ? "admin"
    : "user";

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password: passwordHash,
    role: requestedRole
  });

  setAuthCookie(res, signToken(user));

  res.status(201).json({
    message: "Registration successful",
    user: publicUser(user)
  });
}

export async function login(req, res) {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() }).select("+password");

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  setAuthCookie(res, signToken(user));

  res.json({
    message: "Login successful",
    user: publicUser(user)
  });
}

export function logout(req, res) {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
}

export function me(req, res) {
  res.json({ user: publicUser(req.user) });
}
