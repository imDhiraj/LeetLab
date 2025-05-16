import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { excuteCode } from "../controllers/excuteCode.controller.js";


const excutionRoute = express.Router();

excutionRoute.post("/" , authMiddleware , excuteCode)

export default excutionRoute;