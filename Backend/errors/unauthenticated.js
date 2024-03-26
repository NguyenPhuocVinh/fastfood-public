import { StatusCodes } from "http-status-codes";
import CustomAPIErorr from "./custom-api.js";

class UnAuthenticatedError extends CustomAPIErorr {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}   

export default UnAuthenticatedError;