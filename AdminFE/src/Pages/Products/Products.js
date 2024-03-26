import {  Space, Table, Typography, Button, Pagination, notification } from "antd";
import { useEffect, useState } from "react";
import { getAllProducts,deleteProduct } from "../../API";

function formatPrice(price) {
  return price.toLocaleString('vi-VN') + ' VNĐ';
}


function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 4

  useEffect(() => {
    setLoading(true);

    getAllProducts()
      .then((data) => {
        setProducts(data.products);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      console.log(products);
    }
  }, [products]);

  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
  };

  const handleAddButtonClick = () => {
    window.location.href = "/add-product";
  };

  const handleEditProduct = (_id) => {
    if (_id) {
      window.location.href = `/update-product/${_id}`; // Truyền _id qua URL
    } else {
      console.error("ID is undefined");
    }
  }

  const handleDeleteProduct = (_id) => {
    deleteProduct(_id)
      .then((data) => {
        notification.success({
          message: "Delete Product",
          description: data.message,
        });
        setProducts(products.filter((product) => product._id !== _id));
      })
      .catch((error) => {
        notification.error({
          message: "Delete Product",
          description: error.message,
        });
      });
  }

  return (
    <Space size={20} direction="vertical">
      <Typography.Title level={4}>Products</Typography.Title>
      <Button type="primary" onClick={handleAddButtonClick}>
        Add
      </Button>
      <Table
        loading={loading}
        dataSource={products.slice((currentPage - 1) * pageSize, currentPage * pageSize)}
        columns={[
          {
            title: "Product Image",
            dataIndex: "imagePath",
            // render: (link) => <img src={`http://localhost:4000/${link}`} style={{ maxWidth: '200px' }} />,
            render:(Link)=> <img src={Link} alt="" style={{width: '100px', height: '100px'}}/>
          },
          {
            title: "Product Name",
            dataIndex: "productName",
          },
          {
            title: "Category Name",
            dataIndex: "categoryName",
          },
          {
            title: "Price",
            dataIndex: "price",
            render: (value) => formatPrice(value),
          },
          {
            title: "Product Subtitles",
            dataIndex: "productSubtitles",
          },
          {
            title: "Feature",
            dataIndex: "feature",
            render: (value) => <span>{value ? "Yes" : "No"}</span>,
          },
          {
            title: "Action",
            render: (value, record) => (
              <Space>
                <Button type="primary" onClick={() => handleEditProduct(record._id)}>
                  Edit
                </Button>
                <Button type="danger" onClick={() => handleDeleteProduct(record._id)}>
                  Delete
                </Button>
              </Space>
            ),
          },
        ]}
        pagination={false}
      />
      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={products.length}
        onChange={handlePageChange}
      />
    </Space>
  );
}

export default Products;
