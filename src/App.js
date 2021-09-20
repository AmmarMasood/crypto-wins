import React, { useEffect, useContext, useState } from "react";
import Pusher from "pusher-js";
import Login from "./Pages/Login/Login";
import Register from "./Pages/Register/Register";
import UserDashboard from "./Pages/UserDashboard/UserDashboard";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  useHistory,
} from "react-router-dom";
import {
  allNonSoldCoinPricesContext,
  userInfoContext,
} from "./Contexts/UserStore";
import { checkUser } from "./Services/auth";
import AdminDashboard from "./Pages/AdminDashboard/AdminDashboard";
import { notification } from "antd";
import EditTradeForm from "./Components/Trade/EditTradeForm";
import jwtDecode from "jwt-decode";
import { getAllTrades, getCoinInfo } from "./Services/tradeForm";
import { updateUnsoldCrypto } from "./Services/cryptoNames";
import EnterEmail from "./Pages/ResetPassword/EnterEmail";
import NewPassword from "./Pages/ResetPassword/NewPassword";

var pusher = new Pusher(process.env.REACT_APP_PUSHERAPP_KEY, {
  cluster: process.env.REACT_APP_PUSHERAPP_CLUSTER,
});

function App() {
  let history = useHistory();
  const [userInfo, setUserInfo] = useContext(userInfoContext);
  const [tradeInfoModal, setTradeInfoModal] = useState(false);
  const [selectedTradeNotification, setSelectedTradeNotification] = useState(
    {}
  );
  const [allUnsoldPrices, setAllUnsoldPrices] = useContext(
    allNonSoldCoinPricesContext
  );

  const openNotification = (trade) => {
    notification.open({
      message: `User ${trade._user.username} just posted a new trade`,
      description: "Please click for more information!",
      duration: 0,
      onClick: () => {
        setSelectedTradeNotification(trade);
        setTradeInfoModal(true);
      },
    });
  };

  useEffect(() => {
    checkUser(userInfo, setUserInfo, localStorage.getItem("jwtToken"), history);
    window.setTimeout(() => {
      updateUnsoldCrypto(allUnsoldPrices, setAllUnsoldPrices);
    }, 21600);
    updateUnsoldCrypto(allUnsoldPrices, setAllUnsoldPrices);
    if (localStorage.getItem("jwtToken")) {
      const decode = jwtDecode(localStorage.getItem("jwtToken"));
      setUserInfo({
        ...userInfo,
        username: decode.username,
        email: decode.email,
        role: decode.role,
        id: decode.id,
      });

      const channel = pusher.subscribe("tradeforms");

      channel.bind("inserted", (data) => {
        if (
          data.change &&
          data.change._user.subscribers.includes(decode.id.toString())
        ) {
          openNotification(data.change);
        }

        // alert(JSON.stringify(data));
      });
    }
  }, []);

  return (
    <div style={{ backgroundColor: "#1E1E2B !important" }}>
      <Router>
        <Route path="/login" exact component={Login} />
        <Route path="/" exact component={UserDashboard} />
        <Route path="/admin/dashboard" exact component={AdminDashboard} />
        <Route path="/register" exact component={Register} />
        <Route path="/reset-password" exact component={EnterEmail} />
        <Route path="/new-password/:resetToken" exact component={NewPassword} />
      </Router>
      <EditTradeForm
        key={selectedTradeNotification._id}
        userDashboard={true}
        isModalVisible={tradeInfoModal}
        setIsModalVisible={setTradeInfoModal}
        selectedTrade={selectedTradeNotification}
      />
    </div>
  );
}

export default App;
