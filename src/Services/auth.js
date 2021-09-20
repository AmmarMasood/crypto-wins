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

export async function loginUser(values) {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_SERVER}/api/users/login`,
      values
    );
    return { success: true, res: res.data };
  } catch (err) {
    typeof err.response.data === "string" &&
      openNotificationWithIcon(
        "error",
        err.response.data ? err.response.data : "Unable to login"
      );
    typeof err.response.data === "object" &&
      openNotificationWithIcon(
        "error",
        err.response.data ? err.response.data.message : "Unable to login"
      );
    return { success: false, res: "unable to login" };
  }
}

export function registerUser(values) {
  return axios
    .post(`${process.env.REACT_APP_SERVER}/api/users/register`, values)
    .then((res) => {
      return { data: res.data, success: true };
    })
    .catch((err) => {
      openNotificationWithIcon(
        "error",
        "Unable to register, email already exist"
      );
      return { data: err, success: false };
    });
}

export function logoutUser(histoy, setUserInfo) {
  setUserInfo(emptyUserConstants);
  localStorage.removeItem("jwtToken");
  localStorage.removeItem("package-type");
  localStorage.removeItem("isActive");
  histoy.push("/login");
}

export function checkUser(userInfo, setUserInfo, token, history) {
  if (token) {
    //set the token in header
    setAuthToken(token);
    //decode the token so that we can call our action
    const decode = jwtDecode(token);
    setUserInfo({
      ...userInfo,
      username: decode.username,
      email: decode.email,
      role: decode.role,
      id: decode.id,
    });

    //to logout the user once the token expires we do this
    const currentTime = Date.now() / 1000;
    if (decode.exp < currentTime) {
      //logout user
      logoutUser(history, setUserInfo);
      //redirect to login screen
      window.location.href = "./login";
    }
  }
}
