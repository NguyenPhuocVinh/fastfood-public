import { Space, Table, Typography, Pagination } from "antd";
import { useEffect, useState } from "react";
import { getOrders } from "../../API";

function formatPrice(price) {
  return price.toLocaleString('vi-VN') + ' VNĐ';
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${day < 10 ? '0' + day : day}-${month < 10 ? '0' + month : month}-${year}`;
}

function formatProducts(products) {
  return products.map(product => (
    <div key={product.id}>
      {product.name} x {product.quantity}
      <br />
    </div>
  ));
}

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 4;

  useEffect(() => {
    setLoading(true);

    getOrders()
      .then((res) => {
        console.log(res);
        setOrders(res.orders);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <Space size={20} direction="vertical">
      <Typography.Title level={4}>Orders</Typography.Title>
      <Table
        loading={loading}
        dataSource={orders.slice((currentPage - 1) * pageSize, currentPage * pageSize)}
        columns={[
          {
            title: "Full Name",
            dataIndex: "fullName",
          },
          {
            title: "Email",
            dataIndex: "email",
          },
          {
            title: "Phone",
            dataIndex: "phone",
          },
          {
            title: "Product",
            dataIndex: "products",
            render: (products) => formatProducts(products),
          },
          {
            title: "Total Price",
            dataIndex: "totalAmount",
            render: (value) => formatPrice(value),
          },
          {
            title: "Payment Method",
            dataIndex: "PaymentMethod",
          },
          {
            title: "Payment Status",
            dataIndex: "paymentStatus",
          },
          {
            title: "Order Date",
            dataIndex: "createAt",
            render: (value) => formatDate(value),
          },
        ]}
        pagination={false}
      />
      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={orders.length}
        onChange={handlePageChange}
      />
    </Space>
  );
}

export default Orders;
