import React, { useState } from "react";

export const userInfoContext = React.createContext();
export const allNonSoldCoinPricesContext = React.createContext();
export const emptyUserConstants = {
  id: "",
  username: "",
  role: "",
  email: "",
};

const UserStore = ({ children }) => {
  // new stuff starts
  const [userInfo, setUserInfo] = useState(emptyUserConstants);
  const [allUnsoldPrices, setAllUnsoldPrices] = useState([]);
  return (
    <userInfoContext.Provider value={[userInfo, setUserInfo]}>
      <allNonSoldCoinPricesContext.Provider
        value={[allUnsoldPrices, setAllUnsoldPrices]}
      >
        {children}
      </allNonSoldCoinPricesContext.Provider>
    </userInfoContext.Provider>
  );
};

export default UserStore;
