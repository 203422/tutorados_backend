import { pool } from '../db/database.js';
import bcrypt from 'bcryptjs';
import { GenerateToken } from "../auth/generateToken.js";

export class UserModel {

    static async validateCode({ code }) {
        if (code.length == 10 && code.startsWith("tr")) {
            return "Tutor"
        }

        if (/^\d{6}$/.test(code)) {
            return "Alumno";
        }

        if(code.length == 10 && code.startsWith("ad")) {
            return "Administrador"
        } 

        return false
    }

    static async login({ identifier, password }) {

        try {
            const user = await this.userExists({ identifier });

            if (user) {
                const correctPassword = await this.comparePassword({ identifier, password });
                if (correctPassword) {
                    const userInfo = await this.getUserInfo({ identifier });
                    const accessToken = GenerateToken.createAccessToken(userInfo);
                    return ({ ...userInfo, token: accessToken });
                }
            }

        } catch (error) {
            throw new Error('Error');
        }
    }

    static async getUserInfo({ identifier }) {

        let isEmail = identifier.includes("@");
        const query = isEmail ?
            `SELECT usuario.usuario_id, usuario.nombre, usuario.apellido, usuario.correo, rol.rol_nombre AS rol 
         FROM usuario 
         JOIN rol ON usuario.rol = rol.rol_Id 
         WHERE usuario.correo = ?` :
            `SELECT usuario.usuario_id, usuario.nombre, usuario.apellido, usuario.correo, rol.rol_nombre AS rol 
         FROM usuario 
         JOIN rol ON usuario.rol = rol.rol_Id 
         WHERE usuario.usuario_id = ?`;

        try {
            const [userInfo] = await pool.query(query, [identifier]);
            return userInfo[0];
        } catch (error) {
            throw new Error('Error');
        }

    }

    static async comparePassword({ identifier, password }) {
        let isEmail = identifier.includes("@");
        const query = isEmail ? 'SELECT contrasena FROM usuario WHERE correo = ?' : 'SELECT contrasena FROM usuario WHERE usuario_id = ?';

        try {
            const [pass] = await pool.query(query, [identifier])
            const passwordFromDB = pass[0].contrasena;
            const same = await bcrypt.compare(password, passwordFromDB);
            return !!same;
        } catch (error) {
            throw new Error('Error');
        }
    }

    static async userExists({ identifier }) {
        let isEmail = identifier.includes("@");
        const query = isEmail ? 'SELECT correo FROM usuario WHERE correo = ?' : 'SELECT usuario_id FROM usuario WHERE usuario_id = ?'
        try {

            const [user] = await pool.query(query, [identifier]);
            return user.length > 0;
        } catch (error) {
            throw new Error('Error');
        }

    }

    static async getAllUsers() {

        try {
            const [users] = await pool.query(
                `SELECT usuario_id, nombre, apellido, correo, rol, creacion 
                 FROM usuario`
            );


            if (users) {
                return users;
            }

            return []

        } catch (error) {
            throw new Error('Error');
        }

    }
}