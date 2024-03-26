import {UnAuthenticatedError} from "../../errors/index.js";

const isAdmin = (req, res, next) => {
    if(req.user.role !== 'admin') {
        throw new UnAuthenticatedError('Not authorized as an admin');
    }
    next();
}

export default isAdmin;
