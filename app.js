require('dotenv').config({});
const express=require('express');
const authRouter = require('./router/authRoute');
const databaseconnect = require('./config/databaseConfig');
const cookieParser = require('cookie-parser');
const cors=require('cors');

databaseconnect();
const app=express();
app.use(cookieParser());
app.use(express.json())
app.use(cors({
    origin:[process.env.CLIENT_URL],
    credentials:true
}))

app.use('/api/auth',authRouter);


module.exports=app;