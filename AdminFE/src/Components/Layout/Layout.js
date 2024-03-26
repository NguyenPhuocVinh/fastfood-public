// import { Space } from "antd";
import "./Layout.css";
import AppFooter from "../AppFooter";
import AppHeader from "../AppHeader";
import PageContent from "../PageContent";
import SideMenu from "../SideMenu";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <div className="App">
      <AppHeader />
      <div className="SideMenuAndPageContent">
        <SideMenu></SideMenu>
        <PageContent></PageContent>
        <Outlet />
      </div>
      <AppFooter />
    </div>
  );
}
export default Layout;