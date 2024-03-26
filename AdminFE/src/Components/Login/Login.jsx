import React, { useState, useEffect } from "react";
import { Row, Col } from "reactstrap";
import { Form, FormGroup, Label, Input, Button } from "reactstrap";
import posterImage from "./image/poster.jpg";
import "./login.css";
import { useNavigate } from "react-router-dom";
import {FaEye,FaEyeSlash} from  'react-icons/fa'
import axios from "axios";
// import Layout from "../Layout/Layout";

const Login = () => {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({
        email: "",
        password: ""
    });

    //const [showForgotPasword, setForgotPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setCredentials({
            ...credentials,
            [e.target.id]: e.target.value
        });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            const res = await axios.post("http://api.nguyenphuocvinh.me/admin/login", credentials, {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json"
                }
            });

            localStorage.setItem('token', res.data.token);

            setTimeout(() => {
                window.location.reload(navigate("/"));
            }, 1000);
        }
        catch (error) {
            console.log(error);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
    }, []);


    return (
        <div className="login-row">
            <Row>
                <Col lg={{ size: 5, offset: 1 }} className="login__img">
                    <img src={posterImage} alt="Poster" />
                </Col>
                <Col>
                    <div className="login-container">
                    {isLoggedIn ? (
                            <div className="login-form">
                                <h2>Bạn đã đăng nhập</h2>
                                <p>Bạn đã đăng nhập vào hệ thống.</p>
                                <Button className="button__login" onClick={() => navigate("/")}>Về Trang Chủ</Button>
                            </div>
                        ) : (
                        <div className="login-form">
                            <h2>ĐĂNG NHẬP</h2>
                            <Form>
                                <FormGroup className="login__input">
                                    <Input
                                        type="text"
                                        id="email"
                                        name="email"
                                        value={credentials.email}
                                        onChange={handleChange}
                                        required
                                    />
                                    <Label for="username">Địa chỉ email của bạn *</Label>
                                </FormGroup>
                                <FormGroup className="login__input">
                                    <Input
                                        type={showPassword?"text":'password'}
                                        id="password"
                                        name="password"
                                        value={credentials.password}
                                        onChange={handleChange}
                                        required
                                    />
                                    <Label for="password">Mật khẩu *</Label>
                                    <span className="d-flex show-password" onClick={togglePasswordVisibility}>
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </span>
                                </FormGroup>
                                <Button className="button__login"onClick={handleSubmit}>Đăng nhập</Button>
                            </Form>
                        </div>
                        )}
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default Login;