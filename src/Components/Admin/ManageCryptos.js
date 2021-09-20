import React, { useState, useEffect } from "react";
import { Button, Table, Space, Input, Modal } from "antd";
import moment from "moment";
import { deleteUser, getAllUsers } from "../../Services/users";
import { LoadingOutlined } from "@ant-design/icons";
import {
  createCrypto,
  deleteCrypto,
  getAllName,
} from "../../Services/cryptoNames";

function ManageCryptos() {
  const [filterC, setFilterC] = useState([]);
  const [allC, setAllC] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addNameModalOpen, setAddNameModalOpen] = useState(false);
  const [newCryptoName, setNewCryptoName] = useState("");
  const [newCryptoSymbol, setNewCryptoSymbol] = useState("");

  useEffect(() => {
    fetchCryptos();
  }, []);

  const onclose = () => {
    setAddNameModalOpen(false);
  };
  const fetchCryptos = async () => {
    setLoading(true);
    const data = await getAllName();
    if (data.success) {
      data.res.cryptos.reverse();
      setAllC(data.res.cryptos);
      setFilterC(data.res.cryptos);
    }
    setLoading(false);
  };

  const createNewCrypto = async () => {
    if (newCryptoName.length > 0 && newCryptoSymbol.length > 0) {
      setLoading(true);
      const res = await createCrypto({
        Name: newCryptoName,
        Symbol: newCryptoSymbol,
      });
      if (res.success) {
        fetchCryptos();
        setAddNameModalOpen(false);
        setNewCryptoName("");
        setNewCryptoSymbol("");
      }
      setLoading(false);
    }
  };
  const deleteNCrypto = async (id) => {
    const data = await deleteCrypto(id);
    if (data.success) {
      fetchCryptos();
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
      title: "Name",
      dataIndex: "Name",
      key: "Name",
      render: (text) => <span className="font-paragraph-black">{text}</span>,
    },
    {
      title: "Symbol",
      dataIndex: "Symbol",
      key: "Symbol",
      render: (text) => <span className="font-paragraph-black">{text}</span>,
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
          <Button type="danger" onClick={() => deleteNCrypto(text._id)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];
  return (
    <div style={{ margin: "0 50px" }}>
      <Modal footer={false} onCancel={onclose} visible={addNameModalOpen}>
        <p style={{ margin: "10px 0 10px 0", color: "#fff" }}>Crypto Name</p>
        <Input
          onChange={(e) => setNewCryptoName(e.target.value)}
          required
          value={newCryptoName}
        />
        <p style={{ margin: "30px 0 10px 0" }}>Crypto Symbol</p>
        <Input
          onChange={(e) => setNewCryptoSymbol(e.target.value)}
          required
          value={newCryptoSymbol}
        />
        <Button
          style={{ margin: "10px 0 10px 0" }}
          onClick={createNewCrypto}
          disabled={loading}
        >
          Create
        </Button>
      </Modal>
      <h2 className="font-heading-black" style={{ color: "#fff" }}>
        All Cryptos
      </h2>
      <Button
        type="primary"
        style={{
          float: "right",
          marginBottom: "10px",
          backgroundColor: "#f78641",
          borderColor: "#f78641",
          color: "#fff",
        }}
        onClick={() => setAddNameModalOpen(true)}
      >
        Add
      </Button>
      <div className="admin-allchallenges-list-container">
        <Input
          placeholder="Search Crypto Name"
          onChange={(e) =>
            setFilterC(
              allC.filter((mem) =>
                mem.Name.toUpperCase().includes(e.target.value.toUpperCase())
              )
            )
          }
        />
        {loading ? (
          <div style={{ width: "100%", textAlign: "center", margin: "10px 0" }}>
            <LoadingOutlined />
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={filterC.sort(
              (a, b) => moment(b.updatedAt) - moment(a.updatedAt)
            )}
          />
        )}
      </div>
    </div>
  );
}

export default ManageCryptos;
