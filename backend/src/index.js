import express from'express';
import dotenv from 'dotenv';
import cookiePasser from 'cookie-parser';

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