import express from "express";
import { Router } from "express";
import {
  getAllUsersController,
  registerUserController,
  loginUserController,
  logoutUserController,
  updateUserController,
  deleteUserController,
} from "../controller/auth.controller.js";

const authRouter = Router();

/**
 * @route - GET /api/auth/users
 * @description - Get all the registered users
 * @access - private
 */

authRouter.post("/users", authMiddleware, getAllUsersController);

/**
 * @route - POST /api/auth/register
 * @description - Register the user
 * @access - public
 */

authRouter.post("/register", registerUserController);

/**
 * @route - POST /api/auth/login
 * @description - Login the user if exists
 * @access - private
 */

authRouter.post("/login", authMiddleware, loginUserController);

/**
 * @route - POST /api/auth/logout
 * @description - Logout the user
 * @access - private
 */

authRouter.post("/logout", authMiddleware, logoutUserController);

/**
 * @route - PATCH /api/auth/update
 * @description - Update the user information
 * @access - private
 */

authRouter.post("/updateUser", authMiddleware, updateUserController);

/**
 * @route - DELETE /api/auth/delete
 * @description - Delete the user
 * @access - private
 */

authRouter.post("/deleteUser", authMiddleware, deleteUserController);

export default authRouter;
