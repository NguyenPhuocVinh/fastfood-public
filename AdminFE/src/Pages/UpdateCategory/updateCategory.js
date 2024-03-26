import React, { useState, useEffect } from "react";
import { Input, Button, notification } from "antd";
import { updateCategory, getSingleCategory } from "../../API";
import "./updateCategory.css";

function UpdateCategory() {
  const currentPath = window.location.pathname;
  const paths = currentPath.split("/");
  const categoryid = paths[paths.length - 1];

  const [categoryData, setCategoryData] = useState({
    categoryName: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Sử dụng useEffect để lấy thông tin danh mục khi component được render
    fetchCategoryData(categoryid); // Lấy dữ liệu danh mục khi component được render
  }, [categoryid]);

  const fetchCategoryData = async (categoryId) => {
    // Gọi API để lấy thông tin của danh mục
    try {
      const categoryInfo = await getSingleCategory(categoryId);
      setCategoryData({ categoryName: categoryInfo.category.categoryName });
      console.log(categoryInfo.category.categoryName) // Lưu trường categoryName vào state
    } catch (error) {
      console.error("Error fetching category information:", error);
    }
  };

  const handleChange = (e) => {
    setCategoryData({
      ...categoryData,
      categoryName: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updatedCategory = {
        categoryName: categoryData.categoryName,
      };

      await updateCategory(categoryid, updatedCategory);
      notification.success({
        message: "Update Category",
        description: "Category updated successfully!",
      });
      window.location.href = "/categories";
    } catch (error) {
      notification.error({
        message: "Update Category",
        description: error.message || "Failed to update category",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h1>Update Category</h1>
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-col">
            <label className="label-update-category">Category Name:</label>
          </div>
          <div className="form-col1">
            <Input className="input-field" placeholder="Category Name" value={categoryData.categoryName} onChange={handleChange} />
          </div>
        </div>
        <Button className="submit-btn" type="primary" htmlType="submit" loading={loading}>Submit</Button>
      </form>
    </div>
  );
}

export default UpdateCategory;
