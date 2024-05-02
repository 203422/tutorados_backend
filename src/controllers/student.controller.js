import { StudentModel } from "../models/student.js";
import { validateData } from "../libs/validateData.js";


export class StudentController {

    static async assignTutor(req, res) {

        const { tutorCode, studentEnrollment } = req.body;

        if (!tutorCode || !studentEnrollment) return res.status(400).json({
            message: "Todos los campos son requeridos"
        });

        const assignedTutor = await StudentModel.assignTutor({ data: req.body });
        if (assignedTutor) return res.status(200).json(assignedTutor);

        res.status(500).json({ message: 'Se ha producido un error al asignar el tutor' });
    }

    static async saveStudentData(req, res) {

        const { userId, name, lastName, career, gender, tutorOrParent, birthdate, age, placeOfBirth, religion, activity } = req.body;

        if (!userId || !name || !lastName || !career || !gender || !tutorOrParent || !birthdate || !age || !placeOfBirth || !religion || !activity) {

            return res.status(400).json({
                message: "Todos los campos son requeridos"
            });
        };

        const cleanData = validateData.clean(req.body);

        const dataSave = await StudentModel.studentData({ studentData: cleanData });
        if (dataSave) return res.status(201).json(dataSave);

        res.status(500).json({ message: 'Error al guardar los datos del alumno' });

    }

    static async saveContactData(req, res) {
        const { userId, currentAddress, homeAddress, cellPhoneNumber, homePhoneNumber, email, tutorsEmail } = req.body;

        if (!userId || !currentAddress || !homeAddress || !cellPhoneNumber || !homePhoneNumber || !email || !tutorsEmail) {
            return res.status(400).json({
                message: "Todos los campos son requeridos"
            });
        }

        const cleanData = validateData.clean(req.body);

        const saveData = await StudentModel.contactData({ contactData: cleanData })
        if (saveData) return res.status(201).json(saveData);

        res.status(500).json({ message: 'Error al guardar los datos' });
    }

    static async saveMedicalData(req, res) {
        const { userId, socialSecurityNumber, bloodType, disease, disability, allergy, sustances } = req.body;

        if (!userId || !socialSecurityNumber || !bloodType || !disease || !disability || !allergy || !sustances) {
            return res.status(400).json({
                message: "Todos los campos son requeridos"
            });
        }

        const cleanData = validateData.clean(req.body);

        const saveData = await StudentModel.medicalData({ medicalData: cleanData })
        if (saveData) return res.status(200).json(saveData);
        res.status(500).json({ message: 'Error al guardar los datos' });
    }

    static async saveAcademicData(req, res) {

        const { userId, highSchool, average, scoreCeneval } = req.body;

        if (!userId || !highSchool || !average || !scoreCeneval) {
            return res.status(400).json({
                message: "Todos los campos son requeridos"
            });
        }

        const cleanData = validateData.clean(req.body);

        const saveData = await StudentModel.academicData({ academicData: cleanData })
        if (saveData) return res.status(200).json(saveData);
        res.status(500).json({ message: 'Error al guardar los datos' });
    }

    static async saveSocioeconomicData(req, res) {
        const { userId, workplace, economicalSupport, livesWith } = req.body;

        if (!userId || !workplace || !economicalSupport || !livesWith) {
            return res.status(400).json({
                message: "Todos los campos son requeridos"
            });
        }

        const cleanData = validateData.clean(req.body);

        const saveData = await StudentModel.socioeconomicData({ socioeconomicData: cleanData });
        if (saveData) return res.status(200).json(saveData);
        res.status(500).json({ message: 'Error al guardar los datos' });
    }

    static async saveImage(req, res) {

        const student_id = req.params.id;
        const file = req.file;
        const savedImage = await StudentModel.saveImage(file, student_id)

        if (savedImage) return res.json(savedImage);
        res.status(500).json({ message: 'Error al guardar la imagen' });

    }

    static async checkProgressForm(req, res) {

        const student_id = req.params.id;

        const section = await StudentModel.checkProgressForm({ student_id });
        if (section) return res.status(200).json(section);

        res.status(500).json({ message: 'Error al obtener el progreso' });
    }

    static async getImageById(req, res) {
        const student_id = req.params.id;
        const image = await StudentModel.getImage(student_id);
        if (image) return res.json(image);
        res.status(500).json({ message: 'Error al obtener la imagen' });
    }
}