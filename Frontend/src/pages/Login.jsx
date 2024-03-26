import React, { useState, useEffect } from "react";
import { Row, Col } from "reactstrap";
import { Form, FormGroup, Label, Button } from "reactstrap";
import posterImage from "../assets/images/poster.jpg";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { BASE_URL } from "../utils/config";

const Login = () => {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({
        email: "",
        password: ""
    });

    const [showForgotPasword, setForgotPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleChange = (e) => {
        setCredentials({
            ...credentials,
            [e.target.id]: e.target.value
        });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            const res = await axios.post(`${BASE_URL}/auth/login`, credentials, {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json"
                }
            });

            localStorage.setItem('token', res.data.token);

            setTimeout(() => {
                window.location.reload(navigate("/"));
            }, 500);
        }
        catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setErrorMessage(error.response.data.message);
            } else if (error.response && error.response.status === 401) {
                setErrorMessage("Wrong Email or password");
            } else {
                setErrorMessage("Một lỗi đã xảy ra.");
            }
            console.error("Login error:", error.response);
        }
    };

    const handleClickForgotPassword = () => {
        setForgotPassword(!showForgotPasword);
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
    }, []);

    const HandleForgot = async e => {
        e.preventDefault();
        if (credentials.email.trim() === "") {
            alert("Vui lòng nhập email!");
            setTimeout(() => {
            }, 2000);
            return;
        }
        try {
            const res = await axios.post(`${BASE_URL}/auth/forgotpassword`, credentials);
            console.log(res);
            alert("Email đã được gửi đi.");
            // setShowMessage(true);
            setCredentials(prev => ({ ...prev, email: "" }));
            setTimeout(() => {
                // setShowMessage(false);
            }, 2000);
            return;
        }
        catch (err) {
            console.log(err);
            alert("User không tồn tại. Vui lòng nhập đúng email của bạn đã đăng ký");
            // setShowMessage(true);
            setTimeout(() => {
                // setShowMessage(false);
            }, 2000);
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
                                <h2>ĐĂNG NHẬP</h2>
                                {errorMessage && <p className="error-message">{errorMessage}</p>}
                                <Form>
                                    <FormGroup className="login__input">
                                        <input
                                            type="text"
                                            id="email"
                                            name="email"
                                            value={credentials.email}
                                            onChange={handleChange}
                                            required
                                        />
                                        <Label className="input__place" for="username">Địa chỉ email của bạn *</Label>
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
                                    <p className="forgot-password" onClick={handleClickForgotPassword}>Bạn quên mật khẩu?</p>
                                    <Button className="button__login" onClick={handleSubmit}>Đăng nhập</Button>
                                    <p className="btn-register">Bạn chưa có tài khoản? <Link to='/register' onClick={scollToTop}>Đăng ký</Link></p>
                                </Form>
                            </div>
                        )}
                    </div>
                    {showForgotPasword && (
                        <div className="overlay" style={{ bottom: showForgotPasword ? 0 : "-100%" }}>
                            <div className="forgot-password__form">
                                <div className="close-btn" onClick={handleClickForgotPassword}>
                                    <span aria-hidden="true">&times;</span>
                                </div>
                                <h2>Bạn quên mật khẩu?</h2>
                                <h4>Đừng lo lắng, bạn có thể đặt lại dễ dàng.</h4>
                                <p>Chúng tôi sẽ gửi cho bạn một email có liên kết để đặt lại mật khẩu của bạn.</p>
                                <Form>
                                    <FormGroup className="login__input">
                                        <input
                                            type="text"
                                            id="email"
                                            name="email"
                                            value={credentials.email}
                                            onChange={handleChange}
                                            required
                                        />
                                        <Label className="input__place" for="username">Địa chỉ email của bạn *</Label>
                                    </FormGroup>
                                    <Button className="button__forgot" onClick={HandleForgot}>Gửi Email Đặt lại Mật khẩu</Button>
                                </Form>
                            </div>
                        </div>
                    )}
                </Col>
            </Row>
        </div>
    );
};

export default Login;
