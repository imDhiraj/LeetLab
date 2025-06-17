import express from'express';
import dotenv from 'dotenv';
import cookiePasser from 'cookie-parser';
import cors from "cors"

import authRoutes from './routes/auth.routes.js';
import problemRoutes from './routes/problem.route.js';
import excutionRoute from './routes/excutionCode.route.js';
import submissionRoutes from './routes/submission.routes.js';
import playListRoutes from './routes/playlist.routes.js';


dotenv.config();
const port = process.env.PORT||4000;
const app = express();

app.use(express.json());
app.use(cookiePasser());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://leetlab-production-5d58.up.railway.app",
      "https://leet-jv2m8mf6k-dhirajs-projects-f59cb973.vercel.app",
      "https://aleetlabs.co.in",
      "www.aleetlabs.co.in",
      "https://www.aleetlabs.co.in/",
      "https://www.aleetlabs.co.in",

      "https://leet-lab-imdhirajs-projects.vercel.app/login" ,
      "https://leet-lab-git-main-imdhirajs-projects.vercel.app/login",
      "https://leet-lab-one.vercel.app/login",
      
      
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  })
);


app.get('/',(req ,res)=>{
    res.send("Hello Guys Welcome to LeetLab 😊")
})

app.use("/api/v1/auth",authRoutes)
app.use("/api/v1/problems",problemRoutes)
app.use('/api/v1/excute-code',excutionRoute)
app.use("/api/v1/submission", submissionRoutes);
app.use("/api/v1/playlist", playListRoutes)

app.listen(port,()=>{
    console.log("Server is listening to" ,port);
})  