import jwt from 'jsonwebtoken';

export class verifyToken {
    static verifyToken(token) {
        return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    }
}