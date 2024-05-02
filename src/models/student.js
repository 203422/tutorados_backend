import { pool } from '../db/database.js';
import bcrypt from 'bcryptjs';
import fs from 'node:fs';
import sharp from 'sharp';

export class StudentModel {
    static async register({ userData }) {

        const { name, lastName, code, email, password, roleName } = userData;

        try {
            const [id] = await pool.query(
                'SELECT rol_id FROM rol WHERE rol_nombre = ?',
                [roleName]
            );

            const roleId = id[0].rol_id;

            const encryptedPassword = await this.encryptPassword({ password });

            await pool.query(
                'INSERT INTO usuario (usuario_id, nombre, apellido, correo, contrasena, rol) VALUES(?, ?, ?, ?, ?, ?)',
                [code, name, lastName, email, encryptedPassword, roleId]
            );

            return { message: 'Usuario creado correctamente' }

        } catch (error) {
            throw new Error('Error');
        }
    }

    static async studentExists(studentEnrollment, email) {

        if (studentEnrollment) {
            const query = 'SELECT usuario_id FROM usuario WHERE usuario_id = ?';
            const [user] = await pool.query(query, [studentEnrollment]);
            if (user.length > 0) return { message: 'La matrícula ya está registrada' }
        }

        if (email) {
            const query = 'SELECT correo FROM usuario WHERE correo = ?';
            const [user] = await pool.query(query, [email]);
            if (user.length > 0) return { message: 'El correo ya está registado' }
        }

        return false;

    }

    static async encryptPassword({ password }) {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    }

    static async assignTutor({ data }) {

        const { tutorCode, studentEnrollment } = data;

        try {

            await pool.query(
                'INSERT INTO tutor_alumno (tutor_id, alumno_id) VALUES (?, ?)',
                [tutorCode, studentEnrollment]
            )

            return { message: 'Tutor asignado correctamente' }

        } catch (error) {
            throw new Error('Error');
        }

    }

    static async studentData({ studentData }) {

        const { userId, name, lastName, career, gender, tutorOrParent, birthdate, age, placeOfBirth, religion, activity } = studentData;

        try {
            await pool.query(

                'INSERT INTO alumno (usuario_id, carrera, genero, tutor_padre, fechaNac, edad, lugarNac, religion, actividad) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [userId, career, gender, tutorOrParent, birthdate, age, placeOfBirth, religion, activity]
            )

            await pool.query(
                'UPDATE usuario SET nombre = ?, apellido = ? WHERE usuario_id = ?',
                [name, lastName, userId]
            )

            return { message: 'Datos guardados correctamente' }

        } catch (error) {
            console.log(error);
            throw new Error('Error');
        }

    }

    static async contactData({ contactData }) {

        const { userId, currentAddress, homeAddress, cellPhoneNumber, homePhoneNumber, email, tutorsEmail } = contactData;

        try {

            await pool.query(
                'INSERT INTO contacto (usuario_id, domicilio_actual, domicilio_familiar, celular, tel_casa, correo, correo_tutor) VALUES(?, ?, ?, ?, ?, ?, ?)',
                [userId, currentAddress, homeAddress, cellPhoneNumber, homePhoneNumber, email, tutorsEmail]
            )

            return { message: 'Datos guardados correctamente' }

        } catch (error) {
            console.log(error);
            throw new Error('Error');
        }

    }

    static async medicalData({ medicalData }) {
        const { userId, socialSecurityNumber, bloodType, disease, disability, allergy, sustances } = medicalData;

        try {

            await pool.query(
                'INSERT INTO datos_medicos (usuario_id, num_seguro, tipo_sangre, enfermedad, discapacidad, alergia, sustancias_toxicas) VALUES(?, ?, ?, ?, ?, ?, ?)',
                [userId, socialSecurityNumber, bloodType, disease, disability, allergy, sustances]
            )

            return { message: 'Datos guardados correctamente' }

        } catch (error) {
            console.log(error);
            throw new Error('Error');
        }
    }

    static async academicData({ academicData }) {
        const { userId, highSchool, average, scoreCeneval } = academicData;

        try {
            await pool.query(

                'INSERT INTO datos_academicos (usuario_id, preparatoria, promedio, puntuacion_ceneval) VALUES (?, ?, ?, ?)',
                [userId, highSchool, average, scoreCeneval]

            )

            return { message: 'Datos guardados correctamente' }

        } catch (error) {
            console.log(error);
            throw new Error('Error');
        }
    }

    static async socioeconomicData({ socioeconomicData }) {

        const { userId, workplace, economicalSupport, livesWith } = socioeconomicData;

        try {

            await pool.query(
                'INSERT INTO datos_socioeconomicos (usuario_id, trabajo, apoyo_economico, convivencia) VALUES (?, ?, ?, ?)',
                [userId, workplace, economicalSupport, livesWith]
            )

            return { message: 'Datos guardados correctamente' }

        } catch (error) {
            console.log(error);
            throw new Error('Error');
        }
    }

