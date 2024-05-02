import { TutorModel } from "../models/tutor.js";
import { UserModel } from "../models/user.js";
import { StudentModel } from "../models/student.js";
import { validateData } from "../libs/validateData.js";

export class TutorControllers {

    static async getTutorById(req, res) {

        let tutorCode = req.params.id;
        tutorCode = tutorCode.trim();

        const tutor = await TutorModel.getTutorById({ tutor_id: tutorCode })
        if (tutor) return res.status(200).json(tutor);
        res.status(404).json({ message: "No se encontró el tutor, verifica el código" })
    }

    static async getStudents(req, res) {

        const tutorCode = req.params.id;
        const limit = req.query.limit || 10;
        const offset = req.query.offset || 0;

        const students = await StudentModel.getStudens({ tutorCode, limit, offset });
        if (students) return res.status(200).json(students);

        res.status(500).json({ message: 'Error al obtener los alumnos' });
    }

    static async getStudentById(req, res) {
        const studentId = req.params.id;
        const student = await StudentModel.getStudentById({ studentId });
        if (student) return res.status(200).json(student);
        res.status(500).json({ message: 'Error al obtener el alumno' });
    }

    static async searchStudent(req, res) {
        const { query } = req.query;
        const tutor_id = req.params.id;
        const students = await StudentModel.searchStudent({ query, tutor_id })
        if (students) return res.status(200).json(students);
        res.status(500).json({ message: 'Error al buscar el alumno' });
    }
}
