export class AdminAuthenticate {

    static isAdmin = (req, res, next) => {
        if (req.user && req.user.rol === 'Administrador') {
            return next();
        } else {
            res.status(401).json({
                message: 'No autorizado'
            });
        }

    }

}