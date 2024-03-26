import React, { useState, useEffect } from "react";
import { Row, Col } from "reactstrap";
import { Form, FormGroup, Button, Label } from "reactstrap";
import "../styles/login.css";
import Menu from "../components/Menu/Menu";
// import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { BASE_URL } from "../utils/config";
import { useNavigate } from "react-router-dom";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

const EditProfile = () => {
    const navigate = useNavigate();
    const [isUserDataFilled, setIsUserDataFilled] = useState(false);
    const [isInfoChanged, setIsInfoChanged] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [credentials, setCredentials] = useState({
        fullName: "",
        email: "",
        phone: "",
    });

    const handleChange = e => {
        if (e) {
            e.preventDefault();
        }
        setCredentials(prev => ({ ...prev, [e.target.id]: e.target.value }));
        setIsInfoChanged(true);
    }

    const getUserData = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(`${BASE_URL}/user/login`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const userData = res.data.user;
            setCredentials(prevEditProfile => ({
                ...prevEditProfile,
                fullName: userData.fullName || '',
                email: userData.email || '',
                phone: userData.phone || ''
            }));
            setIsUserDataFilled(false);
        }
        catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        getUserData();
    }, []);

    const handleSubmit = async e => {
        if (e) {
            e.preventDefault();
        }
        if (!isInfoChanged) {
            toggleConfirmation();
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const res = await axios.patch(`${BASE_URL}/auth/updateUser`, credentials, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            console.log(res);
            alert("Thông tin đã được cập nhật thành công.");
            setTimeout(() => {
                window.location.href = "/";
            }, 2000);
        } catch (err) {
            console.log(err);
            alert("Có lỗi xảy ra. Vui lòng thử lại.");
        }
    }

    const handleConfirmationYes = () => {
        toggleConfirmation();
        setIsInfoChanged(true);
        alert("Thông tin đã được cập nhật thành công.");
        setTimeout(() => {
            window.location.reload(navigate("/"));
        }, 500);
    };

    const handleConfirmationNo = () => {
        toggleConfirmation();
    };

    const toggleConfirmation = () => {
        setShowConfirmation(!showConfirmation);
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
                            <h2>CHI TIẾT TÀI KHOẢN</h2>
                            <Form>
                                <FormGroup className="login__input">
                                    <input
                                        type="text"
                                        id="fullName"
                                        name="fullName"
                                        value={credentials.fullName}
                                        onChange={handleChange}
                                        required
                                        readOnly={isUserDataFilled}
                                    />
                                    <Label className="input__place" for="fullName">Họ và tên của bạn *</Label>
                                </FormGroup>
                                <FormGroup className="login__input">
                                    <input
                                        type="phone"
                                        id="phone"
                                        name="phone"
                                        onChange={handleChange}
                                        required
                                        value={credentials.phone}
                                        readOnly={isUserDataFilled}
                                    />
                                    <Label className="input__place" for="phone">Số điện thoại *</Label>
                                </FormGroup>
                                <FormGroup className="login__input">
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        onChange={handleChange}
                                        value={credentials.email}
                                        required
                                        disabled 
                                        className="disabled-input" 
                                    />
                                    <Label className="input__place-email" for="email">Địa chỉ email của bạn *</Label>
                                </FormGroup>
                                <Button className="button__register" onClick={handleSubmit}>Cập nhật tài khoản</Button>
                            </Form>
                        </div>
                    </div>
                </Col>
            </Row>
            <Modal isOpen={showConfirmation} toggle={toggleConfirmation}>
                <ModalHeader toggle={toggleConfirmation}>Xác nhận</ModalHeader>
                <ModalBody>
                    Hiện không có thông tin nào thay đổi, quý khách có đồng ý vẫn lưu thông tin này không?
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" onClick={handleConfirmationYes}>
                        Có
                    </Button>{' '}
                    <Button color="secondary" onClick={handleConfirmationNo}>
                        Không
                    </Button>
                </ModalFooter>
            </Modal>
        </div>
    );
};

export default EditProfile;
