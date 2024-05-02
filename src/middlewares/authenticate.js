import { verifyToken } from '../auth/verifyToken.js';
import { getTokenFromHeader } from '../auth/getTokenFromHeader.js';

export class authenticate {

    static authenticate = (requireAuth = true) => (req, res, next) => {
        if (!requireAuth) {
            next();
            return;
        }

        const token = getTokenFromHeader.getToken(req.headers);

        if (token) {
            const decoded = verifyToken.verifyToken(token);
            if (decoded) {
                req.user = { ...decoded };
                next();
            } else {
                res.status(401).json({
                    message: 'No autorizado'
                });
            }
        } else {
            res.status(401).json({
                message: 'No autorizado'
            })
        }
    }

}