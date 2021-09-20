import React, { useState, useEffect } from "react";
import { Button, Form, Input, Select } from "antd";
import { LoadingOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { createIntent } from "../../Services/buyingIntent";
import { getAllName } from "../../Services/cryptoNames";
import Card from "../../Components/MaterialUI/Card/Card.js";
import CardHeader from "../../Components/MaterialUI/Card/CardHeader.js";
import CardBody from "../../Components/MaterialUI/Card/CardBody.js";
import Modal from "react-modal";
import useWindowDimensions from "../../Helpers/useWindowDimensions";

function BuyingIntentForm({ isModalVisible, setIsModalVisible, fetchIntents }) {
  const [form] = Form.useForm();
  const [type, setType] = useState("buy");
  const [selectedCryptoName, setSelectedCryptoName] = useState("");
  const [selectedCryptoPrice, setSelectedCryptoPrice] = useState("");
  const [sellingCryptoName, setSellingCryptoName] = useState("");
  const [sellingCryptoPrice, setSellingCryptoPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [filteredAllCryptos, setFilteredAllCryptos] = useState([]);
  const [AllCryptos, setAllCryptos] = useState([]);
  const { width, height } = useWindowDimensions();

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: width < 600 ? "100%" : "60%",
      height: height > 700 ? "fit-content" : "90vh",
      padding: 0,
      position: "relative",
      backgroundColor: "#272A3E",
    },
  };

  useEffect(async () => {
    const res = await getAllName();
    if (res.success) {
      setAllCryptos(res.res.cryptos);
      setFilteredAllCryptos(res.res.cryptos);
    }
  }, []);

  const handleOk = (values) => {
    setIsModalVisible(false);
  };

  const handleFinish = async (values) => {
    setLoading(true);
    const v = {
      reason: values.reason,
      buyingCryptoName: selectedCryptoName,
      buyingPrice: selectedCryptoPrice,
      sellingCryptoName: sellingCryptoName,
      sellingPrice: sellingCryptoPrice,
    };
    const res = await createIntent(v);
    setType("buy");
    setSelectedCryptoName("");
    setSelectedCryptoPrice("");
    setSellingCryptoName("");
    setSellingCryptoPrice("");
    form.resetFields();
    fetchIntents();
    setLoading(false);
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <Modal
      isOpen={isModalVisible}
      onRequestClose={handleCancel}
      style={customStyles}
      contentLabel="Example Modal"
    >
      <CloseCircleOutlined
        onClick={handleCancel}
        style={{
          position: "absolute",
          fontSize: "30px",
          right: "10px",
          zIndex: "10000000",
          background: "#f5864a",
          borderRadius: "20px",
        }}
      />
      <Card style={{ marginBottom: "0", backgroundColor: "#272A3E" }}>
        <CardHeader color="primary">Create Buying Intent</CardHeader>
        <CardBody>
          <Form layout="vertical" form={form} onFinish={handleFinish}>
            <Form.Item label="Select intent type" name="type">
              <Select
                style={{ width: "100%" }}
                placeholder="Buy or Sell"
                onChange={(e) => {
                  if (e === "buy") {
                    setSellingCryptoName("");
                    setSellingCryptoPrice("");
                  }

                  if (e === "sell") {
                    setSelectedCryptoName("");
                    setSelectedCryptoPrice("");
                  }
                  // setSelectedCrypto(JSON.parse(e).Symbol);
                  setType(e);
                }}
              >
                <Select.Option value={"buy"}>Buy Intent</Select.Option>
                <Select.Option value={"sell"}>Sell Intent</Select.Option>
              </Select>
            </Form.Item>
            {type === "buy" && (
              <>
                <Form.Item label="Buying Crypto Name" name="crypto">
                  <Select
                    showSearch
                    onSearch={(e) => {
                      const f = AllCryptos.filter(
                        (g) =>
                          g.Name.toLowerCase().includes(e.toLowerCase()) ||
                          g.Symbol.toLowerCase().includes(e.toLowerCase())
                      );

                      setFilteredAllCryptos(f);
                    }}
                    style={{ width: "100%" }}
                    placeholder="Select a crypto"
                    optionFilterProp="children"
                    onChange={(e) => {
                      setSelectedCryptoName(e);
                    }}
                    filterOption={false}
                  >
                    {filteredAllCryptos.map((c) => (
                      <Select.Option value={c.Name}>{c.Name}</Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item label="Buying Price" name="buyingPrice">
                  <Input
                    placeholder="eg 300"
                    suffix="USD"
                    prefix="$"
                    value={selectedCryptoPrice}
                    onChange={(e) => setSelectedCryptoPrice(e.target.value)}
                  />
                </Form.Item>
              </>
            )}

            {type === "sell" && (
              <>
                <Form.Item label="Selling Crypto Name" name="sellingCrypto">
                  <Select
                    showSearch
                    style={{ width: "100%" }}
                    placeholder="Select a crypto"
                    optionFilterProp="children"
                    onSearch={(e) => {
                      const f = AllCryptos.filter(
                        (g) =>
                          g.Name.toLowerCase().includes(e.toLowerCase()) ||
                          g.Symbol.toLowerCase().includes(e.toLowerCase())
                      );

                      setFilteredAllCryptos(f);
                    }}
                    onChange={(e) => {
                      setSellingCryptoName(e);
                    }}
                    filterOption={false}
                  >
                    {filteredAllCryptos.map((c) => (
                      <Select.Option value={c.Name}>{c.Name}</Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item label="Selling Price" name="sellingPrice">
                  <Input
                    placeholder="eg 350"
                    suffix="USD"
                    prefix="$"
                    value={sellingCryptoPrice}
                    onChange={(e) => setSellingCryptoPrice(e.target.value)}
                  />
                </Form.Item>
              </>
            )}
            <Form.Item label="Reason" name="reason" required={true}>
              <Input.TextArea showCount maxLength={240} />
            </Form.Item>
            {loading ? (
              <LoadingOutlined />
            ) : (
              <Form.Item style={{ textAlign: "right", marginTop: "50px" }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="login-form-button"
                  style={{ backgroundColor: "#f78641", borderColor: "#f78641" }}
                >
                  Submit
                </Button>
              </Form.Item>
            )}
          </Form>
        </CardBody>
      </Card>
    </Modal>
  );
}

export default BuyingIntentForm;