    static async checkProgressForm({ student_id }) {

        const tables = ['alumno', 'contacto', 'datos_medicos', 'datos_academicos', 'datos_socioeconomicos', 'imagen']
        let lastSection = 'none';

        for (let index = 0; index < tables.length; index++) {

            const inserts = [tables[index], student_id];

            let query = 'SELECT * FROM ?? WHERE usuario_id = ?'
            try {
                const [table] = await pool.query(query, inserts)
                if (table.length > 0) {
                    lastSection = tables[index];
                }
            } catch (error) {
                console.log(error);
                throw new Error('Error');
            }
        }
        return { 'lastSectionCompleted': lastSection }
    }

    static async saveImage(file, student_id) {

        await this.reduceImage(file)
        try {

            await pool.query(
                'INSERT INTO imagen (usuario_id, imagen) VALUES (?, ?)',
                [student_id, file.originalname]
            )

            return { imagen: file.originalname }

        } catch (error) {
            console.log(error);
            throw new Error('Error');
        }
    }

    static async reduceImage(file, size = 400) {

        const destinationFolder = './images';
        await fs.promises.mkdir(destinationFolder, { recursive: true });

        const outputPath = `./images/${file.originalname}`;
        const resizedImage = sharp(file.buffer).resize(size)
        const resizedImgeBuffer = await resizedImage.toBuffer();

        await fs.promises.writeFile(outputPath, resizedImgeBuffer)

        return outputPath;
    }

    static async getImage(student_id) {
        try {

            const [userImage] = await pool.query('SELECT imagen FROM imagen WHERE usuario_id = ?',
                [student_id])
            return userImage[0];

        } catch (error) {
            console.log(error);
            throw new Error('Error');
        }
    }

    static async searchStudent({ query, tutor_id }) {

        if (query.trim() === "") {
            return [];
        }

        try {
            const [students] = await pool.query(
                `SELECT usuario.nombre, usuario.apellido, usuario.correo, alumno.usuario_id, imagen.imagen 
                 FROM tutor_alumno
                 JOIN alumno ON alumno.usuario_id = tutor_alumno.alumno_id
                 JOIN usuario ON usuario.usuario_id = alumno.usuario_id
                 LEFT JOIN imagen ON imagen.usuario_id = alumno.usuario_id
                 WHERE tutor_alumno.tutor_id = ? AND (usuario.usuario_id LIKE ? OR usuario.usuario_id LIKE ?)`,
                [tutor_id, `%${query}%`, `%${query}%`]
            );

            return students;

        } catch (error) {
            console.log(error);
            throw new Error('Error');
        }
    }

    static async getStudens({ tutorCode, limit, offset }) {

        try {
            limit = parseInt(limit);
            offset = parseInt(offset);
            const [students] = await pool.query(
                `SELECT usuario.nombre, usuario.apellido, usuario.correo, alumno_id, imagen.imagen FROM tutor_alumno 
                JOIN usuario ON usuario.usuario_id = tutor_alumno.alumno_id 
                JOIN imagen on imagen.usuario_id = tutor_alumno.alumno_id WHERE tutor_id  = ?
                LIMIT ? OFFSET ?`,
                [tutorCode, limit, offset]
            );

            if (students.length > 0) {



                return students
            }

            return students;

        } catch (error) {
            console.log(error)
            throw new Error('Error');
        }
    }

    static async getStudentById({ studentId }) {
        try {

            const [user] = await pool.query(
                `SELECT usuario.nombre, usuario.apellido FROM usuario WHERE usuario_id = ?`,
                [studentId]
            )

            const [student] = await pool.query(
                `SELECT * FROM tutor_alumno 
                JOIN alumno ON alumno.usuario_id = tutor_alumno.alumno_id 
                JOIN contacto ON contacto.usuario_id = tutor_alumno.alumno_id
                JOIN datos_medicos ON datos_medicos.usuario_id = tutor_alumno.alumno_id
                JOIN datos_academicos ON datos_academicos.usuario_id = tutor_alumno.alumno_id
                JOIN datos_socioeconomicos ON datos_socioeconomicos.usuario_id = tutor_alumno.alumno_id
                WHERE tutor_alumno.alumno_id = ?`,
                [studentId]
            )

            const [image] = await pool.query(
                `SELECT imagen.imagen FROM imagen WHERE usuario_id = ?`,
                [studentId]
            );

            const fecha = new Date(student.fechaNac);
            const fechaFormateada = fecha.toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' });
            student.fechaNac = fechaFormateada;


            const studentInfo = { ...user[0], ...student[0], ...image[0] }

            if (student.length > 0 && user.length > 0) {
                return studentInfo;
            }

            return { 'message': 'No se encontró al alumno' }
        } catch (error) {
            throw new Error('Error');
        }
    }

    static async getAllStudents() {
        try {
            const [students] = await pool.query(`
            SELECT usuario.usuario_id, usuario.nombre, usuario.apellido, usuario.correo, usuario.creacion
            FROM alumno 
            JOIN usuario ON usuario.usuario_id = alumno.usuario_id 
        `)

            if (students) return students;
            return []
        } catch (error) {
            throw new Error('Error');
        }
    }

}