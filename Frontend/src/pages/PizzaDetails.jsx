import React, { useState, useEffect } from "react";
// import { useLocation } from "react-router-dom";
import Helmet from "../components/Helmet/Helmet";
import { Container, Row, Col } from "reactstrap";
import { useDispatch } from "react-redux";
import { cartActions } from "../store/shopping-cart/cartSlice";
import { useSelector } from "react-redux";
import axios from "axios";
import "../styles/product-details.css";
import "../styles/product-card.css";
import ProductCard from "../components/UI/product-card/ProductCard";
import { BASE_URL } from "../utils/config";

const PizzaDetails = () => {
  const currentPath = window.location.pathname;

  const paths = currentPath.split("/");
  const _id = paths[paths.length - 1];

  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [isUpdateNotificationDisplayed, setIsUpdateNotificationDisplayed] =
    useState(false);
  const cartProducts = useSelector((state) => state.cart.cartItems);
  const { data: products } = axios.get(`${BASE_URL}/product/featured`);
  console.log("products", products);

  useEffect(() => {
    if (!_id) return;

    const fetchData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/product/${_id}`);
        setProduct(response.data.product);
        // console.log(response.data);
      } catch (error) {
        console.error("Error loading product details:", error);
      }
    };

    fetchData();
  }, [_id]);



  if (!product) return <p>Loading...</p>;

  const addItem = () => {
    setIsUpdateNotificationDisplayed(true);
    setTimeout(function () {
      setIsUpdateNotificationDisplayed(false);
    }, 1500);

    dispatch(
      cartActions.addItem({
        _id: product._id,
        productName: product.productName,
        price: product.price,
        imagePath: product.imagePath,
      })
    );
  };

  const VND = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  });

  const getRandomProduct = (AllProduct) => {
    if (!AllProduct || AllProduct.length === 0) {
      return [];
    }

    const getRandomIndex = () => Math.floor(Math.random() * AllProduct.length);

    const selectedTours = [];
    const selectedIndexes = new Set();

    while (selectedTours.length < 4) {
      const randomIndex = getRandomIndex();
      if (!selectedIndexes.has(randomIndex)) {
        selectedTours.push(AllProduct[randomIndex]);
        selectedIndexes.add(randomIndex);
      }
    }

    return selectedTours;
  };

  const { productName, price, productSubtitles } = product;
  const randomProduct = getRandomProduct(products);

  return (
    <Helmet title="Product-details">
      {isUpdateNotificationDisplayed && (
        <div className="updateCartNotifiation">
          <span>You successfully updated your cart!</span>
        </div>
      )}

      <section>
        <Container>
          <Row>
            <Col lg="4" className="d-flex mx-auto">
              <div className="product__images">
                <img src={product.imagePath} alt="" className="w-75" />
              </div>
            </Col>

            <Col lg="6" md="6">
              <div className="single__product-content">
                <h2 className="product__name mb-3">{productName}</h2>
                <h6 className="description">Combo món của bạn: </h6>
                <div className="description__content">
                  <p>{productSubtitles}</p>
                </div>
                <p className="product__price">
                  Giá tiền: <span>{VND.format(price)}</span>
                </p>
                <br />

                <button onClick={addItem} className="addTOCART__btn">
                  {cartProducts.find((item) => item._id === product._id)
                    ? "Update Cart"
                    : "Thêm vào giỏ hàng"}
                </button>
              </div>
            </Col>

            {randomProduct.map((product) => (
              <Col lg="3" md="4" sm="6" xs="6" className="mb-4" key={product._id}>
                <ProductCard item={product} />
              </Col>
            ))}
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

export default PizzaDetails;
