import express from 'express';
const router = express.Router();
import createOrder from '../../controllers/client/orderController.js';

router.route('/createorder').post(createOrder);

export default router;