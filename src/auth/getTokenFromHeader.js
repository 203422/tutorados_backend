export class getTokenFromHeader {
    static getToken(headers) {
        if (headers && headers.authorization) {
            const parted = headers.authorization.split(' ');
            if (parted.length === 2) {
                return parted[1];
            } else {
                return
            }
        } else {
            return null;
        }
    }
}