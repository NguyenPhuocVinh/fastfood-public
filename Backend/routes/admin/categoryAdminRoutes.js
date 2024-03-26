import express from "express";
const router = express.Router();

import isAdmin from "../../middleware/admin/isAdmin.js";
import authenticateUser from "../../middleware/client/auth.js";
import { createCategory, updateCategory, deleteCategory, getAllCategory, getSingleCategory } from "../../controllers/admin/categoryAdminController.js";

router.route("/createcategory").post(authenticateUser, isAdmin, createCategory);
router.route("/updatecategory/:_id").patch(authenticateUser, isAdmin, updateCategory);
router.route("/deletecategory/:_id").delete(authenticateUser, isAdmin, deleteCategory);
router.route("/getallcategories").get(authenticateUser, isAdmin, getAllCategory);
router.route("/getsinglecategory/:_id").get(authenticateUser, isAdmin, getSingleCategory);
export default router;