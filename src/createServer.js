import express from 'express';
import 'dotenv/config';
import { authRouter } from './routes/auth.route.js';
import  cors  from 'cors';



export function createServer() {
  const app = express();
  app.use(express.json());

  app.use(cors({
    origin: process.env.CLIENT_HOST,
    credentials:true
  }));

  app.use(authRouter);
  app.get('/', (req, res) => {
  res.send("hello")
  })
  return app;
}


