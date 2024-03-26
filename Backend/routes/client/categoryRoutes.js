import express from "express";

const router = express.Router();
import getCategory from "../../controllers/client/categoryController.js";

router.route("/").get(getCategory);

export default router;