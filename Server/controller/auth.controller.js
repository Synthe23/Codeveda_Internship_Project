import express from "express";
import User from "../model/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

/**
 * @route - POST /api/auth/register
 * @description - Register the user
 * @access - public
 */

const registerUserController = async (req, res) => {
  try {
    const { name, email, age, password } = req.body;
    if (!name || !email || !age || !password) {
      return res.status(400).json({
        success: false,
        message: "Please give us the required fields to continue!",
      });
    }
    // password regex
    const passwordRegex = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$";

    if (!passwordRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email!",
      });
    }

    // existing user
    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { username }],
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User name or email already exists!",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email: email.toLowerCase(),
      password: hashedPassword,
      age,
    });

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_TOKEN, {
      expiresIn: "30m",
    });

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
    });

    return res.status(201).json({
      message: "User registerd succesfully!",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt,
        createdAtFormatted: new Date(newUser.createdAt).toLocaleString(),
      },
      token,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};
