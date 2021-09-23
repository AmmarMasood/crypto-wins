import React, { useState, useEffect, useContext } from "react";
import "./adminDashboard.css";
import { Layout, Menu, Button, Dropdown } from "antd";
import {
  ProfileOutlined,
  UserOutlined,
  HomeOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { withRouter } from "react-router-dom";
import logo from "../../Assets/logo-transparent.png";
import { userInfoContext } from "../../Contexts/UserStore";
import { logoutUser } from "../../Services/auth";
import ManageUsers from "../../Components/Admin/ManageUsers";
import ManageTrades from "../../Components/Admin/ManageTrades";
import ProfileSetting from "../../Components/Admin/ProfileSetting";
import ManageCryptos from "../../Components/Admin/ManageCryptos";
import { TwitterIcon } from "react-share";
import TermsAndCondition from "../TermsAndCondition/TermsAndCondition";
import useWindowDimensions from "../../Helpers/useWindowDimensions";
import ManageIntents from "../../Components/Admin/ManageIntents";

const { Header, Content, Footer, Sider } = Layout;

function AdminDashboard(props) {
  const [userInfo, setUserInfo] = useContext(userInfoContext);
  const [part, setPart] = useState(0);
  const [collapseSider, setCollapseSider] = useState(false);
  const { width } = useWindowDimensions();

  useEffect(() => {
    if (localStorage.getItem("jwtToken")) {
    } else {
      props.history.push("/");
    }
  }, []);

  const menu = (
    <Menu>
      <Menu.Item onClick={() => logoutUser(props.history, setUserInfo)}>
        Logout
      </Menu.Item>
    </Menu>
  );
  return (
    <Layout>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={(broken) => {}}
        onCollapse={(collapsed, type) => {
          setCollapseSider(collapsed);
        }}
        collapsed={collapseSider}
      >
        <img
          src={logo}
          alt=""
          height="80px"
          // style={{ marginLeft: "30px", marginBottom: "20px" }}
        />
        <div
          className="admin-dashboard-selector"
          onClick={() => setPart(0)}
          style={{
            backgroundColor: part === 0 ? "#f5864a" : "transparent",
            color: "#fff",
          }}
        >
          <UserOutlined style={{ marginRight: "10px" }} />
          Manage Users
        </div>
        <div
          className="admin-dashboard-selector"
          onClick={() => setPart(1)}
          style={{
            backgroundColor: part === 1 ? "#f5864a" : "transparent",
            color: "#fff",
          }}
        >
          <ProfileOutlined style={{ marginRight: "10px" }} />
          Manage Trades
        </div>
        <div
          className="admin-dashboard-selector"
          onClick={() => setPart(5)}
          style={{
            backgroundColor: part === 5 ? "#f5864a" : "transparent",
            color: "#fff",
          }}
        >
          <ProfileOutlined style={{ marginRight: "10px" }} />
          Manage Intents
        </div>
        <div
          className="admin-dashboard-selector"
          onClick={() => setPart(3)}
          style={{
            backgroundColor: part === 3 ? "#f5864a" : "transparent",
            color: "#fff",
          }}
        >
          <PlusCircleOutlined style={{ marginRight: "10px" }} />
          Manage Cryptos
        </div>
        <div
          className="admin-dashboard-selector"
          onClick={() => setPart(2)}
          style={{
            backgroundColor: part === 2 ? "#f5864a" : "transparent",
            color: "#fff",
          }}
        >
          <HomeOutlined style={{ marginRight: "10px" }} />
          Profile Setting
        </div>
      </Sider>
      <Layout
        className="site-layout"
        style={{ paddingLeft: collapseSider ? "0" : "200px" }}
      >
        <Header className="site-navbar" style={{ padding: 0 }}>
          <Dropdown overlay={menu} placement="bottomCenter" arrow>
            <Button
              style={{
                backgroundColor: "#f78641",
                borderColor: "#f78641",
                color: "#fff",
              }}
            >
              {userInfo.username}
            </Button>
          </Dropdown>
        </Header>
        <Content>
          {/* content goes here */}
          {part === 0 && <ManageUsers />}
          {part === 1 && <ManageTrades />}
          {part === 2 && <ProfileSetting />}
          {part === 3 && <ManageCryptos />}
          {part === 4 && <TermsAndCondition />}
          {part === 5 && <ManageIntents />}
        </Content>
        {/* <Footer style={{ textAlign: "center" }}>©CryptoWins 2021</Footer>
         */}
        <div
          style={{
            textAlign: "center",
            backgroundColor: "#272a3f",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
            height: "200px",
            flexDirection: width < 600 ? "column" : "row",
          }}
        >
          <span style={{ cursor: "pointer" }} onClick={() => setPart(4)}>
            Privacy Policy
          </span>
          <span style={{ cursor: "pointer" }} onClick={() => setPart(4)}>
            Terms of Use
          </span>
          <span> ©CryptoWins 2021</span>
          <span>hello@cryptowins.co</span>
          <TwitterIcon style={{ height: "30px" }} />
        </div>
      </Layout>
    </Layout>
  );
}

export default withRouter(AdminDashboard);
