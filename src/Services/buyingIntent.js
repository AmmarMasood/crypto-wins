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

export async function createIntent(values) {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_SERVER}/api/intent`,
      values
    );
    return { success: true, res: res.data };
  } catch (err) {
    openNotificationWithIcon("error", "Unable create intent");
    return { success: false, res: "unable to create intent" };
  }
}

export async function getUserIntents() {
  try {
    setAuthToken(localStorage.getItem("jwtToken"));
    const res = await axios.get(
      `${process.env.REACT_APP_SERVER}/api/intent/user/all`
    );
    return { success: true, res: res.data };
  } catch (err) {
    openNotificationWithIcon("error", "Unable to get intents");
    return { success: false, res: "unable to get intents" };
  }
}

export async function getAllIntents() {
  try {
    setAuthToken(localStorage.getItem("jwtToken"));
    const res = await axios.get(
      `${process.env.REACT_APP_SERVER}/api/intent/all`
    );
    return { success: true, res: res.data };
  } catch (err) {
    openNotificationWithIcon("error", "Unable to get intents");
    return { success: false, res: "unable to get intents" };
  }
}

export async function subscribeToIntent(intentId) {
  try {
    setAuthToken(localStorage.getItem("jwtToken"));
    const res = await axios.put(
      `${process.env.REACT_APP_SERVER}/api/intent/subscribe/${intentId}`
    );
    openNotificationWithIcon("success", "Successfully followed intent");
    return { success: true, res: res.data };
  } catch (err) {
    openNotificationWithIcon("error", "Unable to subscribe to intent");
    return { success: false, res: "unable to subscribe to intent" };
  }
}

export async function unsubscribeToIntent(intentId) {
  try {
    setAuthToken(localStorage.getItem("jwtToken"));
    const res = await axios.put(
      `${process.env.REACT_APP_SERVER}/api/intent/unsubscribe/${intentId}`
    );
    openNotificationWithIcon("success", "Successfully unfollowed intent");
    return { success: true, res: res.data };
  } catch (err) {
    openNotificationWithIcon("error", "Unable to unsubscribe to intent");
    return { success: false, res: "unable to unsubscribe to intent" };
  }
}

export async function deleteIntent(id) {
  try {
    setAuthToken(localStorage.getItem("jwtToken"));
    const res = await axios.delete(
      `${process.env.REACT_APP_SERVER}/api/intent/${id}`
    );
    openNotificationWithIcon("success", "Intent deleted successfully");
    return { success: true, res: res.data };
  } catch (err) {
    openNotificationWithIcon("error", "Unable to delete intent");
    return { success: false, res: "unable to delete user" };
  }
}

export async function updateIntent(id, data) {
  try {
    setAuthToken(localStorage.getItem("jwtToken"));
    const res = await axios.put(
      `${process.env.REACT_APP_SERVER}/api/intent/${id}`,
      data
    );
    openNotificationWithIcon("success", "Intent updated successfully");
    return { success: true, res: res.data };
  } catch (err) {
    openNotificationWithIcon("error", "Unable to update intent");
    return { success: false, res: "unable to delete intent" };
  }
}
