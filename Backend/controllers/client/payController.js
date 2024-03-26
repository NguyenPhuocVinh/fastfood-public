import Pay from "../../db/models/Pay.js";
import User from "../../db/models/User.js";
import Order from "../../db/models/Order.js";
import { StatusCodes } from "http-status-codes";
import orderDetail from "../../db/models/orderDetail.js";
import { BadRequestError, UnAuthenticatedError } from "../../errors/index.js";
import createBillPDF  from "../../utils/createBillPDF.js";
import { sendEmailTicket } from "../../utils/sendEmail.js";

import $ from "jquery";
import request from "request";
import moment from "moment";
import dotenv from "dotenv";
import querystring from "qs";
import crypto from "crypto";

dotenv.config({ path: "../../.env" });

const createPaymentUrl = async (req, res) => {
  const orderIdForPay = req.params.orderId;

  let date = new Date();
  let createDate = moment(date).format("YYYYMMDDHHmmss");

  let ipAddr =
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;

  let tmnCode = process.env.vnp_TmnCode;
  let secretKey = process.env.vnp_HashSecret;
  let vnpUrl = process.env.vnp_Url;
  let returnUrl = process.env.vnp_ReturnUrl;
  let orderId = moment(date).format("HHmmss");
  const amountObject = await Order.findOne({ _id: orderIdForPay }).select(
    "totalAmount"
  );
  console.log("amountObject", amountObject);
  let amount = amountObject.totalAmount;
  let bankCode = "";

  let locale = "vn";
  let currCode = "VND";
  let vnp_Params = {};
  vnp_Params["vnp_Version"] = "2.1.0";
  vnp_Params["vnp_Command"] = "pay";
  vnp_Params["vnp_TmnCode"] = tmnCode;
  vnp_Params["vnp_Locale"] = locale;
  vnp_Params["vnp_CurrCode"] = currCode;
  vnp_Params["vnp_TxnRef"] = orderId;
  vnp_Params["vnp_OrderInfo"] =
    "Thanh toan cho ma GD:" + orderId + "Mã order:" + orderIdForPay;
  vnp_Params["vnp_OrderType"] = "other";
  vnp_Params["vnp_Amount"] = amount * 100;
  vnp_Params["vnp_ReturnUrl"] = returnUrl;
  vnp_Params["vnp_IpAddr"] = ipAddr;
  vnp_Params["vnp_CreateDate"] = createDate;
  if (bankCode !== null && bankCode !== "") {
    vnp_Params["vnp_BankCode"] = bankCode;
  }

  vnp_Params = sortObject(vnp_Params);

  let signData = querystring.stringify(vnp_Params, { encode: false });
  let hmac = crypto.createHmac("sha512", secretKey);
  let signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
  vnp_Params["vnp_SecureHash"] = signed;
  vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: false });

  const pay = new Pay({
    orderIdVNP: orderId,
    orderId: orderIdForPay,
    amountTranstion: amount,
    createDate: createDate,
  });
  await pay.save();

  res.status(StatusCodes.OK).json({ vnpUrl });
  // res.redirect(vnpUrl);
  console.log(vnpUrl);
  console.log(vnp_Params);
};

const vnpayReturn = async (req, res) => {
  try {
    let vnp_Params = req.query;
    let secureHash = vnp_Params["vnp_SecureHash"];

    delete vnp_Params["vnp_SecureHash"];
    delete vnp_Params["vnp_SecureHashType"];

    vnp_Params = sortObject(vnp_Params);

    let tmnCode = process.env.vnp_TmnCode;
    let secretKey = process.env.vnp_HashSecret;

    let signData = querystring.stringify(vnp_Params, { encode: false });
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

    if (secureHash === signed) {
      const orderIdVNP = vnp_Params["vnp_TxnRef"];
      const update = await updatePaymentStatus(orderIdVNP);
      const orderData = await getOrderCreateBill(orderIdVNP);
      const pdfPath = await createBillPDF(orderData);
      const to = orderData.email;
      const subject = "Xác nhận thanh toán";
      const text = "Xác nhận thanh toán thành công!";
      const html = "<p>Xác nhận thanh toán thành công!</p>";

      await sendEmailTicket(to, subject, text, html, pdfPath);

      return res.status(StatusCodes.OK).json({ code: "00" });
    } else {
      return res.status(StatusCodes.BAD_REQUEST).json({ code: "97" });
    }
  } catch (error) {
    console.error("Error processing VNPAY return:", error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ code: "500", message: "Internal server error" });
  }
};

function sortObject(obj) {
  let sorted = {};
  let str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
}

const updatePaymentStatus = async (orderIdVNP) => {
  try {
    const payRecord = await Pay.findOne({ orderIdVNP });

    if (!payRecord) {
      throw new Error("Payment record not found");
    }

    const order = await Order.findById(payRecord.orderId);

    if (!order) {
      throw new Error("Order not found");
    }

    order.paymentStatus = "Đã thanh toán";

    await order.save();

    return payRecord;
  } catch (error) {
    console.error("Error updating payment status:", error);
    throw new Error("Error updating payment status");
  }
};

const getOrderCreateBill = async (orderIdVNP) => {
  try {
    const payRecord = await Pay.findOne({ orderIdVNP });

    if (!payRecord) {
      throw new Error("Payment record not found");
    }

    const order = await Order.findById(payRecord.orderId);

    if (!order) {
      throw new Error("Order not found");
    }

    const orderDetails = await orderDetail.findOne({ orderId: order._id }).populate({
      path: 'products',
      populate: { path: 'productId', select: 'productName' }
    });

    if (!orderDetails) {
      throw new Error("Order detail not found");
    }

    const orderData = {
      orderId: order._id,
      userId: order.userId,
      fullName: order.fullName,
      email: order.email,
      phone: order.phone,
      address: order.address,
      products: orderDetails.products.map((productDetail) => ({
        productId: productDetail.productId._id,
        name: productDetail.productId.productName,
        price: productDetail.price,
        quantity: productDetail.quantity,
      })),
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      totalAmount: order.totalAmount,
    };



    return orderData;
  } catch (error) {
    throw new Error(error.message);
  }
};

export { createPaymentUrl, vnpayReturn };
