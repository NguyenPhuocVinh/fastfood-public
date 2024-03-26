import { Space, Table, Typography, Button, Pagination, notification } from "antd";
import { useEffect, useState } from "react";
import { deleteCategory, getallcategories } from "../../API";


function Categorys() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setLoading(true);

    getallcategories()
      .then((data) => {
        setCategories(data.categories);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (categories.length > 0) {
      console.log(categories);
    }
  }, [categories]);

  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
  };

  const handleAddButtonClick = () => {
    window.location.href = "/add-category";
  };

  const handleEditCategory = (_id) => {
    if (_id) {
      window.location.href = `/update-category/${_id}`;
    } else {
      console.error("ID is undefined");
    }
  }

  const handleDeleteCategory = (_id) => {
    deleteCategory(_id)
      .then((data) => {
        notification.success({
          message: "Delete Category",
          description: data.message,
        });
        setCategories(categories.filter((category) => category._id !== _id));
      })
      .catch((error) => {
        notification.error({
          message: "Delete Category",
          description: error.message,
        });
      });
  }

  
  const paginatedCate = categories.slice(
    (currentPage - 1) * 4,
    currentPage * 4
  );

  return (
    <Space size={20} direction="vertical">
      <Typography.Title level={4}>Category</Typography.Title>
      <Button type="primary" onClick={handleAddButtonClick}>
        Add
      </Button>
      <Table
        loading={loading}
        dataSource={paginatedCate} 
        columns={[
          {
            title: "Category Name",
            dataIndex: "categoryName",
          },
          {
            title: "Category Image",
            dataIndex: "imagePath",
            render:(Link)=> <img src={Link} alt="" style={{width: '100px', height: '100px'}}/>
          },
          {
            title: "Action",
            render: (record) => (
              <Space size={5}>
                <Button type="danger" onClick={() => handleEditCategory(record._id)}>
                  Edit
                </Button>
                <Button type="primary" onClick={() => handleDeleteCategory(record._id)}>
                  Delete
                </Button>
              </Space>
            ),
          },
        ]}
        pagination={false}
      />
      {<Pagination
        current={currentPage}
        pageSize={4}
        total={categories.length} 
        onChange={handlePageChange}
      />}
    </Space>
  );
}

export default Categorys;
