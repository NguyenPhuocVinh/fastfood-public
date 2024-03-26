import {
  createPaymentUrl,
  vnpayReturn,
} from "../../controllers/client/payController.js";
import express from "express";
const router = express.Router();

router.route("/create_payment_url/:orderId").post(createPaymentUrl);
router.route("/vnpay_return").get(vnpayReturn);

export default router;
