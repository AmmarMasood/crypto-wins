import React, { useState, useEffect, useContext } from "react";
import {
  Button,
  Form,
  Input,
  Checkbox,
  DatePicker,
  Select,
  InputNumber,
  Card,
} from "antd";
import { CloseCircleOutlined, LoadingOutlined } from "@ant-design/icons";

import ImageUploading from "react-images-uploading";
import { createTrade } from "../../Services/tradeForm";
import { getAllName, updateUnsoldCrypto } from "../../Services/cryptoNames";
import { allNonSoldCoinPricesContext } from "../../Contexts/UserStore";
import Modal from "react-modal";
import useWindowDimensions from "../../Helpers/useWindowDimensions";

function TradeForm({ isModalVisible, setIsModalVisible, fetchTrades }) {
  const [form] = Form.useForm();
  const [allUnsoldPrices, setAllUnsoldPrices] = useContext(
    allNonSoldCoinPricesContext
  );
  const [loading, setLoading] = useState(false);
  const [sellingPriceRequired, setSellingPriceRequired] = useState(true);
  const [buyingDate, setBuyingDate] = useState("");
  const [sellingDate, setSellingDate] = useState("");
  const [image, setImage] = useState([]);
  const [selectedCrypto, setSelectedCrypto] = useState("");
  const [selectedCryptoName, setSelectedCryptoName] = useState("");
  const [AllCryptos, setAllCryptos] = useState([]);
  const [filteredAllCryptos, setFilteredAllCryptos] = useState([]);
  const { width, height } = useWindowDimensions();

  useEffect(async () => {
    const res = await getAllName();

    if (res.success) {
      setAllCryptos(res.res.cryptos);
      setFilteredAllCryptos(res.res.cryptos);
    }
  }, []);
  const handleOk = (values) => {};

  const handleFinish = async (values) => {
    setLoading(true);
    const v = {
      cryptoName: selectedCryptoName,
      cryptoSymbol: selectedCrypto,
      buyingPrice: values.buyingPrice,
      howMany: values.howMany,
      buyingDate: buyingDate ? buyingDate._d : "",
      sellingDate: sellingPriceRequired
        ? sellingDate
          ? sellingDate._d
          : ""
        : "",
      sellingPrice: sellingPriceRequired ? values.sellingPrice : "",
      notYetSold: !sellingPriceRequired,
      reasonForTrade: values.shortReason,
      detailedReasonForTrade: values.longReason,
      screenshot: image[0] ? image[0].data_url : "",
    };

    if (
      selectedCryptoName &&
      selectedCrypto &&
      values.buyingPrice &&
      values.buyingDate &&
      values.shortReason
    ) {
      if (sellingPriceRequired) {
        if (values.sellingPrice && values.sellingDate) {
          const res = await createTrade(v);
          setLoading(false);
          setSellingPriceRequired(true);
          setBuyingDate("");
          setSellingDate("");
          setImage([]);
          setSelectedCrypto("");
          setSelectedCryptoName("");
          form.resetFields();
          setIsModalVisible(false);
          updateUnsoldCrypto(allUnsoldPrices, setAllUnsoldPrices);

          fetchTrades();
        } else {
          alert("Please fill all required fields");
          setLoading(false);
        }
      } else {
        const res = await createTrade(v);
        setLoading(false);
        form.resetFields();
        fetchTrades();
        setSellingPriceRequired(true);
        setBuyingDate("");
        setSellingDate("");
        setImage([]);
        setSelectedCrypto("");
        setSelectedCryptoName("");

        setIsModalVisible(false);
        updateUnsoldCrypto(allUnsoldPrices, setAllUnsoldPrices);
      }
    } else {
      alert("Please fill all required fields");
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const onCheckboxChange = (e) => {
    if (e.target.checked) {
      setSellingPriceRequired(false);
    } else {
      setSellingPriceRequired(true);
    }
  };

  const onBuyingDateChange = (date, dateString) => {
    setBuyingDate(date);
  };

  const onSellingDateChange = (date, dateString) => {
    setSellingDate(date);
  };

  const onChange = (imageList, addUpdateIndex) => {
    // data for submit
    setImage(imageList);
  };

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: width < 600 ? "100%" : "60%",
      height: height > 1000 ? "fit-content" : "70vh",
      padding: 0,
      position: "relative",
      backgroundColor: "#272A3E",
    },
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
      <Card
        style={{
          marginBottom: "0",
          backgroundColor: "#272A3E",
          padding: "20px",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <h1 style={{ color: "#fff" }}>Create Trade</h1>
        </div>
        <div>
          <Form
            layout="vertical"
            form={form}
            onFinish={handleFinish}
            style={{ color: "#fff !important" }}
          >
            <Form.Item
              label="Crypto"
              name="crypto"
              required="true"
              style={{ color: "#fff !important" }}
            >
              <Select
                showSearch
                style={{ width: "100%" }}
                onSearch={(e) => {
                  const f = AllCryptos.filter(
                    (g) =>
                      g.Name.toLowerCase().includes(e.toLowerCase()) ||
                      g.Symbol.toLowerCase().includes(e.toLowerCase())
                  );

                  setFilteredAllCryptos(f);
                }}
                placeholder="Select a crypto"
                optionFilterProp="children"
                onChange={(e) => {
                  setSelectedCrypto(JSON.parse(e).Symbol);
                  setSelectedCryptoName(JSON.parse(e).Name);
                }}
                filterOption={false}
              >
                {filteredAllCryptos.map((c) => (
                  <Select.Option value={JSON.stringify(c)}>
                    {c.Name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="How Many" name="howMany" required="true">
              <InputNumber
                min={0}
                max={Number.MAX_VALUE}
                style={{ width: "100%" }}
              />
            </Form.Item>
            <Form.Item label="Buying Price" name="buyingPrice" required="true">
              <Input placeholder="eg 300" suffix="USD" prefix="$" />
            </Form.Item>
            <Form.Item label="Buying Date" name="buyingDate" required="true">
              <DatePicker
                onChange={onBuyingDateChange}
                style={{ width: "100%" }}
                value={buyingDate}
              />
            </Form.Item>
            <div
              style={{
                display: "grid",
                alignItems: "center",
                gridTemplateColumns: width < 650 ? "1fr" : "0.8fr 0.2fr",
                gridTemplateRows: width < 650 ? "1fr 1fr" : "1fr",
              }}
            >
              <Form.Item
                label="Selling Price"
                name="sellingPrice"
                required={sellingPriceRequired}
              >
                <Input
                  style={{ width: "100%" }}
                  placeholder="eg 350"
                  suffix="USD"
                  prefix="$"
                  disabled={!sellingPriceRequired}
                />
              </Form.Item>
              <Form.Item name="notYetSold">
                <Checkbox
                  style={{
                    marginTop: "30px",
                    marginLeft: "15px",
                    color: "#fff",
                  }}
                  onChange={onCheckboxChange}
                  checked={!sellingPriceRequired}
                >
                  Not yet sold
                </Checkbox>
              </Form.Item>
            </div>

            <Form.Item
              label="Selling Date"
              name="sellingDate"
              required={sellingPriceRequired}
            >
              <DatePicker
                onChange={onSellingDateChange}
                style={{ width: "100%" }}
                value={sellingDate}
                disabled={!sellingPriceRequired}
              />
            </Form.Item>

            <Form.Item
              label="Reason for trade"
              name="shortReason"
              required={true}
            >
              <Input.TextArea showCount maxLength={240} />
            </Form.Item>
            <Form.Item label="Reason for trade (detailed)" name="longReason">
              <Input.TextArea rows={5} />
            </Form.Item>
            <Form.Item label="Upload Screenshot">
              <ImageUploading
                multiple={false}
                value={image}
                onChange={onChange}
                maxNumber={1}
                dataURLKey="data_url"
              >
                {({ imageList, onImageUpload, onImageRemove }) => (
                  // write your building UI
                  <div className="upload__image-wrapper">
                    <Button onClick={onImageUpload}>
                      Click to upload screenshot
                    </Button>
                    {imageList.map((image, index) => (
                      <div
                        key={index}
                        className="image-item"
                        style={{ margin: "10px 0" }}
                      >
                        <img src={image["data_url"]} alt="" width="100" />
                        <div className="image-item__btn-wrapper">
                          <CloseCircleOutlined
                            onClick={() => onImageRemove(index)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ImageUploading>
            </Form.Item>
            {loading ? (
              <LoadingOutlined />
            ) : (
              <Form.Item style={{ textAlign: "right" }}>
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
        </div>
      </Card>
    </Modal>
  );
}

export default TradeForm;
