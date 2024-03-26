import React, { useState, useEffect } from "react";
import { Row, Col } from 'reactstrap';
import axios from 'axios';
import '../styles/review-order.css';
import { BASE_URL } from "../utils/config"
import Menu from "../components/Menu/Menu";

const ReviewOrder = () => {
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${BASE_URL}/user/history`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setTransactions(response.data.orders);
            } catch (error) {
                console.error('Error fetching transactions:', error);
            }
        };

        fetchTransactions();
    }, []);

    return (
        <div className="login-row">
            <Row className="w-100">
                <Col md="4" className="mx-auto d-flex">
                    <Menu />
                </Col>
                <Col md="8" className="purchase-list__item mx-auto">
                    <h2 className="purchase-list__title">Đang giao dịch ({transactions.length})</h2>
                    {transactions && transactions.length === 0 ? (
                        <div className="purchase-list__empty">
                            <br />
                            <p>Không có giao dịch nào</p>
                        </div>
                    ) : (
                        <>
                            {transactions && transactions.map(transaction => (
                                <Row key={transaction._id} className="mb-4 purchase-list-card">
                                    <Col md="12">
                                        <div className="purchase__list-name">
                                            <div className="purchase__booking-id">
                                                Mã đặt món Tasty Treat <span>{transaction.id}</span>
                                            </div>
                                            <div className="purchase__product">
                                                <div className="selected-transaction-details">
                                                    <ul>
                                                        {transaction.products.map(product => (
                                                            <li key={product._id}>
                                                                {product.name}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                            <div className="purchase__tourName"><i className="ri-map-pin-2-fill"></i>Địa chỉ giao hàng: {transaction.address}</div>
                                            <div className="purchase__payment-status" >
                                                <p style={{ backgroundColor: transaction.paymentStatus === 'Chờ thanh toán' ? 'red' : 'blue' }}>Trạng thái thanh toán: {transaction.paymentStatus}</p>
                                            </div>
                                            <div className="purchase-right-content">
                                                <div className="purchase__totalAmount">{transaction.totalAmount.toLocaleString()} VND</div>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            ))}
                        </>
                    )}
                </Col>
            </Row>
        </div>
    );
};

export default ReviewOrder;
