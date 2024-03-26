import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "reactstrap";
import ProductCard from "../components/UI/product-card/ProductCard";
import Helmet from "../components/Helmet/Helmet";
import axios from "axios";
import { BASE_URL } from "../utils/config";
import "../styles/cart-page.css";
import "../styles/pagination.css";

const Pizzas = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(16);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // console.log(categoryId);


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/product`);
        setProducts(response.data.products);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/category`);
        setCategories(response.data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProductsByCategory = async () => {
      if (currentCategory) {
        try {
          const response = await axios.get(
            `${BASE_URL}/productcategory?categoryId=${currentCategory._id}`
          );
          setProducts(response.data.products);
          setCurrentPage(1);
          setLoading(false);
        } catch (error) {
          setError(error.message);
          setLoading(false);
        }
      }
    };

    fetchProductsByCategory();
  }, [currentCategory]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleCategoryClick = (category) => {
    setCurrentCategory(category);
  };

  const indexOfLastProduct = currentPage * pageSize;
  const indexOfFirstProduct = indexOfLastProduct - pageSize;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  const totalProducts = products.length;
  const totalPages = Math.ceil(totalProducts / pageSize);

  const renderPagination = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <span
          key={i}
          onClick={() => handlePageChange(i)}
          className={currentPage === i ? "pagination__item active__page" : "pagination__item"}
        >
          {i}
        </span>
      );
    }
    return pages;
  };

  const renderCategories = () => {
    return categories.map((category) => (
      <span
        key={category._id}
        className="category-item"
        onClick={() => handleCategoryClick(category)}
      >
        {category.categoryName}
      </span>
    ));
  };

  const scollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      <Helmet title="All Pizzas">
        <Container>
          <div className="header-categories"> Danh mục: {renderCategories()}</div>

          {loading && (
            <div className="text-center pt-5">
              <div className="spinner-border" role="status">
                <span className="sr-only"></span>
              </div>
            </div>
          )}
          {error && <h4 className="text-center pt-5">{error}</h4>}

          {!loading && !error && (
            <Row>
              {currentProducts.length > 0 ? (
                currentProducts.map((product) => (
                  <Col lg="3" md="4" sm="6" xs="6" key={product._id} className="mb-4 mt-4">
                    <ProductCard item={product} />
                  </Col>
                ))
              ) : (
                <div className="text-center w-100">No products found</div>
              )}
            </Row>
          )}

          {!loading && !error && (
            <div className="pagination d-flex justify-content-center mt-4 mb-4" onClick={scollToTop}>
              {renderPagination()}
            </div>
          )}
        </Container>
      </Helmet>
    </>
  );
};

export default Pizzas;
