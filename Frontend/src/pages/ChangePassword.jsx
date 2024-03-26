import React, { useState } from "react";
import { Row, Col } from "reactstrap";
import { Form, FormGroup, Label, Button } from "reactstrap";
import "../styles/login.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Menu from "../components/Menu/Menu";
import axios from "axios";
import { BASE_URL } from "../utils/config";

const ChangePassword = () => {
    const [credentials, setCredentials] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setCredentials({
            ...credentials,
            [e.target.id]: e.target.value
        });

        if (e.target.id === "newPassword" && e.target.value === credentials.currentPassword) {
            alert("Mật khẩu mới phải khác mật khẩu hiện tại.");
        }
    };

    const handleSubmit = async e => {
        e.preventDefault();

        if (credentials.newPassword !== credentials.confirmPassword) {
            alert("Mật khẩu xác nhận không khớp.");
            return;
        }
        try {
            const token = localStorage.getItem("token");
            const res = await axios.patch(`${BASE_URL}/auth/change-password`, credentials, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log(res);
            alert("Mật khẩu đã được thay đổi.");

            setCredentials({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });

        } catch (err) {
            console.log(err);
            alert("Có lỗi xảy ra. Vui lòng thử lại.");
        }
    }

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="login-row">
            <Row className="w-100">
                <Col lg="4" className="mx-auto d-flex">
                    <Menu />
                </Col>
                <Col>
                    <div className="login-container">
                        <div className="login-form">
                            <h2>ĐẶT LẠI MẬT KHẨU</h2>
                            <Form>
                                <FormGroup className="login__input">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="currentPassword"
                                        name="password"
                                        value={credentials.currentPassword}
                                        onChange={handleChange}
                                        required
                                    />
                                    <Label className="input__place" for="password">Mật khẩu hiện tại*</Label>
                                    <span className="d-flex show-password" onClick={togglePasswordVisibility}>
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </span>
                                </FormGroup>
                                <FormGroup className="login__input">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="newPassword"
                                        name="password"
                                        value={credentials.newPassword}
                                        onChange={handleChange}
                                        required
                                    />
                                    <Label className="input__place" for="password">Mật khẩu mới *</Label>
                                    <span className="d-flex show-password" onClick={togglePasswordVisibility}>
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </span>
                                </FormGroup>
                                <FormGroup className="login__input">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="confirmPassword"
                                        name="password"
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
                </Col>
            </Row>
        </div>
    );
};

export default ChangePassword;
