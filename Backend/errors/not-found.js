import { StatusCodes } from "http-status-codes";
import CustomAPIErorr from "./custom-api.js";

class NotFoundError extends CustomAPIErorr {
    constructor(message) {
        super(message);
        this.statusCode = StatusCodes.NOT_FOUND;
    }
}

export default NotFoundError;