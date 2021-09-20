import axios from "axios";
import setAuthToken from "../Helpers/SetAuthToken";
import { notification } from "antd";

const openNotificationWithIcon = (type, message, description) => {
  notification[type]({
    message: message,
    description: description,
  });
};

export async function getAllName() {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_SERVER}/api/crypto/all`
    );
    return { success: true, res: res.data };
  } catch (err) {
    openNotificationWithIcon("error", "Unable to get all crypto names");
    return { success: false, res: "unable to get cryptos" };
  }
}

export async function deleteCrypto(id) {
  try {
    const res = await axios.delete(
      `${process.env.REACT_APP_SERVER}/api/crypto/${id}`
    );
    openNotificationWithIcon("success", "Crypto deleted successfully");
    return { success: true, res: res.data };
  } catch (err) {
    openNotificationWithIcon("error", "Unable to delete crypto");
    return { success: false, res: "unable to delete user" };
  }
}

export async function createCrypto(values) {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_SERVER}/api/crypto/name`,
      values
    );
    openNotificationWithIcon("success", "Crypto added");
    return { success: true, res: res.data };
  } catch (err) {
    openNotificationWithIcon(
      "error",
      "Unable create crypto, please make sure that crypto doesnt already exist"
    );
    return { success: false, res: "unable to create crypto" };
  }
}

export async function updateUnsoldCrypto(allUnsoldPrices, setAllUnsoldPrices) {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_SERVER}/api/crypto/all/unsold/crypto/prices`
    );
    setAllUnsoldPrices(res.data);
    return { success: true, res: res.data };
  } catch (err) {
    // openNotificationWithIcon("error", "Unable to contact coinmarketcap API");
    return { success: false, res: "unable to create crypto" };
  }
}
