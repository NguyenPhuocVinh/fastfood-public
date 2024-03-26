import express from "express";
const router = express.Router();

import {registerUser, loginUser, updateUser, forgotPassword, resetPassword, changePassword} from "../../controllers/client/authController.js";
import authenticateUser from "../../middleware/client/auth.js";

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/updateUser").patch(authenticateUser, updateUser);
router.route('/forgotpassword').post(forgotPassword);
router.route('/reset-password/:token').patch(resetPassword);
router.route('/change-password').patch(authenticateUser, changePassword);

export default router;