import React, { useEffect, useState } from "react";
import FastImg2 from '../assets/images/fast.png';
import { useNavigate, useLocation } from "react-router-dom";
import axios from 'axios';
import { BASE_URL } from "../utils/config";
import "../styles/hero-section.css"

const ThankYouBooking = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [countdown, setCountdown] = useState(5); 

    useEffect(() => {
        const thankyou = async () => {
            try {
                const res = await axios.get(`${BASE_URL}/pay/vnpay_return${location.search}`);
                const data = res.data;
                console.log(data);
            } catch (error) {
                console.log(error.message);
            }
        };
        thankyou();
    }, [location.search]);

    useEffect(() => {
        const timer =
            countdown > 0 && setInterval(() => setCountdown(countdown - 1), 1000);
        if (countdown === 0) {
            navigate('/');
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
        return () => clearInterval(timer);
    }, [countdown, navigate]);

    return (
        <>
            <div className="success-form">
                <img src={FastImg2} alt="" />
                <h2>Đặt món thành công!</h2>
                <h6>Món ăn sẽ được chuẩn bị và giao đến bạn nhanh nhất có thể. Hãy chờ đợi nhé!</h6>
                <h6>Đang chuyển hướng về trang chủ trong {countdown} giây...</h6>
            </div>
        </>
    );
};

export default ThankYouBooking;
