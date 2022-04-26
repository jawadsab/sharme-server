import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';

// import routes
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import pinRoutes from './routes/pin.js';
import commentRoutes from "./routes/comment.js";

const app = express();

// middlewares
app.use(bodyParser.json());
app.use(cors());

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/pins', pinRoutes);
app.use('/api/comments', commentRoutes);

// connect to database
// const DB_URL = 'mongodb://localhost:27017/socialmedia_db';
const DB_URL = process.env.MONGO_URL;
mongoose
  .connect(DB_URL)
  .then(() => {
    console.log('Connected to Database');
  })
  .catch((error) => {
    console.log(error);
  });

  app.get("/",(req,res) => {
    res.send("Welcome to shareme server");
  })

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server is runnning at port ${PORT}`));
