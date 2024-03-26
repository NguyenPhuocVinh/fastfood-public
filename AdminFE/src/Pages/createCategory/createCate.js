import React, { useState } from "react";
import { Space, Input, Button, notification, Upload } from "antd";
import { createCategory } from "../../API/index";
import "./createCate.css";
import { UploadOutlined } from "@ant-design/icons";

function CreateCategory() {
    const [CateData, setCateData] = useState({
        categoryName: "",
        image: null // Thêm trường image vào state để lưu trữ file ảnh được chọn
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (key, value) => {
        setCateData({
            ...CateData,
            [key]: value
        });
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("categoryName", CateData.categoryName);
            formData.append("image", CateData.image); // Thêm file ảnh vào formData

            await createCategory(formData);
            notification.success({
                message: "Create Category",
                description: "Category created successfully!",
            });
            window.location.href = "/categories";
        } catch (error) {
            notification.error({
                message: "Create Category",
                description: error.response.data.message || "Failed to create tour",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = (info) => {
        if (info.fileList.length > 0) {
            const file = info.fileList[0].originFileObj;
            handleChange("image", file); // Lưu file ảnh vào state khi người dùng chọn
        }
        return false; // Ngăn chặn tải lên mặc định của Ant Design Upload
    };

    return (
        <Space size={20} direction="vertical">
            <h1>Create Category</h1>
            <div className="form-container">
                <div className="form-row">
                    <div className="form-col">
                        <label>Category Name:</label>
                        <label>Image:</label>
                    </div>
                    <div className="form-col">
                        <Input
                            placeholder="Category Name"
                            value={CateData.categoryName}
                            onChange={(e) => handleChange("categoryName", e.target.value)}
                        />

                        <Upload
                            maxCount={1}
                            accept="image/*"
                            beforeUpload={() => false}
                            onChange={handleUpload}
                        >
                            <Button icon={<UploadOutlined />}>Click to Upload</Button>
                        </Upload>
                    </div>
                </div>
                <Button type="primary" onClick={handleSubmit} loading={loading}>Submit</Button>
            </div>
        </Space>
    );
}

export default CreateCategory;
