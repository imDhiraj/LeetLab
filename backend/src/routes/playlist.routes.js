import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";


const problemPlaylist = express.Router();

problemPlaylist.post("/problemPlaylist", authMiddleware, problemPlaylist);

export default problemPlaylist;