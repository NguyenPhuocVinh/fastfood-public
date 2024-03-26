import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import { BadRequestError } from "../../errors/index.js";
import User from "../../db/models/User.js";
import Order from "../../db/models/Order.js";
import OrderDetail from "../../db/models/orderDetail.js";

import Product from "../../db/models/Product.js";

const createOrderTest = async (req, res) => {
  let { fullName, email, phone, address } = req.body;
  const cookies = req.headers.cookie.split("; ").reduce((prev, current) => {
    const [name, value] = current.split("=");
    prev[name] = value;
    return prev;
  }, {});

  const myCookie = cookies["cartItems"];
  const cart = [JSON.parse(myCookie)].flat();

  console.log("myCookie", cart);

  let user;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    const token = req.headers.authorization.split(" ")[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    user = await User.findById(payload.userId);

    if (user) {
      fullName = user.fullName;
      email = user.email;
      phone = user.phone;
    }
  }

  if (!user) {
    const randomString = Math.random().toString(36).substring(2, 15);
    const randomPassword = Math.random().toString(36).substring(2, 15);
    const domain = "example.com";
    const emailRandom = randomString + "@" + domain;
    user = await User.create({
      email: emailRandom,
      password: randomPassword,
      phone,
      role: "guest",
    });
  }

  const newOrder = await Order.create({
    userId: user._id,
    fullName,
    email,
    phone,
    address,
    status: "pending",
    totalAmount: 0,
  });

  if (!newOrder) {
    throw new BadRequestError("Failed to create order");
  }

  let totalAmount = 0;

  const orderDetails = []; // Mảng chứa thông tin chi tiết đơn hàng

  for (const item of cart) {
    const { productId, quantity } = item;

    const product = await Product.findById(productId);

    if (!product) {
      throw new BadRequestError(`Product with ID ${productId} not found`);
    }

    orderDetails.push({
      productId: product._id,
      price: product.price,
      quantity,
    });

    totalAmount += product.price * quantity;
  }

  const orderDetail = new orderDetail({
    orderId: newOrder._id,
    products: orderDetails,
  });

  await orderDetail.save(); 

  newOrder.totalAmount = totalAmount;
  await newOrder.save(); 

  return res.status(StatusCodes.CREATED).json({ newOrder });
};



const createOrder = async (req, res) => {
  let { fullName, email, phone, address, paymentMethod } = req.body;
  let user;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    const token = req.headers.authorization.split(" ")[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    user = await User.findById(payload.userId);

    if (user) {
      fullName = user.fullName;
      email = user.email;
      phone = user.phone;
    }
  }

  if (!user) {
    const randomString = Math.random().toString(36).substring(2, 15);
    const randomPassword = Math.random().toString(36).substring(2, 15);
    const domain = "example.com";
    const emailRandom = randomString + "@" + domain;
    user = await User.create({
      email: emailRandom,
      password: randomPassword,
      phone,
      role: "guest",
    });
  }

  const paymentStatus = paymentMethod === "COD" ? "Đã thanh toán" : "Chờ thanh toán";

  const newOrder = await Order.create({
    userId: user._id,
    fullName,
    email,
    phone,
    address,
    totalAmount: 0, 
    paymentMethod,
    paymentStatus,
    createAt: new Date(),
  });

  if (!newOrder) {
    throw new BadRequestError("Failed to create order");
  }

  let totalAmount = 0;
  let amount = 0;
  let ship = 20000;
  const orderDetails = [];

  for (const item of req.body.cart) {
    const { productId, quantity } = item;

    const product = await Product.findById(productId);

    if (!product) {
      throw new BadRequestError(`Product with ID ${productId} not found`);
    }

    orderDetails.push({
      productId: product._id,
      price: product.price,
      quantity,
    });

    amount += (product.price * quantity);
    totalAmount = amount + ship;
  }

  const orderDetail = new OrderDetail({
    orderId: newOrder._id,
    products: orderDetails,
  });

  await orderDetail.save();

  newOrder.totalAmount = totalAmount;
  await newOrder.save();
  return res.status(StatusCodes.CREATED).json({ newOrder });
};

export { createOrder };

export default createOrder;
