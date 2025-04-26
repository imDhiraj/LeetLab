import express from'express';
import dotenv from 'dotenv';
import cookiePasser from 'cookie-parser';

import authRoutes from './routes/auth.routes.js';


dotenv.config();
const port = process.env.PORT||4000;
const app = express();

app.use(express.json());
app.use(cookiePasser());


app.get('/',(req ,res)=>{
    res.send("Hello Guys Welcome to LeetLab 😊")
})

app.use("/api/v1/auth",authRoutes)

app.listen(port,()=>{
    console.log("Server is listening to" ,port);
})