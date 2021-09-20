const axios = require("axios");

export const fetchCoinsInfo = (cryptoSymbol) => {
  // delete axios.defaults.headers.common["Authorization"];
  return axios
    .get("https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest", {
      params: {
        symbol: cryptoSymbol,
        convert: "USD",
      },
      headers: {
        Accepts: "application/json",
        "X-CMC_PRO_API_KEY": `${process.env.REACT_APP_COINMARKETCAP_API_KEY}`,
      },
    })
    .then((response) => {
      return response;
    })
    .catch((err) => {
      console.log("API call error:", err);
    });
};
