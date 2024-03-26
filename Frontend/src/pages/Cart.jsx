import React from "react";

import Helmet from "../components/Helmet/Helmet";
import "../styles/cart-page.css";
import { useSelector, useDispatch } from "react-redux";
import { Container, Row, Col } from "reactstrap";
import { cartActions } from "../store/shopping-cart/cartSlice";
import { Link } from "react-router-dom";

const Cart = () => {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const totalAmount = useSelector((state) => state.cart.totalAmount);

  const VND = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  });

  const scollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      <Helmet title="Cart">
        <section>
          <Container>
            <Row>
              <Col lg="12" className="cart-page">
                {cartItems.length === 0 ? (
                  <h5 className="text-center">GIỎ HÀNG CỦA BẠN ĐANG RỖNG</h5>
                ) : (
                  <>
                    <h5 className="mb-4">GIỎ HÀNG CỦA TÔI</h5>
                    <table className="table table-borderless mb-5 align-middle">
                      <tbody>
                        {cartItems.map((item) => (
                          <Tr item={item} key={item._id} />
                        ))}
                      </tbody>
                    </table>
                    <div className="cart__total mt-4">
                      <h6>
                        Tổng đơn hàng:
                        <span className="cart__subtotal"> {VND.format(totalAmount)}</span>
                      </h6>
                      <p>Thuế và phí vận chuyển sẽ được tính khi thanh toán.</p>
                      <div className="cart__page-btn">
                        <button className="addTOCart__btn  me-4" onClick={scollToTop}>
                          <Link to="/pizzas">Tiếp tục Mua Hàng</Link>
                        </button>
                        {cartItems.length > 0 && (
                          <button className="addTOCart__btn" onClick={scollToTop}>
                            <Link to="/checkout">Chuyển đến Thanh Toán</Link>
                          </button>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </Col>
            </Row>
          </Container>
        </section>
      </Helmet>
    </>
  );
};

const Tr = (props) => {
  const { _id, imagePath, productName, price, quantity } = props.item;
  const dispatch = useDispatch();

  const VND = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  });

  const deleteItem = () => {
    dispatch(cartActions.deleteItem(_id));
  };
  return (
    <tr>
      <td className="text-center cart__img-box">
        <img src={imagePath} alt="" />
      </td>
      <td className="text-center">{productName}</td>
      <td className="text-center">{VND.format(price)}</td>
      <td className="text-center">{quantity}x</td>
      <td className="text-center cart__item-del">
        <i className="ri-delete-bin-line" onClick={deleteItem}></i>
      </td>
    </tr>
  );
};

export default Cart;
