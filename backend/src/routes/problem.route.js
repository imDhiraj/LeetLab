import express from 'express';
import { authMiddleware, checkAdmin } from '../middleware/auth.middleware.js';
import { createProblem, deleteProblem, getAllProblems, getProblemById, getProblemsSovledByUser, updateProblemById } from '../controllers/problem.controller.js';

const problemRoutes = express.Router();

problemRoutes.post('/createProblem',authMiddleware ,checkAdmin, createProblem)

problemRoutes.get("/get-all-problem", authMiddleware, getAllProblems );
problemRoutes.get("/getProblem/:id", authMiddleware, getProblemById );

problemRoutes.put("/update-problem/:id", authMiddleware, checkAdmin, updateProblemById);
problemRoutes.delete("/deleteProblem/:id", authMiddleware, checkAdmin, deleteProblem);

problemRoutes.get("/get-solved-problem", authMiddleware,  getProblemsSovledByUser);

    

export default problemRoutes;