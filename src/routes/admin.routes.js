import { Router } from "express";
import { authenticate } from "../middlewares/authenticate.js";
import { AdminControllers } from "../controllers/admin.controller.js";
import { TutorControllers } from "../controllers/tutor.controller.js";

export const adminRouter = Router();

adminRouter.post('/tutor/register', authenticate.authenticate(), AdminControllers.newTutor);
adminRouter.get('/users', authenticate.authenticate(), AdminControllers.getUsers);
adminRouter.get('/tutors', authenticate.authenticate(), AdminControllers.getTutors);
adminRouter.get('/students', authenticate.authenticate(), AdminControllers.getAllStundets);
adminRouter.get('/codes', authenticate.authenticate(), AdminControllers.getCodes);