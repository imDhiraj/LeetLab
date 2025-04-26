import express from "express";
import bcrypt from "bcryptjs";
import { db } from "../libs/db.js";
import { userRole } from "../generated/prisma/index.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

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
        error: "User alrady exists",
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

    res.cookie("jwt", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV !== "development",
      maxAge: 1000 * 60 * 60 * 24 * 7, //7 Days
    });

    res.status(201).json({
      sucess:true,
      message: "User created successfully",
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        image: newUser.image || null,
      },
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
        error: "User alrady not exists",
      });
    }

    const isMatched =  await bcrypt.compare(password,user.password)

    if(!isMatched){
        return res.status(401).json({
          error: "Invaild Credentials",
        });
    }

    const token = jwt.sign({id:user.id},process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

     res.cookie("jwt", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV !== "development",
      maxAge: 1000 * 60 * 60 * 24 * 7, //7 Days
    });
     res.status(200).json({
      sucess:true,
      message: "User LoginedIn successfully",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        image: user.image || null,
      },
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
    res.clearCookie("jwt",{
      httpOnly:true,
      sameSite:"strict",
      secure:process.env.JWT_SECRET!== "development",
    })

    res.status(200).json({
      success:true,
      message:"User Logged out Successfully"
    })
    
  } catch (error) {
    console.error("Error loginOut User:", error);
    res.status(500).json({
      error: "Error loginOut user",
    });
  }
};

export const check = async (req, res) => {
  try {
    res.status(200).json({
      success:true,
      message:"User Authenticated Sucessfully",
      user:req.user
    })
  } catch (error) {
    console.error("Error Checking User:", error);
    res.status(500).json({
      error: "Error Checking user",
    });
  }
};
