import {getProductInCategory} from '../../controllers/client/productCateroryController.js';

import express from 'express';
const router = express.Router();

router.route("/").get(getProductInCategory);

export default router;