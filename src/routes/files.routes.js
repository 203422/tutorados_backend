import { Router } from "express";
import { FilesControllers } from "../controllers/files.controller.js";
import { authenticate } from "../middlewares/authenticate.js";

export const filesRouter = Router();

filesRouter.get('/student/:id/pdf', authenticate.authenticate(), FilesControllers.createPdf);
filesRouter.get('/student/:id/csv', authenticate.authenticate(), FilesControllers.createCsvPerStudent);
