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
    const { username, email, age, password } = req.body;

    if (!username || !email || !age || !password) {
      return res.status(400).json({
        success: false,
        message: "Please give us the required fields to continue!",
      });
    }

    // Email regex
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email!",
      });
    }

    // Existing user
    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { username }],
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Username or email already exists!",
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
      success: true,
      message: "User registered successfully!",
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
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

/**
 * @route - POST /api/auth/login
 * @description - Login the user
 * @access - public
 */

const loginUserController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please enter your email and the password",
      });
    }

    // find the email of user in db
    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password!",
      });
    }

    // check if the email has the valid password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password!",
      });
    }

    // create a jwt token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_TOKEN, {
      expiresIn: "45m",
    });

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
    });

    const { password: _, ...userInfo } = user._doc;

    return res.status(200).json({
      success: true,
      message: "Login successful!",
      user: userInfo,
      token,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong!",
      error: error.message,
    });
  }
};

export { registerUserController, loginUserController };
