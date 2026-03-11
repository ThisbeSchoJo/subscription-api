/**
 * Auth controller – sign up (create user + JWT), sign in (validate credentials + JWT), sign out (stub).
 */
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/user.model.js";
import { JWT_SECRET, JWT_EXPIRES_IN, JWT_REFRESH_SECRET, JWT_REFRESH_EXPIRES_IN } from "../config/env.js";

/** Create a new user, hash password, then return JWT and user. Uses a transaction so we roll back on error. */
export const signUp = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const body = req.body;
    if (!body || typeof body !== "object" || Object.keys(body).length === 0) {
      const error = new Error(
        "Request body is empty or not JSON. In Postman: Body → raw → JSON, and add header Content-Type: application/json"
      );
      error.statusCode = 400;
      throw error;
    }

    const { name, email, password } = body;
    const missing = [].concat(
      !name ? "name" : [],
      !email ? "email" : [],
      !password ? "password" : [],
    );
    if (missing.length) {
      const error = new Error(`Missing required fields: ${missing.join(", ")}`);
      error.statusCode = 400;
      throw error;
    }

    // Check if a user already exists
    // Any query needs to be awaited, otherwise it will return a promise
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      const error = new Error("User already exists");
      error.statusCode = 409;
      throw error;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUsers = await User.create(
      [{ name, email, password: hashedPassword }],
      { session },
    );

    const token = jwt.sign({ userId: newUsers[0]._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });
    const refreshToken = jwt.sign({ userId: newUsers[0]._id }, JWT_REFRESH_SECRET, {
      expiresIn: JWT_REFRESH_EXPIRES_IN,
    });

    await session.commitTransaction();
    session.endSession();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: {
        token,
        user: newUsers[0],
      },
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

export const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const missing = [].concat(
      !email ? "email" : [],
      !password ? "password" : [],
    );
    if (missing.length) {
      const error = new Error(`Missing required fields: ${missing.join(", ")}`);
      error.statusCode = 400;
      throw error;
    }

    const user = await User.findOne({ email });

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      const error = new Error("Invalid password");
      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });
    const refreshToken = jwt.sign({ userId: user._id }, JWT_REFRESH_SECRET, {
      expiresIn: JWT_REFRESH_EXPIRES_IN,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
    });

    res.status(200).json({
      success: true,
      message: "User signed in successfully",
      data: {
        token,
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const signOut = async (req, res, next) => {
  res.cookie("jwt", "", { maxAge: 0 });

  res.cookie("refreshToken", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 0,
  });

  res.status(200).json({
    success: true,
    message: "User signed out successfully",
  });
};

export const refreshToken = async (req, res, next) => {
  try {
    const existingRefreshToken = req.cookies?.refreshToken; 

    if (!existingRefreshToken) {
      const error = new Error("No refresh token provided");
      error.statusCode = 401;
      throw error;
    }

    let payload;
    try {
      payload = jwt.verify(existingRefreshToken, JWT_REFRESH_SECRET);
    } catch (err) {
      const error = new Error("Invalid or expired refresh token");
      error.statusCode = 401;
      throw error;
    }

    const user = await User.findById(payload.userId);
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    const newRefreshToken = jwt.sign(
      { userId: user._id },
      JWT_REFRESH_SECRET,
      { expiresIn: JWT_REFRESH_EXPIRES_IN }
    );

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "Token refreshed successfully",
      data: {
        token,
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};