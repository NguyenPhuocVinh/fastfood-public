import React, { useState, useEffect } from "react";
import { Button } from "reactstrap";
import "./header-booking.css";
import { RiTakeawayFill } from "react-icons/ri";
import { Form, FormGroup, Label } from "reactstrap";

const HeaderBooking = () => {
    const [credentials, setCredentials] = useState({
        address: "",
    });

    const [showSelection, setShowSelection] = useState(false);
    const [savedAddresses, setSavedAddresses] = useState([]);
    const [isAddressSaved, setIsAddressSaved] = useState(false);

    useEffect(() => {
        const savedAddressesFromSessionStorage = sessionStorage.getItem("savedAddresses");
        if (savedAddressesFromSessionStorage) {
            const parsedAddresses = JSON.parse(savedAddressesFromSessionStorage);
            setSavedAddresses(parsedAddresses);
            if (parsedAddresses.length > 0) {
                setIsAddressSaved(true);
            }
        }
    }, []);

    const handleShowSelection = () => {
        setShowSelection(!showSelection);
    };

    const handleChange = (e) => {
        setCredentials({
            ...credentials,
            [e.target.id]: e.target.value,
        });
    };

    const handleConfirmAddress = () => {
        if (credentials.address.trim() === "") {
            return;
        }

        const isAddressChanged = !savedAddresses.includes(credentials.address);

        if (isAddressChanged) {
            sessionStorage.removeItem("savedAddresses");
            const updatedAddresses = [credentials.address];
            setSavedAddresses(updatedAddresses);
            sessionStorage.setItem("savedAddresses", JSON.stringify(updatedAddresses));
            setIsAddressSaved(true);
        }

        setCredentials({
            address: "",
        });
        setShowSelection(false);

        window.location.reload();
    };

    const handleEditAddress = () => {
        setShowSelection(true);
    };

    return (
        <>
            <div className="align-items-center booking-header">
                {isAddressSaved ? (
                    <>
                        <i class="ri-map-pin-2-fill"></i>
                        <h4>Được giao từ: Tasty Treat Phạm Văn Chiêu</h4>
                        <i class="ri-time-fill"></i>
                        <h5>Giao Ngay</h5>
                        <Button className="button-booking__change" onClick={handleEditAddress}>Thay đổi</Button>
                    </>
                ) : (
                    <>
                        <h4>Đặt Ngay</h4>
                        <span><RiTakeawayFill /></span>
                        <h4>Giao Hàng</h4>
                        <i className="ri-gift-line"></i>
                        <h4>Hoặc mang đi</h4>
                        <Button className="button-booking__header" onClick={handleShowSelection}>Bắt đầu đặt hàng</Button>
                    </>
                )}
            </div>
            {showSelection && (
                <div className="overlay" style={{ bottom: showSelection ? 0 : "-100%" }}>
                    <div className="forgot-password__form">
                        <div className="close-btn" onClick={handleShowSelection}>
                            <span aria-hidden="true">&times;</span>
                        </div>
                        <h4>CHỌN ĐỊA CHỈ ĐÃ LƯU</h4>
                        <p>Cho chúng tôi biết vị trí hiện tại của bạn.</p>
                        <div className="address-selection">
                            {savedAddresses.map((savedAddress, index) => (
                                <div key={index} className="d-flex align-items-center justify-content-center address__item">
                                    <p><i className="ri-map-pin-line"></i> {savedAddress}</p>
                                </div>
                            ))}
                        </div>
                        <Button className="button__forgot" onClick={handleConfirmAddress}>
                            Xác nhận địa chỉ
                        </Button>
                        <Form>
                            <FormGroup className="login__input">
                                <input
                                    type="text"
                                    id="address"
                                    name="address"
                                    value={credentials.address}
                                    onChange={handleChange}
                                    required
                                />
                                <Label className="input__place" htmlFor="username">Nhập địa chỉ của bạn hoặc nơi gần bạn *</Label>
                            </FormGroup>
                        </Form>
                    </div>
                </div>
            )}
        </>
    );
};

export default HeaderBooking;
