import { UserModel } from "../models/user.js";
import { GenerateToken } from "../auth/generateToken.js";
import { validateData } from "../libs/validateData.js";
import { TutorModel } from "../models/tutor.js";
import { StudentModel } from "../models/student.js";
import { AdminModel } from "../models/admin.js";

export class UserControllers {

    static async register(req, res) {

        const { name, lastName, email, password, code } = validateData.clean(req.body)
        if (!name || !lastName || !email || !password || !code) return res.status(400).json({
            message: 'Todos los campos son requeridos'
        });

        const roleName = await UserModel.validateCode({ code })

        if (!roleName) return res.status(400).json({ message: 'Código o matrícula no valido' })

        if (roleName == 'Administrador') {

            const adminExists = await AdminModel.verifyAdmin({ roleName });
            if (adminExists) return res.status(401).json({ message: 'Ya existe un administrador' });

            const admin = await AdminModel.register({ adminData: { name, lastName, email, password, roleName, code } });

            if (admin) return res.status(200).json(admin);

            return res.status(400).json({ message: 'Código no valido' })

        }

        if (roleName == "Tutor") {

            const tutorExists = await TutorModel.tutorExists(code, email);
            if (tutorExists) return res.status(401).json(tutorExists);

            const validCode = await TutorModel.validateCodeTutor({ code })
            if (validCode) {
                const newTutor = await TutorModel.register({ tutorData: { name, lastName, email, password, roleName, code } })
                if (newTutor) return res.status(200).json(newTutor);
            } else {
                return res.status(400).json({ message: 'Código no valido' })
            }
        }

        if (roleName == "Alumno") {
            const studentExists = await StudentModel.studentExists(code, email);
            if (studentExists) return res.status(401).json(studentExists);

            const newStudent = await StudentModel.register({ userData: { name, lastName, email, password, roleName, code } })
            if (newStudent) return res.status(200).json(newStudent);
        }

        res.status(500).json({ message: 'Error al registrar el usuario' })
    }

    static async login(req, res) {

        const { identifier, password } = validateData.clean(req.body);

        if (!identifier || !password) return res.status(400).json({
            message: 'Todos los campos son requeridos'
        });

        const user = await UserModel.login({ identifier, password });
        if (user) return res.status(200).json(user);

        res.status(401).json({ message: 'Correo, matrícula o contraseña incorrecta' });
    }

    static async getUser(req, res) {

        try {
            const { usuario_id, nombre, apellido, correo, rol } = req.user;
            const token = GenerateToken.createAccessToken({ usuario_id, nombre, apellido, correo, rol });
            res.status(200).json({
                usuario_id: usuario_id, nombre: nombre, apellido: apellido, correo: correo, rol: rol, token: token
            })

        } catch (error) {
            res.status(500).json({ message: 'Error al obtener datos del usuario' })
        }

    }
}