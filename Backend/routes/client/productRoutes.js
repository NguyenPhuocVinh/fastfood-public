import express from "express";
const router = express.Router();

import {
  getSingleProduct,
  getAllProduct,
  searchProduct,
  getFeaturedProduct,
  getProductCount} from "../../controllers/client/productController.js";

router.route("/search").get(searchProduct);
router.route("/featured").get(getFeaturedProduct);

router.route("/:_id").get(getSingleProduct);
router.route("/").get(getAllProduct);
router.route("/get-product-count").get(getProductCount);
export default router;
