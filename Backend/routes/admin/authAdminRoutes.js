
import express from 'express';
const router = express.Router();

import isAdmin from '../../middleware/admin/isAdmin.js';
import authenticateUser from '../../middleware/client/auth.js';
import {deleteUser, logginAdmin} from '../../controllers/admin/authAdminController.js';


router.route('/deleteuser/:_id').delete(authenticateUser, isAdmin, deleteUser);
router.route('/login').post(logginAdmin, authenticateUser, isAdmin);

export default router;
