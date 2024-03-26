import React from "react";
import "../../../styles/product-card.css";
import { useDispatch } from "react-redux";
import { cartActions } from "../../../store/shopping-cart/cartSlice";
import { Link } from "react-router-dom";

const ProductCard = ({ item }) => {
  const dispatch = useDispatch();

  const truncateString = (str, maxLength) => {
    if (str && str.length > maxLength) {
      return str.substring(0, maxLength) + "...";
    }
    return str;
  };

  const VND = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  });

  const addToCart = (product) => {
    const { _id, productName, price, imagePath } = product;
    dispatch(
      cartActions.addItem({
        _id,
        productName,
        imagePath,
        price,
      })
    );
  };

  return (
    <div className="product__container">
      {item ? (
        <div key={item._id} className="product__item d-flex flex-column justify-content-between">
          <div className="product__content">
            <img className="product__img w-50" src={item.imagePath} alt={item.productName} />
            <h5>
              <Link to={`/pizzas/${item._id}`}>{item.productName}</Link>
            </h5>
          </div>
          <div className="product__description">
            <p>{truncateString(item.productSubtitles, 42)}</p>
          </div>
          <div className="d-flex flex-column align-items-center justify-content-between">
            <span className="product__price mb-2">{VND.format(item.price)}</span>
            <button className="addTOCART__btn" onClick={() => addToCart(item)}>
              Thêm
            </button>
          </div>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default ProductCard;
