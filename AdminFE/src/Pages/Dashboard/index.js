import {
  ShoppingCartOutlined,
  ShoppingOutlined,
  UserOutlined,
  CarryOutFilled,
} from "@ant-design/icons";
import { Card, Space, Statistic, Typography } from "antd";
import { useEffect, useState } from "react";
import {getAllProducts,getallcategories,getAllUser, getOrders } from "../../API/index";


import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";


ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function Dashboard() {
  const [categorys, setCategorys] = useState(0);
  const [Products, setProducts] = useState(0);
  const [users, setUsers] = useState(0);
  const [orders, setOrders] = useState(0);

  const [dailyRevenue, setDailyRevenue] = useState(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState(0);
  const [yearlyRevenue, setYearlyRevenue] = useState(0);

  useEffect(() => {
    getOrders().then((res) => {
      const daily = calculateRevenue(res.orders, "day");
      const monthly = calculateRevenue(res.orders, "month");
      const yearly = calculateRevenue(res.orders, "year");

      setDailyRevenue(daily);
      setMonthlyRevenue(monthly);
      setYearlyRevenue(yearly);
    });
  }, []);

  const calculateRevenue = (orders, type) => {
    const currentDate = new Date();
    let totalRevenue = 0;

    orders.forEach((order) => {
      const orderDate = new Date(order.createAt);

      if (
        orderDate.getDate() === currentDate.getDate() &&
        orderDate.getMonth() === currentDate.getMonth() &&
        orderDate.getFullYear() === currentDate.getFullYear() &&
        type === "day"
      ) {
        totalRevenue += order.totalAmount;
      }

      if (
        orderDate.getMonth() === currentDate.getMonth() &&
        orderDate.getFullYear() === currentDate.getFullYear() &&
        type === "month"
      ) {
        totalRevenue += order.totalAmount;
      }

      if (
        orderDate.getFullYear() === currentDate.getFullYear() &&
        type === "year"
      ) {
        totalRevenue += order.totalAmount;
      }
    });

    return totalRevenue;
  };


  useEffect(() => {
    getAllProducts().then((res) => {
      setProducts(res.products.length);
    });
    getallcategories().then((res) => {
      console.log(res);
      setCategorys(res.categories.length);
    });
    getAllUser().then((res) => {
      setUsers(res.users.length);
    });
    getOrders().then((res) => {
      console.log(res);
      setOrders(res.orders.length);
    });
  }, []);

  return (
    <Space size={20} direction="vertical">
      <Typography.Title level={4}>Dashboard</Typography.Title>
      <Space direction="horizontal">

      
        <DashboardCard
          icon={
            <ShoppingCartOutlined
              style={{
                color: "green",
                backgroundColor: "rgba(0,255,0,0.25)",
                borderRadius: 20,
                fontSize: 24,
                padding: 8,
              }}
            />
          }
          title={"Categorys"}
          value={categorys}
        />
        <DashboardCard
          icon={
            <CarryOutFilled
              style={{
                color: "green",
                backgroundColor: "rgba(0,255,0,0.25)",
                borderRadius: 20,
                fontSize: 24,
                padding: 8,
              }}
            />
          }
          title={"Orders"}
          value={orders}
        />

        <DashboardCard
          icon={
            <ShoppingOutlined
              style={{
                color: "blue",
                backgroundColor: "rgba(0,0,255,0.25)",
                borderRadius: 20,
                fontSize: 24,
                padding: 8,
              }}
            />
          }
          title={"Products"}
          value={Products}
        />
        <DashboardCard
          icon={
            <UserOutlined
              style={{
                color: "purple",
                backgroundColor: "rgba(0,255,255,0.25)",
                borderRadius: 20,
                fontSize: 24,
                padding: 8,
              }}
            />
          }
          title={"Users"}
          value={users}
        />
      </Space>
      <Space>
        
        <DashboardChart />
        <DashboardChart2/>
        {/* <Pie data={getProductData()} /> */}
      </Space>
      <Space>
      <DashboardCard
          icon={<ShoppingOutlined />}
          title="Daily Revenue"
          value={dailyRevenue}
        />
        <DashboardCard
          icon={<ShoppingOutlined />}
          title="Monthly Revenue"
          value={monthlyRevenue}
        />
        <DashboardCard
          icon={<ShoppingOutlined />}
          title="Yearly Revenue"
          value={yearlyRevenue}
        />

      </Space>
    </Space>
  );
}

function DashboardCard({ title, value, icon }) {
  return (
    <Card>
      <Space direction="horizontal">
        {icon}
        <Statistic title={title} value={value} />
      </Space>
    </Card>
  );
}


function DashboardChart() {
  const [orders, setOrders] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    getOrders().then((res) => {
      console.log(res);
      const labels = res.orders.map((order) => order.fullName);
      const data = res.orders.map((order) => order.totalAmount);

      setOrders({
        labels: labels,
        datasets: [
          {
            label: "Total Amount",
            data: data,
            backgroundColor: "rgba(0,123,255,0.5)",
          },
        ],
      });
    }).catch(error => {
      console.error("Error while fetching order:", error);
    });
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
      title: {
        display: true,
        text: "Total Amount of Orders",
      },
    },
  };

  return (
    <Card style={{ width: 500, height: 250 }}>
      <Bar options={options} data={orders} />
    </Card>
  );
}



function DashboardChart2() {
  const [orders, setOrders] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    getOrders().then((res) => {
      console.log(res);
      const labels = res.orders.map((order) => order.fullName);
      const data = res.orders.map((order) => order.products.length);

      setOrders({
        labels: labels,
        datasets: [
          {
            label: "Number of Products",
            data: data,
            backgroundColor: "rgba(0,123,255,0.5)",
          },
        ],
      });
    }).catch(error => {
      console.error("Error while fetching orders:", error);
    });
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
      title: {
        display: true,
        text: "Number products of Orders",
      },
    },
  };

  
  return (
    <Card style={{ width: 500, height: 250 }}>
      <Bar options={options} data={orders} />
    </Card>
  );
}
export default Dashboard;
