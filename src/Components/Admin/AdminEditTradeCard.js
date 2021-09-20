import React, { useState, useEffect, useContext, isValidElement } from "react";
import {
  Modal,
  Button,
  Form,
  Input,
  Checkbox,
  DatePicker,
  Select,
  InputNumber,
} from "antd";
import {
  CloseCircleOutlined,
  LoadingOutlined,
  BellOutlined,
} from "@ant-design/icons";
import AllCryptos from "../../Data/AllCryptos.json";
import ImageUploading from "react-images-uploading";
import moment from "moment";
import {
  addComments,
  createTrade,
  updateTrade,
} from "../../Services/tradeForm";
import { userInfoContext } from "../../Contexts/UserStore";
import { subToUser, unsubToUser } from "../../Services/users";

function AdminEditTradeCard({
  isModalVisible,
  setIsModalVisible,
  fetchTrades,
  selectedTrade,
  userDashboard,
}) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [sellingPriceRequired, setSellingPriceRequired] = useState(true);
  const [comment, setComment] = useState("");
  const [allComments, setAllComments] = useState([]);
  const [buyingDate, setBuyingDate] = useState("");
  const [sellingDate, setSellingDate] = useState("");
  const [image, setImage] = useState([]);
  const [selectedCrypto, setSelectedCrypto] = useState("");
  const [selectedCryptoName, setSelectedCryptoName] = useState("");

  const [userInfo, setUserInfo] = useContext(userInfoContext);

  useEffect(() => {
    setAllComments(selectedTrade.comments);
    setSellingPriceRequired(!selectedTrade.notYetSold);
    setBuyingDate(selectedTrade.buyingDate);
    setSellingDate(selectedTrade.sellingDate);
    selectedTrade.screenshot &&
      selectedTrade.screenshot.length > 0 &&
      setImage([{ data_url: selectedTrade.screenshot }]);
    setSelectedCrypto(selectedTrade.cryptoSymbol);
    setSelectedCryptoName(selectedTrade.cryptoName);

    form.setFieldsValue({
      buyingPrice: selectedTrade.buyingPrice,
      buyingDate: moment(selectedTrade.buyingDate),
      sellingDate: moment(selectedTrade.sellingDate),
      sellingPrice: selectedTrade.sellingPrice,
      shortReason: selectedTrade.reasonForTrade,
      longReason: selectedTrade.detailedReasonForTrade,
      howMany: selectedTrade.howMany,
    });
  }, []);
  const handleOk = (values) => {};

  const handleFinish = async (values) => {
    if (userDashboard) {
      setIsModalVisible(false);
    } else {
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
            const res = await updateTrade(selectedTrade._id, v);
            setLoading(false);
            setIsModalVisible(false);
            fetchTrades();
          } else {
            alert("Please fill all required fields");
            setLoading(false);
          }
        } else {
          const res = await updateTrade(selectedTrade._id, v);
          setLoading(false);
          setIsModalVisible(false);
          fetchTrades();
        }
      } else {
        alert("Please fill all required fields");
        setLoading(false);
      }
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
    setImage(imageList);
  };

  const subscribeToUser = async (id) => {
    setLoading(true);
    const res = await subToUser(id);
    if (res.success) {
      setIsModalVisible(false);
      fetchTrades();
    }

    setLoading(false);
  };

  const unsubscribeToUser = async (id) => {
    setLoading(true);
    const res = await unsubToUser(id);
    if (res.success) {
      setIsModalVisible(false);
      fetchTrades();
    }
    setLoading(false);
  };

  const getSubscribtionButton = () => {
    if (
      userDashboard &&
      selectedTrade._user &&
      userInfo.id !== selectedTrade._user._id.toString()
    ) {
      if (selectedTrade._user.subscribers.includes(userInfo.id)) {
        return (
          <div>
            <BellOutlined style={{ marginRight: "10px" }} />
            <Button
              onClick={() => unsubscribeToUser(selectedTrade._user._id)}
              disabled={loading}
            >
              Unsubscribe to user
            </Button>
          </div>
        );
      } else {
        return (
          <Button
            onClick={() => subscribeToUser(selectedTrade._user._id)}
            disabled={loading}
          >
            Subscribe to user
          </Button>
        );
      }
    } else {
      return <div></div>;
    }
  };
  return (
    <Modal
      title={userDashboard ? "Trade Info" : `Edit Trade`}
      visible={isModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={false}
      width="60%"
      style={{ backgroundColor: "#272A3E" }}
    >
      <Form
        layout="vertical"
        form={form}
        onFinish={handleFinish}
        style={{ backgroundColor: "#272A3E" }}
      >
        <Form.Item label="Crypto Name" name="cryptoName" required="true">
          <Select
            disabled={userDashboard ? true : false}
            showSearch
            style={{ width: "100%" }}
            placeholder="Select a crypto"
            optionFilterProp="children"
            value={selectedCryptoName}
            onChange={(e) => {
              setSelectedCrypto(JSON.parse(e).Symbol);
              setSelectedCryptoName(JSON.parse(e).Name);
            }}
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {AllCryptos.Sheet2.map((c) => (
              <Select.Option
                value={JSON.stringify({ Symbol: c.Symbol, Name: c.Name })}
              >
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
          <Input
            placeholder="eg 300"
            suffix="USD"
            prefix="$"
            disabled={userDashboard ? true : false}
          />
        </Form.Item>
        <Form.Item label="Buying Date" name="buyingDate" required="true">
          <DatePicker
            onChange={onBuyingDateChange}
            style={{ width: "100%" }}
            value={buyingDate}
            disabled={userDashboard ? true : false}
          />
        </Form.Item>
        <Form.Item
          label="Selling Price"
          name="sellingPrice"
          required={sellingPriceRequired}
        >
          <Input
            placeholder="eg 350"
            suffix="USD"
            prefix="$"
            disabled={userDashboard ? true : !sellingPriceRequired}
          />
        </Form.Item>
        <Form.Item
          label="Selling Date"
          name="sellingDate"
          required={sellingPriceRequired}
        >
          <DatePicker
            onChange={onSellingDateChange}
            style={{ width: "100%" }}
            value={sellingDate}
            disabled={userDashboard ? true : !sellingPriceRequired}
          />
        </Form.Item>
        <Form.Item name="notYetSold" style={{ color: "#fff" }}>
          <Checkbox
            onChange={onCheckboxChange}
            checked={!sellingPriceRequired}
            disabled={userDashboard ? true : false}
            value={setSellingPriceRequired}
          >
            Not yet sold
          </Checkbox>
        </Form.Item>

        <Form.Item label="Reason for trade" name="shortReason" required={true}>
          <Input.TextArea
            showCount
            maxLength={240}
            disabled={userDashboard ? true : false}
          />
        </Form.Item>

        <Form.Item label="Reason for trade (detailed)" name="longReason">
          <Input.TextArea rows={5} disabled={userDashboard ? true : false} />
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
                {/* <Button
                  onClick={onImageUpload}
                  disabled={userDashboard ? true : false}
                >
                  Click to upload screenshot
                </Button> */}
                {imageList.map((image, index) => (
                  <div
                    key={index}
                    className="image-item"
                    style={{ margin: "10px 0" }}
                  >
                    <img
                      src={image["data_url"]}
                      alt=""
                      width={userDashboard ? "600px" : "100"}
                    />
                    <div className="image-item__btn-wrapper">
                      {userDashboard ? (
                        ""
                      ) : (
                        <CloseCircleOutlined
                          onClick={() => onImageRemove(index)}
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ImageUploading>
        </Form.Item>
        <div
          style={{
            marginTop: "10px",
            paddingTop: "10px",
            borderTop: "1px solid #888888",
            marginBottom: "30px",
          }}
        >
          <h3
            style={{
              margin: 0,
              padding: 0,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>User Info</span>
            {localStorage.getItem("jwtToken") && getSubscribtionButton()}
          </h3>
          <p style={{ margin: 0, padding: 0 }}>
            Username: {selectedTrade._user && selectedTrade._user.username}
          </p>
        </div>

        {loading ? (
          <LoadingOutlined />
        ) : (
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              {userDashboard ? "Close" : "Submit"}
            </Button>
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
}

export default AdminEditTradeCard;
