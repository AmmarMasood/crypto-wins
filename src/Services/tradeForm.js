import axios from "axios";
import { emptyUserConstants } from "../Contexts/UserStore";
import setAuthToken from "../Helpers/SetAuthToken";
import jwtDecode from "jwt-decode";
import { notification } from "antd";

const openNotificationWithIcon = (type, message, description) => {
  notification[type]({
    message: message,
    description: description,
  });
};

export async function getCoinInfo(cryptoSymbol) {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_SERVER}/api/trade/get-coin-info`,
      { cryptoSymbol: cryptoSymbol }
    );
    return res;
  } catch (err) {
    openNotificationWithIcon("error", "Unable get crypto info");
    return { success: false, res: "unable to create trade" };
  }
}

export async function createTrade(values) {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_SERVER}/api/trade`,
      values
    );
    return { success: true, res: res.data };
  } catch (err) {
    openNotificationWithIcon("error", "Unable create trade");
    return { success: false, res: "unable to create trade" };
  }
}

export async function getUserTrades() {
  try {
    setAuthToken(localStorage.getItem("jwtToken"));
    const res = await axios.get(
      `${process.env.REACT_APP_SERVER}/api/trade/user/all`
    );
    return { success: true, res: res.data };
  } catch (err) {
    openNotificationWithIcon("error", "Unable to get trades");
    return { success: false, res: "unable to get trades" };
  }
}

export async function getAllTrades() {
  try {
    setAuthToken(localStorage.getItem("jwtToken"));
    const res = await axios.get(
      `${process.env.REACT_APP_SERVER}/api/trade/all`
    );
    return { success: true, res: res.data };
  } catch (err) {
    openNotificationWithIcon("error", "Unable to get trades");
    return { success: false, res: "unable to get trades" };
  }
}

export async function deleteTrade(id) {
  try {
    setAuthToken(localStorage.getItem("jwtToken"));
    const res = await axios.delete(
      `${process.env.REACT_APP_SERVER}/api/trade/${id}`
    );
    openNotificationWithIcon("success", "Trade deleted successfully");
    return { success: true, res: res.data };
  } catch (err) {
    openNotificationWithIcon("error", "Unable to delete trade");
    return { success: false, res: "unable to delete user" };
  }
}

export async function updateTrade(id, data) {
  try {
    setAuthToken(localStorage.getItem("jwtToken"));
    const res = await axios.put(
      `${process.env.REACT_APP_SERVER}/api/trade/${id}`,
      data
    );
    openNotificationWithIcon("success", "Trade updated successfully");
    return { success: true, res: res.data };
  } catch (err) {
    openNotificationWithIcon("error", "Unable to update trade");
    return { success: false, res: "unable to delete user" };
  }
}

export async function addComments(values, tradeId) {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_SERVER}/api/trade/comment/${tradeId}`,
      values
    );
    openNotificationWithIcon("success", "Comment added");
    return { success: true, res: res.data };
  } catch (err) {
    openNotificationWithIcon("error", "Unable create comment");
    return { success: false, res: "unable to create trade" };
  }
}
