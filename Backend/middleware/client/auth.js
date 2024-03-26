import { UnAuthenticatedError } from '../../errors/index.js';
import jwt from 'jsonwebtoken';


UnAuthenticatedError
const auth = async (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.anonymous;

    if(authHeader === 'anonymous') {
        req.user = {userId: null, role: 'guest'};
        next();
        return;
    }

    if(!authHeader || !authHeader.startsWith('Bearer')) {
        throw new UnAuthenticatedError('Authentication Invalid');
    }

    const token = authHeader.split(' ')[1];
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {userId: payload.userId, role: payload.role};
        next();
    } catch (error) {
        throw new UnAuthenticatedError('Authentication Invalid');
    }
}

export default auth;