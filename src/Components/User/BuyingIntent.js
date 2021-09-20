import { LoadingOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import BuyingIntentCard from "../Common/BuyingIntentCard";
import { Layout } from "antd";
import useWindowDimensions from "../../Helpers/useWindowDimensions";

const { Content } = Layout;

function BuyingIntent({
  loading,
  data,
  fetchIntents,
  filterType,
  unsubscribeToUser,
  subscribeToUser,
}) {
  const { width } = useWindowDimensions();
  const [filterData, setFilterData] = useState([]);

  useEffect(() => {
    setFilterData(data);
    if (filterType === "sell") {
      const f = data.filter((g) => !g.buyingPrice);
      setFilterData(f);
    } else if (filterType === "buy") {
      const f = data.filter((g) => !g.sellingPrice);
      setFilterData(f);
    } else {
      setFilterData(data);
    }
  }, [data, filterType]);

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
            <BuyingIntentCard
              data={d}
              key={i}
              fetchIntents={fetchIntents}
              unsubscribeToUser={unsubscribeToUser}
              subscribeToUser={subscribeToUser}
            />
          ))
        )}
      </div>
    </Content>
  );
}

export default BuyingIntent;
