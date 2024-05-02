import { pool } from '../db/database.js';
import bcrypt from 'bcryptjs';


export class AdminModel {

    static async register({ adminData }) {

        const { name, lastName, email, password, roleName, code } = adminData;

        const [id] = await pool.query(
            'SELECT rol_id FROM rol WHERE rol_nombre = ?',
            [roleName]
        );

        const roleId = id[0].rol_id;

        const encryptedPassword = await this.encryptPassword({ password });

        try {

            await pool.query(
                'INSERT INTO usuario (usuario_id, nombre, apellido, correo, contrasena, rol) VALUES (?, ?, ?, ?, ?, ?)',
                [code, name, lastName, email, encryptedPassword, roleId]
            )

            await pool.query(
                'INSERT INTO tutor (usuario_id) VALUES (?)',
                [code]
            )

            await pool.query(
                'DELETE FROM codigo_registro WHERE codigo = ?',
                [code]
            )

            return { message: 'Administrador registrado correctamente' };

        } catch (error) {
            throw new Error('Error');
        }
    }

    static async validateCodeAdmin({ code }) {
        try {
            const [codeAdmin] = await pool.query('SELECT codigo FROM codigo_registro WHERE codigo = ?', [code]);

            if (codeAdmin.length > 0) {
                return { message: 'Codigo valido' }
            }

            return false

        } catch (error) {
            console.log(error)
            throw new Error('Error');
        }
    }

    static async encryptPassword({ password }) {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    }

    static async verifyAdmin({ roleName }) {
        const [user] = await pool.query(
            `SELECT rol.rol_id FROM usuario 
            JOIN rol ON usuario.rol = rol.rol_id WHERE rol.rol_nombre = ?               
            `,
            [roleName]
        );

        if (user.length > 0) {
            return true;
        } else {
            return false;
        }
    }

}
