import React from "react";
import { ListGroup, ListGroupItem, Row, Col } from "reactstrap";
import "./checkout-product.css";

const CheckoutProduct = () => {
    const VND = new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    });

    const cartItems = JSON.parse(sessionStorage.getItem("cartItems")) || [];

    const formattedTotalAmount = VND.format((Number(sessionStorage.getItem("totalAmount")) || 0) + 20000);

    return (
        <>
            <Col lg="8">
                <div className="booking__bottom">
                    <h3>Tóm tắt</h3>
                    <ListGroup className="booking__bottom-total">
                        <ListGroupItem className="total__booking border-0 px-0 total">
                            <Row>
                                <Col md="8" className="total__booking-price">
                                    <ul className="list-product">
                                        {cartItems.map((product, index) => (
                                            <p key={index}>{product.quantity} x {product.productName}</p>
                                        ))}
                                    </ul>
                                </Col>
                                <Col md="4">
                                    {cartItems.map((product, index) => (
                                        <p key={index}>{VND.format(product.totalPrice)}</p>
                                    ))}
                                </Col>
                            </Row>
                        </ListGroupItem>
                        <ListGroupItem className="total__quantity border-0 px-0">
                            <Row>
                                <Col md="6">Số lượng:</Col>
                                <Col md="6">{sessionStorage.getItem("totalQuantity")}</Col>
                            </Row>
                        </ListGroupItem>
                        <hr />
                        <ListGroupItem className="total__booking border-0 px-0 total">
                            <Row>
                                <Col md="5">Tổng đơn hàng:</Col>
                                <Col md="7" className="total__booking-price">
                                    <p>{VND.format(sessionStorage.getItem("totalAmount"))}</p>
                                </Col>
                            </Row>
                        </ListGroupItem>
                        <ListGroupItem className="total__booking border-0 px-0 total">
                            <Row>
                                <Col md="5">Phí vận chuyển:</Col>
                                <Col md="7" className="total__booking-price">
                                    <p>{VND.format(20000)}</p>
                                </Col>
                            </Row>
                        </ListGroupItem>
                        <ListGroupItem className="total__booking border-0 px-0 total">
                            <Row>
                                <Col md="5">Tổng cộng:</Col>
                                <Col md="7" className="total__booking-price">
                                    <p>{formattedTotalAmount}</p>
                                </Col>
                            </Row>
                        </ListGroupItem>
                    </ListGroup>
                </div>
            </Col>
        </>
    );
};

export default CheckoutProduct;
