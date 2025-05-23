import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { addProblemToPlaylist, createPlaylist, deletePlayList, getAllListDetsils, getPlayListDetsils, removeProblemFromPlayList } from "../controllers/playlist.controller.js";


const playListRoutes = express.Router();

playListRoutes.get("/", authMiddleware, getAllListDetsils);
playListRoutes.get("/:playlistId", authMiddleware, getPlayListDetsils);
playListRoutes.post("/cerate-playlist", authMiddleware, createPlaylist);
playListRoutes.post("/:playlistId/add-problem", authMiddleware, addProblemToPlaylist);
playListRoutes.delete("/:playlistId", authMiddleware, deletePlayList);

playListRoutes.delete("/:playlistId/remove-problem", authMiddleware, removeProblemFromPlayList);


export default playListRoutes;