import { AdminModel } from "../models/admin.js";
import { StudentModel } from "../models/student.js";
import { TutorModel } from "../models/tutor.js";
import { UserModel } from "../models/user.js";
import { validateData } from "../libs/validateData.js";

export class AdminControllers {

    static async newTutor(req, res) {
        const { name, lastName } = validateData.clean(req.body);

        if (!name || !lastName) return res.status(400).json({
            message: "Todos los campos son requeridos"
        });

        const newTutor = await TutorModel.newCode({ tutorData: { name, lastName } });
        if (newTutor) return res.status(200).json(newTutor);

        res.status(500).json({ message: 'Se ha producido un error' });
    }

    static async getUsers(req, res) {
        const users = await UserModel.getAllUsers();
        if (users) return res.status(200).json(users);
        res.status(500).json({ message: 'Se ha producido un error' });
    }

    static async getTutors(req, res) {

        const limit = req.query.limit || 10;
        const offset = req.query.offset || 0;

        const tutors = await TutorModel.getAllTutors(limit, offset);
        if (tutors) return res.status(200).json(tutors);
        res.status(500).json({ message: 'Se ha producido un error' });
    }

    static async getAllStundets(req, res) {
        const students = await StudentModel.getAllStudents();
        if (students) return res.status(200).json(students);
        res.status(500).json({ message: 'Se ha producido un error' });
    }

    static async getCodes(req, res) {
        const codes = await TutorModel.getCodes();
        if (codes) return res.status(200).json(codes);
        res.status(500).json({ message: 'Se ha producido un error' });
    }
}

