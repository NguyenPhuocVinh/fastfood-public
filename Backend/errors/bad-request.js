import { StatusCodes } from "http-status-codes";
import CustomAPIErorr from "./custom-api.js";

class BadRequestError extends CustomAPIErorr {
    constructor(message) {
        super(message);
        this.statusCode = StatusCodes.BAD_REQUEST;
    }
}

export default BadRequestError;