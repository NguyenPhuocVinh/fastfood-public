import {Route, Routes } from "react-router-dom";
import Users from "../../Pages/Users/users";
import Dashboard from "../../Pages/Dashboard";
import Category from "../../Pages/Categories/Categorys";
import CreateProduct from "../../Pages/CreateProduct/createProduct";
import UpdateProduct from "../../Pages/UpdateProduct/updateProduct";
import Login from "../Login/Login";
import Products from "../../Pages/Products/Products";
import Orders from "../../Pages/Orders/orders";
import CreateCategory from "../../Pages/createCategory/createCate";
import UpdateCategory from "../../Pages/UpdateCategory/updateCategory";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />}></Route>
      <Route path="/login" element={<Login />}></Route>
      <Route path="/products" element={<Products />}></Route>
      <Route path="/categories" element={<Category />}></Route>
      <Route path="/users" element={<Users />}></Route>
      <Route path="/orders" element={<Orders />}></Route>
      <Route path="/add-product" element={<CreateProduct/>}></Route>
      <Route path="/update-product/:id" element={<UpdateProduct />}></Route>
      <Route path="/add-category" element={<CreateCategory />}></Route>
      <Route path="/update-category/:id" element={<UpdateCategory />}></Route>
    </Routes>
  );
}
export default AppRoutes;
