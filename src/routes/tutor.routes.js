import { Router } from "express";
import { TutorControllers } from "../controllers/tutor.controller.js";
import { authenticate } from "../middlewares/authenticate.js";

export const tutorRouter = Router();

tutorRouter.get('/:id/students', authenticate.authenticate(), TutorControllers.getStudents);
tutorRouter.get('/students/:id', authenticate.authenticate(), TutorControllers.getStudentById);
tutorRouter.get('/:id/search/student', TutorControllers.searchStudent); 
