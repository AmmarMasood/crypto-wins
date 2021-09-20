import React, { useState, useEffect, useContext } from "react";
import { Layout } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import Card from "../Common/Card";
import { userInfoContext } from "../../Contexts/UserStore";
import useWindowDimensions from "../../Helpers/useWindowDimensions";
const { Content } = Layout;

function MainDashboard({
  loading,
  data,
  setCurrentTradeInfoForm,
  filterType,
  unsubscribeToUser,
  subscribeToUser,
}) {
  const { width } = useWindowDimensions();
  const [filterData, setFilterData] = useState([]);
  const [userInfo, setUserInfo] = useContext(userInfoContext);
  // data.sellingPrice - data.buyingPrice
  useEffect(() => {
    setFilterData(data);
    if (filterType === "") {
      setFilterData(data);
    } else if (filterType === "wins") {
      const f = data;
      const p = f.filter((c) => c.profit > 0);
      setFilterData(p);
    } else if (filterType === "loss") {
      const f = data;
      const p = f.filter((c) => c.profit <= 0);
      setFilterData(p);
    } else if (filterType === "open") {
      const f = data;
      const p = f.filter((c) => c.notYetSold);

      setFilterData(p);
    } else if (filterType === "sold") {
      const f = data;
      const p = f.filter((c) => !c.notYetSold);

      setFilterData(p);
    } else if (filterType === "most-money") {
      const f = [...data];
      const max =
        f.length > 0
          ? f.sort((a, b) => parseFloat(b.profit) - parseFloat(a.profit))
          : [];
      setFilterData(max);
    } else if (filterType === "big-profit") {
      const f = [...data];
      const max =
        f.length > 0
          ? f.sort(
              (a, b) =>
                parseFloat(b.percentageGain) - parseFloat(a.percentageGain)
            )
          : [];

      setFilterData(max);
    } else if (filterType === "followed") {
      const f = data;
      const g = f.filter((d) => d._user.subscribers.includes(userInfo.id));
      setFilterData(g);
    } else {
      setFilterData(data);
    }
  }, [filterType]);
  return (
    <Content>
      <div
        className="site-layout-background"
        style={{ padding: width < 500 ? "20px 0" : "20px" }}
      >
        {loading ? (
          <div style={{ textAlign: "center", width: "100%" }}>
            <LoadingOutlined style={{ fontSize: "30px", color: "#f78641" }} />
          </div>
        ) : (
          filterData.map((d, i) => (
            <Card
              userInfo={userInfo}
              data={d}
              key={i}
              onClick={setCurrentTradeInfoForm}
              filterType={filterType}
              subscribeToUser={subscribeToUser}
              unsubscribeToUser={unsubscribeToUser}
            />
          ))
        )}
      </div>
    </Content>
  );
}

export default MainDashboard;
