import { Router } from "express";
import { UserControllers } from "../controllers/user.controller.js";
import { authenticate } from "../middlewares/authenticate.js";

export const userRouter = Router();

userRouter.get('/', authenticate.authenticate(), UserControllers.getUser);
userRouter.post('/login', UserControllers.login);
userRouter.post('/register', UserControllers.register)
