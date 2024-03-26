import { CloseOutlined, UserOutlined } from "@ant-design/icons";
import { Image, Space, Typography, Button } from "antd";
import { useState, useEffect } from "react";
import Login from "../Login/Login";
import { useNavigate } from "react-router-dom"; // Import useNavigate từ react-router-dom

function AppHeader() {
  const [showformLogin, setShowformLogin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate(); // Sử dụng useNavigate để điều hướng

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleShowLogin = () => {
    setShowformLogin(!showformLogin);
  };

  const handleCloseLogin = () => {
    setShowformLogin(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    console.log("Đăng xuất");

    navigate("/"); // Sử dụng navigate để điều hướng đến trang chính sau khi đăng xuất
  };

  return (
    <>
      <div className="AppHeader">
        <Image width={100} src="https://i.imgur.com/tDDVmQa.png" />
        <Typography.Title>Admin</Typography.Title>
        <Space>
          {isLoggedIn && <Button onClick={handleLogout}>Đăng xuất</Button>}
          <UserOutlined
            style={{ fontSize: 20, paddingRight: 10}}
            onClick={handleShowLogin}
          />
        </Space>
      </div>
      {showformLogin && (
        <div
          className="overlay"
          style={{ bottom: showformLogin ? 0 : "-100%" }}
        >
          <div className="show-login-form">
            <div className="close-btn" onClick={handleCloseLogin}>
              <CloseOutlined style={{ fontSize: 20, color: "#000000" }} />
            </div>
            <Login />
          </div>
        </div>
      )}
    </>
  );
}

export default AppHeader;
