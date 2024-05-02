import express, { json } from "express";
import 'dotenv/config';
import { userRouter } from "./routes/user.routes.js";
import { studentRouter } from "./routes/student.routes.js";
import { tutorRouter } from "./routes/tutor.routes.js";
import { filesRouter } from "./routes/files.routes.js";
import { adminRouter } from "./routes/admin.routes.js";
import { fileURLToPath } from 'url';
import path from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const port = process.env.PORT_APP || 3001;

const app = express();

app.use(json());

app.use(express.static(path.join(rootDir, 'images')));
app.use('/user', userRouter);
app.use('/student', studentRouter);
app.use('/tutor', tutorRouter);
app.use('/files', filesRouter);
app.use('/admin', adminRouter);

app.listen(port, () => {
    console.log('Servidor ejecutándose en el puerto:', port);
}); 