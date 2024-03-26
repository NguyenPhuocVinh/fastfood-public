import React, { useState, useEffect } from "react";
import { Space, Input, InputNumber, Checkbox, Button, notification, Upload, Select } from "antd";
import { createProduct, getallcategories } from "../../API/index"; // import hàm getCategories từ API/index
import "./CreateTour.css";
import { UploadOutlined } from "@ant-design/icons";

const { Option } = Select;

function CreateProduct() {
  const [productData, setProductData] = useState({
    productName: "",
    price: 0,
    productSubtitles: "",
    feature: false,
    image: null,
    categoryId: ""
  });
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]); // State để lưu trữ danh sách danh mục
  const [selectedCategory, setSelectedCategory] = useState(""); // State để lưu trữ danh mục được chọn

  useEffect(() => {
    // Sử dụng useEffect để lấy danh sách danh mục khi component được render
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const categoriesData = await getallcategories(); // Gọi hàm API để lấy danh sách danh mục
      setCategories(categoriesData.categories); // Cập nhật state chứa danh sách danh mục
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleChange = (key, value) => {
    setProductData({
      ...productData,
      [key]: value
    });
  };

  const handleCategoryChange = (value) => {
    setSelectedCategory(value); // Cập nhật danh mục được chọn
    handleChange("categoryId", value); // Cập nhật categoryId của sản phẩm
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("productName", productData.productName);
      formData.append("price", productData.price);
      formData.append("productSubtitles", productData.productSubtitles);
      formData.append("feature", productData.feature);
      formData.append("image", productData.image);
      formData.append("categoryId", productData.categoryId);

      await createProduct(formData);
      notification.success({
        message: "Create Product",
        description: "Product created successfully!",
      });
      window.location.href = "/products";
    } catch (error) {
      notification.error({
        message: "Create Product",
        description: error.response.data.message || "Failed to create tour",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = (info) => {
    if (info.fileList.length > 0) {
      const file = info.fileList[0].originFileObj;
      handleChange("image", file);
    }
    return false;
  };

  return (
    <Space size={20} direction="vertical">
      <h1>Create Product</h1>
      <div className="form-container">
        <div className="form-row">
          <div className="form-col">
            <label>Product Name:</label>
            <label>Price:</label>
            <label>Product Subtitles:</label>
            <label>Feature (Yes/No):</label>
            <label>Image:</label>
            <label>Category:</label> {/* Thay đổi label thành 'Category:' */}
          </div>
          <div className="form-col">
            <Input placeholder="Product Name" value={productData.productName} onChange={(e) => handleChange("productName", e.target.value)} />
            <InputNumber placeholder="Price" value={productData.price} onChange={(value) => handleChange("price", value)} />
            <Input placeholder="Product Subtitles" value={productData.productSubtitles} onChange={(e) => handleChange("productSubtitles", e.target.value)} />
            <Checkbox checked={productData.feature} onChange={(e) => handleChange("feature", e.target.checked)}></Checkbox>
            <Upload
              maxCount={1}
              accept="image/*"
              beforeUpload={() => false}
              onChange={handleUpload}
            >
              {productData.image && <img src={URL.createObjectURL(productData.image)} alt="product" style={{ maxWidth: '200px' }} />}
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
            <Select
              placeholder="Select Category" // placeholder cho ComboBox
              style={{ width: 200 }}
              onChange={handleCategoryChange} // Sự kiện khi danh mục được chọn thay đổi
              value={selectedCategory} // Giá trị của danh mục được chọn
            >
              {categories.map(category => (
                <Option key={category._id} value={category._id}>{category.categoryName}</Option> // Option hiển thị tên danh mục và có giá trị là id của danh mục
              ))}
            </Select>
          </div>
        </div>
        <Button type="primary" onClick={handleSubmit} loading={loading}>Submit</Button>
      </div>
    </Space>
  );
}

export default CreateProduct;
