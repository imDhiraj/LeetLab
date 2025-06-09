import express from "express";
import bcrypt from "bcryptjs";
import { db } from "../libs/db.js";
import { userRole } from "../generated/prisma/index.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

// Cookie configuration for cross-domain
const getCookieConfig = () => {
  const isProduction = process.env.NODE_ENV === "production";

  return {
    httpOnly: true,
    sameSite: isProduction ? "none" : "strict", // 'none' for cross-domain in production
    secure: isProduction, // true in production for HTTPS
    domain: isProduction ? ".railway.app" : undefined, // Allow subdomain sharing in production
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 Days
  };
};

export const register = async (req, res) => {
  const { email, password, name } = req.body;
  try {
    const existingUser = await db.user.findUnique({
      where: {
        email,
      },
    });
    if (existingUser) {
      return res.status(400).json({
        error: "User already exists",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await db.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: userRole.USER,
      },
    });
    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Set cookie with cross-domain configuration
    res.cookie("jwt", token, getCookieConfig());

    res.status(201).json({
      success: true, // Fixed typo: 'sucess' -> 'success'
      message: "User created successfully",
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        image: newUser.image || null,
      },
      token: token, // Also return token in response for frontend storage
    });
  } catch (error) {
    console.error("Error Creating User:", error);
    res.status(500).json({
      error: "Error creating user",
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await db.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      return res.status(400).json({
        error: "User Not Found", // Fixed typo
      });
    }
    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) {
      return res.status(401).json({
        error: "Invalid Credentials", // Fixed typo
      });
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Set cookie with cross-domain configuration
    res.cookie("jwt", token, getCookieConfig());

    res.status(200).json({
      success: true, // Fixed typo: 'sucess' -> 'success'
      message: "User logged in successfully",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        image: user.image || null,
      },
      token: token, // Also return token in response for frontend storage
    });
  } catch (error) {
    console.error("Error login User:", error);
    res.status(500).json({
      error: "Error login user",
    });
  }
};

export const logout = async (req, res) => {
  try {
    // Clear cookie with same configuration used to set it
    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      secure: process.env.NODE_ENV === "production", // Fixed: was checking JWT_SECRET
      domain:
        process.env.NODE_ENV === "production" ? ".railway.app" : undefined,
    });

    res.status(200).json({
      success: true,
      message: "User logged out successfully",
    });
  } catch (error) {
    console.error("Error logging out User:", error);
    res.status(500).json({
      error: "Error logging out user",
    });
  }
};

export const check = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: "User authenticated successfully", // Fixed typo
      user: req.user,
    });
  } catch (error) {
    console.error("Error Checking User:", error);
    res.status(500).json({
      error: "Error checking user",
    });
  }
};
