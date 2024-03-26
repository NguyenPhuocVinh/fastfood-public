import React, { useState, useEffect } from "react";
import { Row, Col } from "reactstrap";
import { Form, FormGroup, Button, Label } from "reactstrap";
import posterImage from "../assets/images/poster.jpg";
import { Link, useNavigate } from "react-router-dom";
import "../styles/login.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { BASE_URL } from "../utils/config";

const Register = () => {
    const [credentials, setCredentials] = useState({
        fullName: "",
        email: "",
        phone: "",
        password: ""
    });

    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
    }, []);

    const handleChange = (e) => {
        setCredentials({
            ...credentials,
            [e.target.id]: e.target.value
        });
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                `${BASE_URL}/auth/register`,
                credentials
            );
            console.log("Registration successful:", response.data);
            window.alert("Đăng ký thành công");
            window.location.reload(navigate("/login"));
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setErrorMessage(error.response.data.message);
            } else if (error.response && error.response.status === 400) {
                setErrorMessage(`User with email  ${credentials.email} already exists`);
            } else {
                setErrorMessage("Một lỗi đã xảy ra.");
            }
            console.error("Registration error:", error.response.data);
        }
    };

    const scollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

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
                                <h2>TẠO TÀI KHOẢN</h2>
                                {errorMessage && <p className="error-message">{errorMessage}</p>}
                                <Form onSubmit={handleSubmit}>
                                    <FormGroup className="login__input">
                                        <input
                                            type="text"
                                            id="fullName"
                                            name="fullName"
                                            value={credentials.fullName}
                                            onChange={handleChange}
                                            required
                                        />
                                        <Label className="input__place" for="fullName">Họ và tên của bạn *</Label>
                                    </FormGroup>
                                    <FormGroup className="login__input">
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={credentials.email}
                                            onChange={handleChange}
                                            required
                                        />
                                        <Label className="input__place" for="email">Địa chỉ email của bạn *</Label>
                                    </FormGroup>
                                    <FormGroup className="login__input">
                                        <input
                                            type="phone"
                                            id="phone"
                                            name="phone"
                                            value={credentials.phone}
                                            onChange={handleChange}
                                            required
                                        />
                                        <Label className="input__place" for="phone">Số điện thoại *</Label>
                                    </FormGroup>
                                    <FormGroup className="login__input">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            id="password"
                                            name="password"
                                            value={credentials.password}
                                            onChange={handleChange}
                                            required
                                        />
                                        <Label className="input__place" for="password">Mật khẩu *</Label>
                                        <span className="d-flex show-password" onClick={togglePasswordVisibility}>
                                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                                        </span>
                                    </FormGroup>
                                    <Button className="button__register" type="submit">Tạo tài khoản</Button>
                                </Form>
                                <p className="btn-register">Bạn đã có tài khoản <Link to='/login' onClick={scollToTop}>Đăng nhập</Link></p>
                            </div>
                        )}
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default Register;
