import jwt from 'jsonwebtoken';

export class GenerateToken {

    static createAccessToken(payload) {
        return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
            algorithm: "HS256",
        });
    }
} 