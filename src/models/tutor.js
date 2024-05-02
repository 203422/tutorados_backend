import { pool } from '../db/database.js';
import bcrypt from 'bcryptjs';

export class TutorModel {

    static async newCode({ tutorData }) {

        const { name, lastName } = tutorData;

        const tutorCode = this.createCode();

        try {
            await pool.query(
                'INSERT INTO codigo_registro (codigo, tutor_nombre, tutor_apellido) VALUES (?, ?, ?)',
                [tutorCode, name, lastName]
            )

            const [new_tutor] = await pool.query(
                'SELECT codigo, tutor_nombre, tutor_apellido FROM codigo_registro WHERE codigo = ?',
                [tutorCode]
            )

            return new_tutor[0];

        } catch (error) {
            console.log(error)
            throw new Error('Error');
        }
    }

    static async validateCodeTutor({ code }) {

        try {

            const [registerCode] = await pool.query(`SELECT codigo FROM codigo_registro WHERE codigo = ?`, [code]);

            if (registerCode.length > 0) {
                return true
            }

            return false

        } catch (error) {
            throw new Error('Error');
        }
    }

    static async register({ tutorData }) {
        const { name, lastName, email, password, code, roleName } = tutorData;

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

            await pool.query(
                'INSERT INTO tutor (usuario_id) VALUES (?)',
                [code]
            )

            await pool.query(
                'DELETE FROM codigo_registro WHERE codigo = ?',
                [code]
            )


            return { message: 'Usuario creado correctamente' }

        } catch (error) {
            throw new Error('Error');
        }
    }

    static createPassword(length = 8) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let password = '';
        for (let i = 0; i < length; i++) {
            password += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return password;
    }

    static async encryptPassword({ password }) {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    }

    static createCode(length = 10) {
        const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let code = 'tr';
        for (let i = 2; i < length; i++) {
            code += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return code;
    }

    static async tutorExists(code, email) {
        if (code) {
            const query = 'SELECT usuario_id FROM usuario WHERE usuario_id = ?';
            const [user] = await pool.query(query, [code]);
            if (user.length > 0) return { message: 'El código ya está registrado' }
        }

        if (email) {
            const query = 'SELECT correo FROM usuario WHERE correo = ?';
            const [user] = await pool.query(query, [email]);
            if (user.length > 0) return { message: 'El correo ya está registado' }
        }

        return false;
    }

    static async getTutorById({ tutor_id }) {
        try {
            const [tutor] = await pool.query(
                `SELECT usuario.usuario_id, usuario.nombre, usuario.apellido, usuario.correo, rol.rol_nombre AS rol
             FROM usuario
             INNER JOIN tutor ON usuario.usuario_id = tutor.usuario_id
             INNER JOIN rol ON usuario.rol = rol.rol_id
             WHERE tutor.usuario_id = ?`,
                [tutor_id]
            );
            return tutor[0];
        } catch (error) {
            console.log(error)
            throw new Error('Error');
        }
    }

    static async getAllTutors(limit, offset) {

        try {
            limit = parseInt(limit);
            offset = parseInt(offset);
            const [tutors] = await pool.query(
                `SELECT usuario.usuario_id, usuario.nombre, usuario.apellido, usuario.correo, usuario.creacion
                 FROM tutor 
                 JOIN usuario ON usuario.usuario_id = tutor.usuario_id
                 LIMIT ? OFFSET ?`,
                [limit, offset]
            )

            if (tutors) {
                return tutors
            }
        } catch (error) {
            console.log(error);
        }

    }

    static async getCodes() {
        try {
            const [codes] = await pool.query(
                `SELECT * FROM codigo_registro`
            )
            return codes
            
        } catch (error) {
            console.log(error)
            throw new Error('Error');
        }
    }
}