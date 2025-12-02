import express from 'express';
import { userController } from '../controllers/user.controller.js';
import { authMiddlewares } from '../middlewares/authMiddlewares.js';
import { catchError } from '../utils/catchError.js';

export const userRouter = new express.Router();

userRouter.get(
  '/',
  authMiddlewares,
  catchError(userController.getAllActivated),
);
