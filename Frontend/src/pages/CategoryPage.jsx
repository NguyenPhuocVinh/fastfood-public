import React, { useState, useEffect } from "react";
import { BASE_URL } from "../utils/config";
import axios from "axios";
import { Row, Col } from "reactstrap";
import ProductCard from "../components/UI/product-card/ProductCard";
import "../styles/product-card.css";

const CategoryPage = () => {
    const [products, setProducts] = useState([]);
    const categoryId = localStorage.getItem("categoryId");

    useEffect(() => {
        const fetchProductsByCategory = async () => {
            try {
                const response = await axios.get(
                    `${BASE_URL}/productcategory?categoryId=${categoryId}`
                );
                setProducts(response.data.products);
            } catch (error) {
                console.error("Error fetching products by category:", error);
            }
        };

        fetchProductsByCategory();
    }, [categoryId]);

    return (
        <div className="category-page">
            <h4>Món ăn bạn đang tìm kiếm:</h4>
            <Row className="row-cols-1 row-cols-md-2 row-cols-lg-4">
                {products.map((product) => (
                    <Col key={product._id} className="mb-5 mt-4">
                        <ProductCard item={product} />
                    </Col>
                ))}
                {products.length === 0 && <p>Không có sản phẩm nào</p>}
            </Row>
        </div>
    );
};

export default CategoryPage;
