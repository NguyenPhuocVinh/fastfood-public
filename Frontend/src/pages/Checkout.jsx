import React, { useState, useEffect } from "react";
import { Form, FormGroup } from "reactstrap";
import { Button } from "reactstrap";
import { Col, Row } from "reactstrap";
import axios from "axios";
import "../styles/checkout.css";
import { BASE_URL } from "../utils/config";
import VNPAYImg from "../assets/images/vnpayrow.png"
import CheckoutProduct from "../components/CheckoutProduct/CheckoutProduct";

const Checkout = () => {
  const [isUserDataFilled, setIsUserDataFilled] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const getSessionStorageItem = (key) => {
    const item = sessionStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  };

  // console.log(getLocalStorageItem("cartItems"));

  const savedAddressesFromSessionStorage = sessionStorage.getItem("savedAddresses");
  let addressString = "";
  if (savedAddressesFromSessionStorage) {
    const parsedAddresses = JSON.parse(savedAddressesFromSessionStorage);
    if (Array.isArray(parsedAddresses) && parsedAddresses.length > 0) {
      addressString = parsedAddresses[0];
    }
  }

  const [order, setOrder] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: addressString,
    token: localStorage.getItem("token") || null,
    paymentMethod: "",
    cart: getSessionStorageItem("cartItems") || [],
  });

  useEffect(() => {
    const user = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (token === null || user === null) {
      const getUserInfo = async () => {
        try {
          const res = await axios.get(
            `${BASE_URL}/user/login`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const userData = res.data.user;
          setOrder((prevOrder) => ({
            ...prevOrder,
            fullName: userData.fullName || "",
            email: userData.email || "",
            phone: userData.phone || "",
          }));
          setIsUserDataFilled(false);
        } catch (error) {
          console.error("Error fetching user info:", error);
        }
      };
      getUserInfo();
    } else {
      setOrder((prevOrder) => ({
        ...prevOrder,
        token: token,
      }));
    }
  }, []);

  const handleClick = async (e) => {
    e.preventDefault();

    if (!paymentMethod) {
      return alert("Vui lòng chọn phương thức thanh toán");
    }

    const formattedBooking = {
      ...order,
      cart: order.cart.map((item) => ({
        productId: item._id,
        quantity: item.quantity,
      })),
      paymentMethod: paymentMethod,
    };

    try {
      const res = await axios.post(
        `${BASE_URL}/order/createorder`,
        formattedBooking,
        {
          headers: { Authorization: order.token ? `Bearer ${order.token}` : '' }
        }
      );
      const result = res.data.newOrder._id;
      const orderId = result;
      // console.log("orderId", orderId);

      if (paymentMethod === "COD") {
        alert("Đặt hàng thành công");
        window.location.href = "/thank-you";
        sessionStorage.removeItem("cartItems");
        sessionStorage.removeItem("totalQuantity");
        sessionStorage.removeItem("totalAmount");
      } else if (paymentMethod === "Online") {
        try {
          const res = await axios.post(
            `${BASE_URL}/pay/create_payment_url/${orderId}`,
          );
          const result = res.data.vnpUrl;
          if (res.status === 200) {
            window.open(result, '_self');
            sessionStorage.removeItem("cartItems");
            sessionStorage.removeItem("totalQuantity");
            sessionStorage.removeItem("totalAmount");
          }
        } catch (error) {
          console.error("Error processing VNPAY payment:", error);
          alert("Thanh toán thất bại. Vui lòng thử lại sau");
        }
      }

    } catch (error) {
      console.error("Error in handleClick:", error);
      alert("Đặt hàng thất bại. Vui lòng thử lại sau");
    }
  };

  const handleChange = (e) => {
    if (isUserDataFilled) {
      return;
    }
    setOrder((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handlePaymentMethod = (method) => {
    if (method === "cash") {
      setPaymentMethod("COD");
      setOrder((prevOrder) => ({ ...prevOrder, payment: "COD" }));
    } else if (method === "vnpay") {
      setPaymentMethod("Online");
      setOrder((prevOrder) => ({ ...prevOrder, payment: "Online" }));
    }
  };

  return (
    <>
      <Row className="w-100">
        <Col lg="7">
          <div className="booking">
            <div className="booking__form">
              <h3>Thông tin Thanh toán</h3>
              <Form className="booking__info-form">
                <h6>Thông tin liên hệ (nhận vé/phiếu thanh toán)</h6>
                <FormGroup>
                  <input
                    type="text"
                    placeholder="Họ và tên*"
                    id="fullName"
                    required
                    onChange={handleChange}
                    value={order.fullName || ""}
                  />
                </FormGroup>
                <p>như trên CMND (không dấu)</p>
                <FormGroup>
                  <input
                    type="email"
                    placeholder="Email*"
                    id="email"
                    required
                    onChange={handleChange}
                    value={order.email || ""}
                  />
                </FormGroup>
                <p>VD: email@example.com</p>
                <FormGroup>
                  <input
                    type="number"
                    placeholder="Số điện thoại*"
                    id="phone"
                    required
                    onChange={handleChange}
                    value={order.phone || ""}
                  />
                </FormGroup>
                <p>
                  VD: +84 901234567 trong đó (+84) là mã quốc gia và 901234567
                  là số di động
                </p>
                <FormGroup>
                  <input
                    type="text"
                    placeholder="Địa chỉ*"
                    id="address"
                    required
                    onChange={handleChange}
                    value={order.address || ""}
                  />
                </FormGroup>
                <p>VD: 123 Nguyễn Chí Thanh, Hà Nội</p>
              </Form>
            </div>
            <br />
            <div className="payment-method">
              <h6>Phương thức thanh toán:</h6>
              <Button
                className={`btn-payment ${paymentMethod === "COD" ? "active" : ""}`}
                onClick={() => handlePaymentMethod("cash")}
              >
                Thanh toán bằng tiền mặt
              </Button>

              <Button
                className={`btn-payment ${paymentMethod === "Online" ? "active" : ""}`}
                onClick={() => handlePaymentMethod("vnpay")}
              >
                Thanh toán bằng ví VNPAY
                <img src={VNPAYImg} alt="VNPay" />
              </Button>
            </div>
            <div className="button__booking-payment" onClick={handleClick}>
              <Button className="button__continue">Đặt Hàng</Button>
            </div>
          </div>
        </Col>
        <Col lg="5">
          <CheckoutProduct />
        </Col>
      </Row>
    </>
  );
};

export default Checkout;
