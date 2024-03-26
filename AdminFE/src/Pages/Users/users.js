import { Space, Table, Typography, Button, Pagination, notification } from "antd";
import { useEffect, useState } from "react";
import { getAllUser, deleteUser } from "../../API";

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  useEffect(() => {
    setLoading(true);

    getAllUser()
      .then((data) => {
        setUsers(data.users);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (users.length > 0) {
      console.log(users);
    }
  }, [users]);

  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
  };

  const handleDeleteUser = (_id) => {
    deleteUser(_id)
      .then((data) => {
        notification.success({
          message: "Delete User",
          description: data.message,
        });
        setUsers(users.filter((user) => user._id !== _id));
      })
      .catch((error) => {
        notification.error({
          message: "Delete User",
          description: error.message,
        });
      });
  }

  const paginatedUsers = users.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <Space size={20} direction="vertical">
      <Typography.Title level={4}>Users</Typography.Title>
      <Table
        loading={loading}
        dataSource={paginatedUsers}
        columns={[
          {
            title: "FullName",
            dataIndex: "fullName",
          },
          {
            title: "Email",
            dataIndex: "email",
          },
          {
            title: "Phone Number",
            dataIndex: "phone",
          },
          {
            title: "Address",
            dataIndex: "address",
          },
          {
            title: "Role",
            dataIndex: "role",
          },
          {
            title: "Action",
            //dataIndex: "_id",
            render: (value, record) => {
              return (
                <Space>
                  <Button type="primary" onClick={() =>handleDeleteUser(record._id)}>
                    Delete
                  </Button>
                </Space>
              );
            },
          },
        ]}
        pagination={false}
      />
      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={users.length}
        onChange={handlePageChange}
      />
    </Space>
  );
}

export default Users;
