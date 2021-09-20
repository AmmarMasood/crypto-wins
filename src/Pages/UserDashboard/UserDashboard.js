import React, { useState, useEffect, useContext } from "react";
import "./userDashboard.css";
import { Layout, Menu, Button, Dropdown } from "antd";
import {
  SnippetsOutlined,
  HighlightOutlined,
  TeamOutlined,
  TrophyOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import TradeForm from "../../Components/Trade/TradeForm";
import { withRouter } from "react-router-dom";
import logo from "../../Assets/logo-transparent.png";
import { getAllTrades } from "../../Services/tradeForm";
import {
  allNonSoldCoinPricesContext,
  userInfoContext,
} from "../../Contexts/UserStore";
import { logoutUser } from "../../Services/auth";
import EditTradeForm from "../../Components/Trade/EditTradeForm";
import MainDashboard from "../../Components/User/MainDashboard";
import BuyingIntentForm from "../../Components/BuyingIntent/BuyingIntentForm";
import { getAllIntents } from "../../Services/buyingIntent";
import { Link } from "react-router-dom";
import BuyingIntent from "../../Components/User/BuyingIntent";
import moment from "moment";
import useWindowDimensions from "../../Helpers/useWindowDimensions";
import { TwitterIcon } from "react-share";
import Icon from "@ant-design/icons/lib/components/Icon";
import Followers from "../Followers/Followers";
import TermsAndCondition from "../TermsAndCondition/TermsAndCondition";
import { subToUser, unsubToUser } from "../../Services/users";

const { Header, Footer, Sider } = Layout;

const sideBarMenuItem = {
  // width: "50%",
  height: "fit-content",
  textAlign: "left",
  lineHeight: "1.8",
  padding: "5px 40px",
  // margin: "20px 0",
};

const userSidebarSelectors = {
  fontSize: "16px",
  margin: "5px",
  padding: "10px",
  display: "block",
  textAlign: "center",
  cursor: "pointer",
};

function UserDashboard(props) {
  const { width, height } = useWindowDimensions();
  const [userInfo, setUserInfo] = useContext(userInfoContext);
  const [allUnsoldPrices, setAllUnsoldPrices] = useContext(
    allNonSoldCoinPricesContext
  );
  const [currentPage, setCurrentPage] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [buyingIntentModalVisible, setBuyingIntentModalVisible] =
    useState(false);
  const [loading, setLoading] = useState(false);
  const [intentLoading, setIntentLoading] = useState(false);
  const [selectedTrade, setSelectedTrade] = useState({});
  const [openEditModal, setOpenEditModal] = useState(false);
  const [data, setData] = useState([]);
  const [filterType, setFilterType] = useState("");
  const [buyingIntentFilterType, setBuyingIntentFilterType] = useState("");
  const [intents, setIntents] = useState([]);
  const [collapseSider, setCollapseSider] = useState(false);

  useEffect(async () => {
    fetchTrades();

    fetchIntents();
    // }
  }, [allUnsoldPrices]);

  const fetchTrades = async () => {
    setLoading(true);
    const trades = await getAllTrades();
    if (trades.success) {
      const t = trades.res.tradeForms.reverse();
      const inData = t.map((data) => {
        if (data.notYetSold) {
          const res =
            allUnsoldPrices.length > 0
              ? allUnsoldPrices.filter((f) => f.symbol === data.cryptoSymbol)
              : [];

          const sellingprice = res[0] ? res[0].price : 1;
          const p = ((sellingprice - data.buyingPrice) * data.howMany).toFixed(
            2
          );
          const pg = (
            ((sellingprice - data.buyingPrice) / data.buyingPrice) *
            100
          ).toFixed(2);
          var admission = moment(data.buyingDate);
          var today = moment();
          const diff =
            today.diff(admission, "days") <= 0
              ? 1
              : today.diff(admission, "days");
          const y = (p / diff) * 365;
          data.sellingPrice = sellingprice;
          data.profit = p;
          data.percentageGain = pg;
          data.annualYield = y.toFixed(2);
          return data;
        } else {
          const p = (
            (data.sellingPrice - data.buyingPrice) *
            data.howMany
          ).toFixed(2);
          var admission = moment(data.buyingDate);
          var discharge = moment(data.sellingDate);
          const diff =
            discharge.diff(admission, "days") <= 0
              ? 1
              : discharge.diff(admission, "days");
          data.percentageGain = (
            ((data.sellingPrice - data.buyingPrice) / data.buyingPrice) *
            100
          ).toFixed(2);
          data.profit = (
            (data.sellingPrice - data.buyingPrice) *
            data.howMany
          ).toFixed(2);
          data.annualYield = ((p / diff) * 365).toFixed(2);

          return data;
        }
      });

      setData(inData);
    }
    setLoading(false);
  };

  const fetchIntents = async () => {
    setIntentLoading(true);
    const intents = await getAllIntents();
    if (intents.success) {
      setIntents(intents.res.intents.reverse());
    }

    setIntentLoading(false);
  };
  const setCurrentTradeInfoForm = (data) => {
    setSelectedTrade({ ...data.data, ...data.extra });
    setOpenEditModal(true);
  };

  const subscribeToUser = async (id) => {
    // setLoading(true);
    const res = await subToUser(id);
    if (res.success) {
      const g = data.map((d) => {
        if (d._user._id === id) {
          d._user.subscribers = res.res;
          return d;
        }
        return d;
      });
      const i = intents.map((d) => {
        if (d._user._id === id) {
          d._user.subscribers = res.res;
          return d;
        }
        return d;
      });
      setData(g);

      // setIsModalVisible(false);
      // fetchTrades();
      setIntents(i);
      // fetchIntents();
    }

    // setLoading(false);
  };

  const unsubscribeToUser = async (id) => {
    // setLoading(true);
    const res = await unsubToUser(id);
    if (res.success) {
      const g = data.map((d) => {
        if (d._user._id === id) {
          d._user.subscribers = res.res;
          return d;
        }
        return d;
      });
      const i = intents.map((d) => {
        if (d._user._id === id) {
          d._user.subscribers = res.res;
          return d;
        }
        return d;
      });
      setData(g);

      // setIsModalVisible(false);
      // fetchTrades();
      setIntents(i);
      // fetchIntents();
    }
  };
  const updateCommetsInCards = (comments, id) => {
    const d = data.map((da) => {
      if (da._id === id) {
        da.comments = comments;
        return da;
      }
      return da;
    });
    setData(d);
  };

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
          style={{ cursor: "pointer" }}
          onClick={() => {
            setCurrentPage(0);
            setFilterType("");
          }}
        />

        {/* {localStorage.getItem("jwtToken") && ( */}
        <>
          <div style={{ margin: "20px 0" }}>
            {/* <span
              style={{
                ...userSidebarSelectors,
                background: currentPage === 0 ? "#f5864a" : "transparent",
                color: "#fff",
              }}
              onClick={() => setCurrentPage(0)}
            >
              <SnippetsOutlined style={{ marginRight: "10px" }} />
              Main Dashboard
            </span> */}
            {/* <span
              style={{
                ...userSidebarSelectors,
                background: currentPage === 1 ? "#f5864a" : "transparent",
                color: "#fff",
              }}
              onClick={() => setCurrentPage(1)}
            >
              <HighlightOutlined style={{ marginRight: "10px" }} />
              Trading Intents
            </span>
            {localStorage.getItem("jwtToken") &&    <span
              style={{
                ...userSidebarSelectors,
                background: currentPage === 2 ? "#f5864a" : "transparent",
                color: "#fff",
              }}
              onClick={() => {width < 1000 && setCollapseSider(true);setCurrentPage(2)}}
            >
              <TeamOutlined style={{ marginRight: "10px" }} />
              Followers
            </span>} */}
          </div>
        </>

        {/* )} */}
        {(currentPage === 0 || currentPage === 2 || currentPage === 3) && (
          <Menu mode="inline" style={{ backgroundColor: "#50248F" }}>
            <div style={{ padding: "10px 0px 10px 23px", textAlign: "left" }}>
              {(currentPage === 0 ||
                currentPage === 2 ||
                currentPage === 3) && (
                <Button
                  style={{
                    backgroundColor: "#f78641",
                    borderColor: "#f78641",
                    color: "#fff",
                  }}
                  onClick={() => {
                    width < 1000 && setCollapseSider(true);
                    localStorage.getItem("jwtToken")
                      ? setIsModalVisible(true)
                      : props.history.push("/login");
                  }}
                >
                  Post Your Trade
                </Button>
              )}
            </div>
            <Menu.Item
              key="1"
              style={{
                ...sideBarMenuItem,
                background:
                  currentPage === 0 && filterType === ""
                    ? "#230051"
                    : "transparent",
                color: "#fff",
              }}
              onClick={() => {
                width < 1000 && setCollapseSider(true);
                setCurrentPage(0);
                setFilterType("");
              }}
            >
              Home
            </Menu.Item>
            <Menu.Item
              key="2"
              style={{
                ...sideBarMenuItem,
                background: filterType === "wins" ? "#230051" : "transparent",
                color: "#fff",
              }}
              onClick={() => {
                width < 1000 && setCollapseSider(true);
                setCurrentPage(0);
                setFilterType("wins");
              }}
            >
              Wins Only
            </Menu.Item>
            <Menu.Item
              key="3"
              style={{
                ...sideBarMenuItem,
                background: filterType === "loss" ? "#230051" : "transparent",
                color: "#fff",
              }}
              onClick={() => {
                width < 1000 && setCollapseSider(true);
                setCurrentPage(0);
                setFilterType("loss");
              }}
            >
              Losses Only
            </Menu.Item>
            <Menu.Item
              key="4"
              style={{
                ...sideBarMenuItem,
                background: filterType === "open" ? "#230051" : "transparent",
                color: "#fff",
              }}
              onClick={() => {
                width < 1000 && setCollapseSider(true);
                setCurrentPage(0);
                setFilterType("open");
              }}
            >
              Open Positions
            </Menu.Item>
            <Menu.Item
              key="5"
              style={{
                ...sideBarMenuItem,
                background: filterType === "sold" ? "#230051" : "transparent",
                color: "#fff",
              }}
              onClick={() => {
                width < 1000 && setCollapseSider(true);
                setCurrentPage(0);
                setFilterType("sold");
              }}
            >
              Closed Positions
            </Menu.Item>
            <Menu.Item
              key="6"
              style={{
                ...sideBarMenuItem,
                background:
                  filterType === "big-profit" ? "#230051" : "transparent",
                color: "#fff",
              }}
              onClick={() => {
                width < 1000 && setCollapseSider(true);
                setCurrentPage(0);
                setFilterType("big-profit");
              }}
            >
              Biggest % Gain
            </Menu.Item>
            <Menu.Item
              key="7"
              style={{
                ...sideBarMenuItem,
                background:
                  filterType === "most-money" ? "#230051" : "transparent",
                color: "#fff",
              }}
              onClick={() => {
                width < 1000 && setCollapseSider(true);
                setCurrentPage(0);
                setFilterType("most-money");
              }}
            >
              Most Money
            </Menu.Item>
            {
              <div style={{ padding: "10px 0px 10px 23px", textAlign: "left" }}>
                {(currentPage === 0 ||
                  currentPage === 2 ||
                  currentPage === 3) && (
                  <Button
                    style={{
                      backgroundColor: "#f78641",
                      borderColor: "#f78641",
                      color: "#fff",
                    }}
                    onClick={() => {
                      width < 1000 && setCollapseSider(true);
                      setCurrentPage(1);
                    }}
                  >
                    Trading Intents
                  </Button>
                )}
              </div>
            }
            {localStorage.getItem("jwtToken") && (
              <>
                <Menu.Item
                  key="8"
                  style={{
                    ...sideBarMenuItem,
                    background:
                      filterType === "followed" ? "#230051" : "transparent",
                    color: "#fff",
                  }}
                  onClick={() => {
                    // width < 1000 && setCollapseSider(true);
                    setCurrentPage(0);
                    setFilterType("followed");
                  }}
                >
                  Followed Traders
                </Menu.Item>
                <Menu.Item
                  style={{
                    ...sideBarMenuItem,
                    background: currentPage === 2 ? "#230051" : "transparent",
                    color: "#fff",
                  }}
                  onClick={() => {
                    width < 1000 && setCollapseSider(true);
                    setFilterType("");
                    setCurrentPage(2);
                  }}
                >
                  My Follows
                </Menu.Item>
              </>
            )}
            }
          </Menu>
        )}

        {currentPage === 1 && (
          <Menu mode="inline" style={{ backgroundColor: "#50248F" }}>
            <div style={{ padding: "10px 0px 10px 25px", textAlign: "left" }}>
              {currentPage === 1 && localStorage.getItem("jwtToken") && (
                <Button
                  style={{
                    backgroundColor: "#f78641",
                    borderColor: "#f78641",
                    color: "#fff",
                  }}
                  onClick={() => {
                    width < 1000 && setCollapseSider(true);
                    setBuyingIntentModalVisible(true);
                  }}
                >
                  Post Trading Intent
                </Button>
              )}
            </div>
            <Menu.Item
              key="1"
              style={{
                ...sideBarMenuItem,
                background:
                  currentPage === 0 && filterType === ""
                    ? "#230051"
                    : "transparent",
                color: "#fff",
              }}
              onClick={() => {
                width < 1000 && setCollapseSider(true);
                setFilterType("");
                setCurrentPage(0);
              }}
            >
              Home
            </Menu.Item>
            <Menu.Item
              key="2"
              style={{
                ...sideBarMenuItem,
                background:
                  buyingIntentFilterType === "buy" ? "#230051" : "transparent",
                color: "#fff",
              }}
              onClick={() => {
                width < 1000 && setCollapseSider(true);
                setBuyingIntentFilterType("buy");
              }}
            >
              Buying Intent
            </Menu.Item>
            <Menu.Item
              key="3"
              style={{
                ...sideBarMenuItem,
                background:
                  buyingIntentFilterType === "sell" ? "#230051" : "transparent",
                color: "#fff",
              }}
              onClick={() => {
                width < 1000 && setCollapseSider(true);
                setBuyingIntentFilterType("sell");
              }}
            >
              Selling Intent
            </Menu.Item>
            {
              <div style={{ margin: "20px 0" }}>
                {currentPage === 1 && (
                  <span
                    style={{
                      ...userSidebarSelectors,
                      background: "transparent",
                      color: "#fff",
                    }}
                    onClick={() => {
                      setCurrentPage(0);
                      setFilterType("");
                    }}
                  >
                    <ArrowLeftOutlined style={{ marginRight: "10px" }} />
                    Back
                  </span>
                )}
              </div>
            }
          </Menu>
        )}
      </Sider>
      <Layout
        className="site-layout"
        style={{ paddingLeft: width > 1000 ? "200px" : "0" }}
      >
        <Header
          className="site-navbar"
          style={{ padding: "10px", position: "relative" }}
        >
          <h1
            style={{
              color: "#fff",
              margin: "0 auto",
              fontSize: width < 700 ? "16px" : "26px",
              lineHeight: "20px",
              textAlign: "center",
              paddingTop: "10px",
            }}
          >
            Show & Tell For Crypto Traders
          </h1>
          {localStorage.getItem("jwtToken") ? (
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
          ) : (
            <>
              <Link to="/login">
                <Button
                  style={{
                    backgroundColor: "#f78641",
                    borderColor: "#f78641",
                    color: "#fff",
                  }}
                >
                  Login
                </Button>
              </Link>
            </>
          )}
        </Header>
        {currentPage === 0 && (
          <MainDashboard
            key={Math.random()}
            loading={loading}
            filterType={filterType}
            data={data}
            setCurrentTradeInfoForm={setCurrentTradeInfoForm}
            unsubscribeToUser={unsubscribeToUser}
            subscribeToUser={subscribeToUser}
          />
        )}
        {currentPage === 1 && (
          <BuyingIntent
            key={Math.random()}
            filterType={buyingIntentFilterType}
            loading={intentLoading}
            data={intents}
            fetchIntents={fetchIntents}
            unsubscribeToUser={unsubscribeToUser}
            subscribeToUser={subscribeToUser}
          />
        )}
        {currentPage === 2 && (
          <Followers
            key={Math.random()}
            setData={setData}
            data={data}
            setIntents={setIntents}
            intents={intents}
          />
        )}
        {currentPage === 3 && <TermsAndCondition key={Math.random()} />}
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
          <span style={{ cursor: "pointer" }} onClick={() => setCurrentPage(3)}>
            Privacy Policy
          </span>
          <span style={{ cursor: "pointer" }} onClick={() => setCurrentPage(3)}>
            Terms of Use
          </span>
          <span> ©CryptoWins 2021</span>
          <span>hello@cryptowins.co</span>
          <TwitterIcon style={{ height: "30px" }} />
        </div>
      </Layout>
      {/* trade modal*/}
      <TradeForm
        fetchTrades={fetchTrades}
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
      />
      {/* buying intent form */}
      <BuyingIntentForm
        isModalVisible={buyingIntentModalVisible}
        setIsModalVisible={setBuyingIntentModalVisible}
        fetchIntents={fetchIntents}
      />
      {/* edit trade form */}
      <EditTradeForm
        key={Math.random()}
        fetchTrades={fetchTrades}
        isModalVisible={openEditModal}
        setIsModalVisible={setOpenEditModal}
        selectedTrade={selectedTrade}
        userDashboard={true}
        updateCommetsInCards={updateCommetsInCards}
      />
    </Layout>
  );
}

export default withRouter(UserDashboard);
