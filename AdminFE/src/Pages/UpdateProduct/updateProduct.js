import React, { useState, useEffect } from "react";
import { Input, InputNumber, Button, notification, Select } from "antd";
import { updateProduct, getallcategories, getSingleProduct } from "../../API";
import "./updateProduct.css"

const { Option } = Select;

function UpdateProduct() {
  const currentPath = window.location.pathname;
  const paths = currentPath.split("/");
  const productId = paths[paths.length - 1];

  const [productData, setProductData] = useState({
    productName: "",
    price: 0,
    productSubtitles: "",
    feature: false,
    categoryId: "",
  });

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

   useEffect(() => {
    // Sử dụng useEffect để lấy danh sách danh mục khi component được render
    fetchCategories();
    fetchProductData(productId); // Lấy dữ liệu sản phẩm khi component được render
  }, [productId]);

  const fetchProductData = async (productId) => {
    // Gọi API để lấy thông tin của sản phẩm
    try {
      // Thực hiện lấy thông tin sản phẩm từ API, ví dụ:
      const productInfo = await getSingleProduct(productId);
      console.log(productInfo.product.productName);
      setProductData( {productName: productInfo.product.productName,price: productInfo.product.price,productSubtitles:productInfo.product.productSubtitles, feature:productInfo.product.feature,} ); // Cập nhật state với thông tin mới nhất của sản phẩm
      setSelectedCategory(productInfo.categoryId); // Cập nhật category đã chọn
    } catch (error) {
      console.error("Error fetching product information:", error);
    }
  };

  const handleChange = (key, value) => {
    setProductData({
      ...productData,
      [key]: value && value._isValid ? value : value && value.target ? value.target.value : value

    });
  };

  const fetchCategories = async () => {
    try {
      const categoriesData = await getallcategories(); // Gọi hàm API để lấy danh sách danh mục
      setCategories(categoriesData.categories); // Cập nhật state chứa danh sách danh mục
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    handleChange("categoryId", value);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    const updatedProduct = {
      productName: productData.productName,
      price: productData.price,
      productSubtitles: productData.productSubtitles,
      categoryId: selectedCategory,
      feature: productData.feature
    };

    await updateProduct(productId, updatedProduct);
    notification.success({
      message: "Update Product",
      description: "Product updated successfully!",
    });
    window.location.href = "/products";
  } catch (error) {
    notification.error({
      message: "Update Product",
      description: error.message || "Failed to update product",
    });
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="form-container-product">
      <h1 className="update-product">Update Product</h1>
      <form className="form-update-product" onSubmit={handleSubmit}>
        <div className="form-row-product">
          <div className="form-col-product">
            <label className="label">Product Name:</label>
            <label className="label">Price:</label>
            <label className="label">Subtitles:</label>
            <label className="label">Feature (Yes/No):</label>
            <label className="label">Category ID:</label>
          </div>
          <div className="form-col-input-product">
    <Input className="input-field-create-product" placeholder="Product Name" value={productData.productName} onChange={(e) => handleChange("productName", e.target.value)} />
    <InputNumber className="input-field-create-product" placeholder="Price" value={productData.price} onChange={(value) => handleChange("price", value)} />
    <Input className="input-field-create-product" placeholder="Product Subtitles" value={productData.productSubtitles} onChange={(e) => handleChange("productSubtitles", e.target.value)} />
    <div style={{ display: 'flex', flexDirection: 'column' }}>
        <input className="checkbox-wrapper" type="checkbox" checked={productData.feature} onChange={(e) => handleChange("feature", e.target.checked)} />
        <Select
            className="input-field-select"
            placeholder="Select Category"
            style={{ width: 200, marginTop: 8 }}
            onChange={handleCategoryChange}
            value={selectedCategory}
        >
            {categories.length > 0 && categories.map(category => (
                <Option key={category._id} value={category._id}>{category.categoryName}</Option>
            ))}
        </Select>
    </div>
</div>

        </div>
        <Button className="submit-btn-update-product" type="primary" htmlType="submit" loading={loading}>Submit</Button>
      </form>
    </div>
  );
}

export default UpdateProduct;
