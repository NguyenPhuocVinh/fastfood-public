import express from 'express';
const router = express.Router();

import {getAllUser, getLogin} from '../../controllers/admin/userAdminController.js';
import authenticateUser from "../../middleware/client/auth.js";
import isAdmin from "../../middleware/admin/isAdmin.js";


router.route('/getalluser').get(authenticateUser, isAdmin, getAllUser);
router.route('/getlogin').get(authenticateUser, isAdmin, getLogin);

export default router;