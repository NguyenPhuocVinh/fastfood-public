import express from 'express';
const router = express.Router();

import {getLogin, getHistoryOrder} from '../../controllers/client/userController.js';
import auth from '../../middleware/client/auth.js';

router.route('/login').get(auth, getLogin);
router.route('/history').get(auth, getHistoryOrder);

export default router;