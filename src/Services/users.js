import axios from "axios";
import setAuthToken from "../Helpers/SetAuthToken";
import { notification } from "antd";

const openNotificationWithIcon = (type, message, description) => {
  notification[type]({
    message: message,
    description: description,
  });
};

export async function getAllUsers() {
  try {
    setAuthToken(localStorage.getItem("jwtToken"));
    const res = await axios.get(
      `${process.env.REACT_APP_SERVER}/api/users/all`
    );
    return { success: true, res: res.data };
  } catch (err) {
    openNotificationWithIcon("error", "Unable to get users");
    return { success: false, res: "unable to get user" };
  }
}

export async function deleteUser(id) {
  try {
    setAuthToken(localStorage.getItem("jwtToken"));
    const res = await axios.delete(
      `${process.env.REACT_APP_SERVER}/api/users/${id}`
    );
    openNotificationWithIcon("success", "User deleted successfully");
    return { success: true, res: res.data };
  } catch (err) {
    openNotificationWithIcon("error", "Unable to delete user");
    return { success: false, res: "unable to delete user" };
  }
}

export async function subToUser(userId) {
  try {
    setAuthToken(localStorage.getItem("jwtToken"));
    const res = await axios.put(
      `${process.env.REACT_APP_SERVER}/api/users/subscribe/${userId}`
    );
    openNotificationWithIcon("success", "Successfully followed user");
    return { success: true, res: res.data };
  } catch (err) {
    openNotificationWithIcon("error", "Unable to subscribe to user");
    return { success: false, res: "unable to subscribe to intent" };
  }
}

export async function unsubToUser(userId) {
  try {
    setAuthToken(localStorage.getItem("jwtToken"));
    const res = await axios.put(
      `${process.env.REACT_APP_SERVER}/api/users/unsubscribe/${userId}`
    );
    openNotificationWithIcon("success", "Successfully unfollowed user");
    return { success: true, res: res.data };
  } catch (err) {
    openNotificationWithIcon("error", "Unable to unsubscribe to user");
    return { success: false, res: "unable to unsubscribe to user" };
  }
}

export async function authWithTwitter(values) {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_SERVER}/api/users/auth/social`,
      values
    );
    // console.log("response", res);
    // openNotificationWithIcon("success", "Successfully unfollowed ");
    return { success: true, res: res.data };
  } catch (err) {
    console.log("response", err);
    // openNotificationWithIcon("error", "Unable to unsubscribe to user");
    return { success: false, res: "unable to unsubscribe to user" };
  }
}

export function updateAdmin(values) {
  return axios
    .put(`${process.env.REACT_APP_SERVER}/api/users/update/admin`, values)
    .then((res) => {
      openNotificationWithIcon("success", "Profile updated");
      return { data: res.data, success: true };
    })
    .catch((err) => {
      openNotificationWithIcon("error", "Unable update admin");
      return { data: err, success: false };
    });
}

export function getPasswordResetLink(values) {
  return axios
    .post(`${process.env.REACT_APP_SERVER}/api/users/reset-password`, values)
    .then((res) => {
      openNotificationWithIcon(
        "success",
        "Please check your email address, a link has been sent to reset the password"
      );
      return { data: res.data, success: true };
    })
    .catch((err) => {
      openNotificationWithIcon(
        "error",
        "Unable to send link to the provided email"
      );
      return { data: err, success: false };
    });
}

export function resetPassord(values) {
  return axios
    .post(`${process.env.REACT_APP_SERVER}/api/users/new-password`, values)
    .then((res) => {
      openNotificationWithIcon("success", "Password reset successfully");
      return { data: res.data, success: true };
    })
    .catch((err) => {
      openNotificationWithIcon("error", "Unable to reset password");
      return { data: err, success: false };
    });
}
