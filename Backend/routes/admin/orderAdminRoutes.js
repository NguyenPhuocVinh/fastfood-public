import getOrders from "../../controllers/admin/orderAdminController.js";
import isAdmin from "../../middleware/admin/isAdmin.js";
import authenticateUser from "../../middleware/client/auth.js";

import express from "express";

const router = express.Router();

router.route("/getorders").get(authenticateUser, isAdmin, getOrders);
export default router;