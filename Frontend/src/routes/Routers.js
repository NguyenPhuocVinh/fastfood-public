import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Home from "../pages/Home";
import Pizzas from "../pages/Pizzas";
import PizzaDetails from "../pages/PizzaDetails";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ChangePassword from "../pages/ChangePassword";
import EditProfile from "../pages/EditProfile";
import ResetPassword from "../pages/ResetPassword";
// import CategoryCard from "../components/Category/CategoriesCard";
import ThankYouBooking from "../pages/ThankYouBooking";
import ReviewOrder from "../pages/ReviewOrder";
import CategoryPage from "../pages/CategoryPage";

const Routers = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="/home" element={<Home />} />
      <Route path="/pizzas" element={<Pizzas />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/pizzas/:id" element={<PizzaDetails />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/change-password" element={<ChangePassword />} />
      <Route path="/edit-profile" element={<EditProfile />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      {/* <Route path="/category" element={<CategoryCard />} /> */}
      <Route path="/thank-you" element={<ThankYouBooking />} />
      <Route path="/category/:id" element={<CategoryPage />} />
      <Route path="/history" element={<ReviewOrder />} />
    </Routes>
  );
};

export default Routers;
