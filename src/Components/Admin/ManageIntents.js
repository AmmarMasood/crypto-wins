import React, { useState, useEffect } from "react";
import { Button, Table, Space, Input } from "antd";
import moment from "moment";
import { deleteTrade, getAllTrades } from "../../Services/tradeForm";
import { LoadingOutlined } from "@ant-design/icons";
import AdminEditTradeCard from "./AdminEditTradeCard";
import { deleteIntent, getAllIntents } from "../../Services/buyingIntent";
import AdminEditIntentCard from "./AdminEditIntentCard";
import { getAllName } from "../../Services/cryptoNames";

function ManageIntents() {
  const [filterTrades, setFilterTrades] = useState([]);
  const [allTrades, setAllTrades] = useState([]);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedTrade, setSelectedTrade] = useState({});
  const [allCryptos, setAllCryptos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTrades();
  }, []);

  const fetchTrades = async () => {
    setLoading(true);
    const data = await getAllIntents();
    const res = await getAllName();

    if (data.success) {
      //   console.log(data);
      setAllCryptos(res.res.cryptos);
      setAllTrades(data.res.intents);
      setFilterTrades(data.res.intents);
    }
    setLoading(false);
  };
  const deTrade = async (id) => {
    const data = await deleteIntent(id);
    if (data.success) {
      fetchTrades();
    }
  };
  const columns = [
    {
      title: "Id",
      dataIndex: "_id",
      key: "_id",
      render: (text) => <span className="font-paragraph-black">{text}</span>,
    },
    {
      title: "Crypto",
      render: (text) => (
        <span className="font-paragraph-black">
          {text.buyingCryptoName
            ? text.buyingCryptoName
            : text.sellingCryptoName}
        </span>
      ),
    },
    {
      title: "Price",
      render: (text) => (
        <span className="font-paragraph-black">
          {text.buyingPrice ? text.buyingPrice : text.sellingPrice}
        </span>
      ),
    },
    {
      title: "Type",

      render: (text) => (
        <span className="font-paragraph-black">
          {text.sellingPrice ? "Selling Intent" : "Buying Intent"}
        </span>
      ),
    },
    {
      title: "User",
      dataIndex: "_user",
      key: "_user",
      render: (text) => (
        <span className="font-paragraph-black">{text.username + ""}</span>
      ),
    },
    {
      title: "Updated At",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (text) => (
        <span className="font-paragraph-black">
          {moment(text).format("DD MMM YYYY")}
        </span>
      ),
    },

    {
      title: "Action",
      key: "challengePreviewLink",
      render: (text, record) => (
        <Space size="middle">
          <Button
            type="primary"
            onClick={() => {
              setSelectedTrade(text);
              setOpenEditModal(true);
            }}
          >
            Edit
          </Button>
          <Button type="danger" onClick={() => deTrade(text._id)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];
  return (
    <div style={{ margin: "0 50px" }}>
      <h2 className="font-heading-black" style={{ color: "#fff" }}>
        All Trade Forms
      </h2>
      <div className="admin-allchallenges-list-container">
        {/* <Input
          placeholder="Search Crypto Name"
          onChange={(e) =>
            setFilterTrades(
              allTrades.filter((mem) =>
                mem.username
                  .toUpperCase()
                  .includes(e.target.value.toUpperCase())
              )
            )
          }
        /> */}
        {loading ? (
          <div style={{ width: "100%", textAlign: "center", margin: "10px 0" }}>
            <LoadingOutlined />
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={filterTrades.sort(
              (a, b) => moment(b.updatedAt) - moment(a.updatedAt)
            )}
          />
        )}
      </div>
      <AdminEditIntentCard
        key={Math.random()}
        fetchIntents={fetchTrades}
        isModalVisible={openEditModal}
        setIsModalVisible={setOpenEditModal}
        selectedIntent={selectedTrade}
        cryptos={allCryptos}
      />
    </div>
  );
}

export default ManageIntents;
