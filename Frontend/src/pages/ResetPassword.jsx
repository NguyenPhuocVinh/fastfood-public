import React, { useState } from "react";
import { Row } from "reactstrap";
import { Form, FormGroup, Label, Button } from "reactstrap";
import "../styles/login.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/config";

const ResetPassword = () => {
    const [credentials, setCredentials] = useState({
        password: "",
        confirmPassword: "",
    });

    const [showPassword, setShowPassword] = useState(false);

    const { token } = useParams();

    const handleChange = e => {
        setCredentials(prev => ({ ...prev, [e.target.id]: e.target.value }));
    }

    const handleSubmit = async e => {
        e.preventDefault();
        if (credentials.password !== credentials.confirmPassword) {
            alert("Mật khẩu xác nhận không khớp.");
            // setShowMessage(true);
            setTimeout(() => {
                // setShowMessage(false);
            }, 2000);
            return;
        }
        try {
            const res = await axios.patch(`${BASE_URL}/auth/reset-password/${token}`, credentials); // Gửi token trong URL
            console.log(res);
            alert("Mật khẩu đã được thay đổi.");
            // setShowMessage(true);
            setTimeout(() => {
                // setShowMessage(false);
            }, 2000);
            // Reset fields
            setCredentials(prev => ({
                ...prev,
                password: "",
                confirmPassword: "",
            }));

        } catch (err) {
            console.log(err);
            alert("Có lỗi xảy ra. Vui lòng thử lại.");
            // setShowMessage(true);
        }
    }

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="login-row">
            <Row>

                <div className="login-container">
                    <div className="mx-auto reset__password-form">
                        <h2>CẬP NHẬT MẬT KHẨU CỦA BẠN</h2>
                        <p>Đừng lo lắng, bạn có thể đặt lại dễ dàng.</p>
                        <Form>
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
                            <FormGroup className="login__input">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={credentials.confirmPassword}
                                    onChange={handleChange}
                                    required
                                />
                                <Label className="input__place" for="password"> Xác nhận Mật khẩu *</Label>
                                <span className="d-flex show-password" onClick={togglePasswordVisibility}>
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </FormGroup>
                            <Button className="button__register" onClick={handleSubmit}>Đổi mật khẩu</Button>
                        </Form>

                    </div>
                </div>
            </Row>
        </div>
    );
};

export default ResetPassword;
