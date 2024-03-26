import express from "express";
const router = express.Router();

import isAdmin from "../../middleware/admin/isAdmin.js";
import authenticateUser from "../../middleware/client/auth.js";
import { createProduct, updateProduct, deleteProduct, getAllProducts } from "../../controllers/admin/productAdminController.js";

router.route("/createproduct").post(authenticateUser, isAdmin, createProduct);
router.route("/updateproduct/:_id").patch(authenticateUser, isAdmin, updateProduct);
router.route("/deleteproduct/:_id").delete(authenticateUser, isAdmin, deleteProduct);
router.route("/getallproducts").get(authenticateUser, isAdmin, getAllProducts);
export default router;