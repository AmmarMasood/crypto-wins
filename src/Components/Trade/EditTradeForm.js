import React, { useState, useEffect, useContext } from "react";
import { Button, Form, Input, Card } from "antd";
import { CloseCircleOutlined, LoadingOutlined } from "@ant-design/icons";

import ImageUploading from "react-images-uploading";
import moment from "moment";
import { addComments, updateTrade } from "../../Services/tradeForm";
import { userInfoContext } from "../../Contexts/UserStore";
import { subToUser, unsubToUser } from "../../Services/users";
import { Link } from "react-router-dom";
import Modal from "react-modal";
import useWindowDimensions from "../../Helpers/useWindowDimensions";

function EditTradeForm({
  isModalVisible,
  setIsModalVisible,
  fetchTrades,
  selectedTrade,
  userDashboard,
  updateCommetsInCards,
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
  const { width, height } = useWindowDimensions();
  const [userInfo, setUserInfo] = useContext(userInfoContext);

  const customStyles = {
    content: {
      top: height > 1000 ? "50%" : "45%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: width < 600 ? "100%" : "60%",
      height: height > 1000 ? "fit-content" : "80vh",
      padding: 0,
      position: "relative",
      backgroundColor: "transparent",
      overflow: "initial",
      // border:"2px solid red",
      marginTop: "20px",
    },
  };

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
  }, [selectedTrade]);
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
    updateCommetsInCards(allComments, selectedTrade._id);
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
            <Button
              onClick={() => unsubscribeToUser(selectedTrade._user._id)}
              disabled={loading}
              style={{ marginRight: "20px", float: "right" }}
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
            style={{
              marginRight: "20px",
              float: "right",
              backgroundColor: "#f78641",
              color: "#fff",
              borderColor: "#f78641",
            }}
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
      isOpen={isModalVisible}
      onRequestClose={handleCancel}
      style={customStyles}
      contentLabel="Example Modal"
    >
      <div
        className="custom-card-explainer-header-sticker"
        style={{
          backgroundColor:
            Math.sign(selectedTrade.profit) > 0 ? "#43AA8B" : "#F94144",
          top: "-30px",
          zIndex: "50",
        }}
      >
        <span>
          {Math.sign(selectedTrade.profit) > 0 ? (
            <h3>PROFIT</h3>
          ) : (
            <h3>LOSS</h3>
          )}
        </span>
        <h3 style={{ fontFamily: "Lato, sans-serif" }}>
          ${parseFloat(selectedTrade.profit).toLocaleString()}
        </h3>
        <h3 style={{ fontFamily: "Lato, sans-serif" }}>
          {selectedTrade.percentageGain}%
        </h3>
      </div>
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
          height: !localStorage.getItem("jwtToken") && "100%",
          background: "#272A3E",
          color: "#fff",

          // border:"2px solid red"
        }}
      >
        <div
          style={{
            overflowY: "scroll",
            height: height > 1000 ? "fit-content" : "90vh",
            paddingTop: "50px",
            background: "#272A3E",
          }}
        >
          <div className="custom-card-explainer-header">
            {/* <h3
          style={{
          border:"2px solid red"
          }}
        >
          <span>
            {" "}
            Trade by @ {selectedTrade._user && selectedTrade._user.username}
          </span>
          {localStorage.getItem("jwtToken") && getSubscribtionButton()}
        </h3> */}
          </div>
          <div
            className="custom-card-explaier-cryptoname"
            style={{
              textAlign: "center",
              float: "none",
              marginTop: width < 600 ? "5px" : "-40px",
            }}
          >
            <h3 style={{ margin: 0, padding: 0 }}>{selectedCryptoName}</h3>
          </div>
          <div className="custom-card-explainer-body">
            <Form
              layout="vertical"
              form={form}
              onFinish={handleFinish}
              style={{ color: "#fff" }}
            >
              {/* <Form.Item label="Crypto" name="crypto" required="true"> */}

              {/* <Select
            disabled={userDashboard ? true : false}
            showSearch
            style={{ width: "100%" }}
            placeholder="Select a person"
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
          </Select> */}
              {/* </Form.Item> */}
              {/* <Form.Item label="Buying Price" name="buyingPrice" required="true"> */}
              <div style={{ margin: "20px 10px" }}>
                <span
                  style={{
                    fontWeight: "400",
                    fontSize: "16px",
                    marginRight: "10px",
                    backgroundColor: "#CB52E3",
                    padding: "10px",
                    borderRadius: "20px",
                  }}
                >
                  BUY:{" "}
                </span>
                <span
                  style={{
                    color: "#fff",
                    fontSize: "16px",
                    fontWeight: "600",
                    fontFamily: "Lato, sans-serif",
                  }}
                >
                  $
                  {parseFloat(
                    form.getFieldValue("buyingPrice")
                  ).toLocaleString()}{" "}
                  on {moment(buyingDate).format("DD MMM YYYY")}
                </span>
              </div>

              <div style={{ margin: "20px 10px" }}>
                <span
                  style={{
                    fontWeight: "400",
                    fontSize: "16px",
                    marginRight: "10px",
                    backgroundColor: "#CB52E3",
                    padding: "10px",
                    borderRadius: "20px",
                  }}
                >
                  SELL
                </span>
                {sellingPriceRequired && (
                  <span
                    style={{
                      color: "#fff",
                      fontSize: "16px",
                      fontWeight: "600",
                      fontFamily: "Lato, sans-serif",
                    }}
                  >
                    $
                    {parseFloat(
                      form.getFieldValue("sellingPrice")
                    ).toLocaleString()}{" "}
                    on {moment(sellingDate).format("DD MMM YYYY")}
                  </span>
                )}
                {!sellingPriceRequired && (
                  <span
                    style={{
                      color: "#fff",
                      fontSize: "16px",
                      fontWeight: "600",
                    }}
                  >
                    Not yet sold, Latest price : $
                    <span style={{ fontFamily: "Lato, sans-serif" }}>
                      {selectedTrade.outData
                        ? selectedTrade.outData.toFixed(2)
                        : ""}
                    </span>
                  </span>
                )}
              </div>

              <div style={{ margin: "20px 10px" }}>
                <span
                  style={{
                    fontWeight: "400",
                    fontSize: "16px",
                    marginRight: "10px",
                    backgroundColor: "#CB52E3",
                    padding: "10px",
                    borderRadius: "20px",
                  }}
                >
                  QTY
                </span>
                <span
                  style={{
                    color: "#fff",
                    fontSize: "16px",
                    fontWeight: "600",
                    fontFamily: "Lato, sans-serif",
                  }}
                >
                  {form.getFieldValue("howMany")}
                </span>
              </div>

              <div style={{ margin: "20px 10px" }}>
                <span
                  style={{
                    fontWeight: "400",
                    fontSize: "16px",
                    marginRight: "10px",
                    backgroundColor: "#CB52E3",
                    padding: "10px",
                    borderRadius: "20px",
                  }}
                >
                  Annualized Yield{" "}
                </span>
                <span
                  style={{
                    color: "#fff",
                    fontSize: "16px",
                    fontWeight: "600",
                    fontFamily: "Lato, sans-serif",
                  }}
                >
                  {" "}
                  {selectedTrade.annualYield}%
                </span>
              </div>

              {/* <Input
            placeholder="eg 300"
            suffix="USD"
            prefix="$"
            disabled={userDashboard ? true : false}
          /> */}
              {/* </Form.Item> */}
              {/* <Form.Item label="Buying Date" name="buyingDate" required="true"> */}

              {/* <DatePicker
            onChange={onBuyingDateChange}
            style={{ width: "100%" }}
            value={buyingDate}
            disabled={userDashboard ? true : false}
          />
        </Form.Item> */}
              {/* <Form.Item
          label="Selling Price"
          name="sellingPrice"
          required={sellingPriceRequired}
        > */}

              {/* <Input
            placeholder="eg 350"
            suffix="USD"
            prefix="$"
            disabled={}
          />
        </Form.Item> */}
              {/* <Form.Item
          label="Selling Date"
          name="sellingDate"
          required={sellingPriceRequired}
        > */}
              {/* {sellingPriceRequired && (
          <div style={{ margin: "20px 10px" }}>
            <span
              style={{
                fontWeight: "400",
                fontSize: "16px",
                marginRight: "10px",
                backgroundColor:"#CB52E3",
                padding:"10px",
                borderRadius:"20px"
              }}
            >
              Selling Date:{" "}
            </span>
            <span></span>
          </div>
        )} */}
              {/* <DatePicker
            onChange={onSellingDateChange}
            style={{ width: "100%" }}
            value={sellingDate}
            disabled={userDashboard ? true : !sellingPriceRequired}
          />
        </Form.Item> */}

              {/* <Form.Item name="notYetSold">
          <Checkbox
            onChange={onCheckboxChange}
            checked={!sellingPriceRequired}
            disabled={userDashboard ? true : false}
            // value={setSellingPriceRequired}
          >
            Not yet sold
          </Checkbox>
        </Form.Item> */}
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  margin: "20px 10px",
                  paddingTop: "30px",
                  borderTop:
                    Math.sign(selectedTrade.profit) > 0
                      ? "5px solid #43AA8B"
                      : "5px solid #F94144",
                }}
              >
                <span
                  style={{
                    fontWeight: "400",
                    fontSize: "16px",
                    marginRight: "10px",
                    backgroundColor: "#CB52E3",
                    padding: "10px",
                    borderRadius: "20px",
                    flex: "none",
                  }}
                >
                  Reason for trade:{" "}
                </span>
                <span
                  style={{
                    color: "#fff",
                    fontSize: "16px",
                    fontWeight: "600",
                    marginTop: "5px",
                    width: "100%",
                    wordBreak: "break-all",
                  }}
                >
                  {form.getFieldValue("longReason")
                    ? form.getFieldValue("longReason")
                    : form.getFieldValue("shortReason")}
                </span>
              </div>
              {/* <Form.Item label="Reason for trade" name="shortReason" required={true}>
          <Input.TextArea
            showCount
            maxLength={240}
            disabled={userDashboard ? true : false}
          />
        </Form.Item> */}
              {/* {form.getFieldValue("longReason") && (
          <div style={{ margin: "10px 0" }}>
            <span
              style={{
                fontWeight: "400",
                fontSize: "16px",
                marginRight: "10px",
              }}
            >
              Detailed reason for trade:{" "}
            </span>
            <span>{form.getFieldValue("longReason")}</span>
          </div>
        )} */}
              {/* <Form.Item label="Reason for trade (detailed)" name="longReason">
          <Input.TextArea rows={5} disabled={userDashboard ? true : false} />
        </Form.Item> */}
              {/* <Form.Item label="Upload Screenshot"> */}
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  margin: "20px 10px",
                }}
              >
                <span
                  style={{
                    fontWeight: "400",
                    fontSize: "16px",
                    marginRight: "50px",
                    backgroundColor: "#CB52E3",
                    padding: "10px",
                    borderRadius: "20px",
                    flex: "none",
                  }}
                >
                  Screenshot
                </span>
                <ImageUploading
                  multiple={false}
                  value={image}
                  onChange={onChange}
                  maxNumber={1}
                  dataURLKey="data_url"
                >
                  {({ imageList, onImageUpload, onImageRemove }) =>
                    // write your building UI
                    imageList.length > 0 ? (
                      <div className="upload__image-wrapper">
                        {imageList.map((image, index) => (
                          <div
                            key={index}
                            className="image-item"
                            style={{ margin: "10px 0" }}
                          >
                            <img
                              src={image["data_url"]}
                              alt=""
                              width={width > 600 ? "600px" : "300px"}
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
                    ) : (
                      <span
                        style={{
                          color: "#fff",
                          fontWeight: "600",
                          marginLeft: "-20px",
                          marginTop: "10px",
                        }}
                      >
                        No screenshot
                      </span>
                    )
                  }
                </ImageUploading>
              </div>

              {/* </Form.Item> */}
              {/* <div
          style={{
            marginTop: "10px",
            paddingTop: "10px",
            borderTop: "1px solid #888888",
            marginBottom: "30px",
          }}
        >

          
        </div> */}
              <div
                style={{
                  marginTop: "10px",
                  padding: "10px",
                  borderTop:
                    Math.sign(selectedTrade.profit) > 0
                      ? "5px solid #43AA8B"
                      : "5px solid #F94144",
                  marginBottom: "30px",
                }}
              >
                <h3
                  style={{
                    fontWeight: "400",
                    fontSize: "16px",
                    marginRight: "50px",
                    backgroundColor: "#CB52E3",
                    padding: "10px",
                    borderRadius: "20px",
                    flex: "none",
                    color: "#fff",
                    display: "inline-block",
                  }}
                >
                  Comments
                </h3>
                <div>
                  {" "}
                  {allComments &&
                    allComments.map((c) => (
                      <div style={{ margin: "5px 0" }}>
                        <span
                          style={{
                            fontWeight: "500",
                            marginRight: "10px",
                            color: "#f5864a",
                            fontSize: "18px",
                          }}
                        >
                          {c.user.username}
                        </span>
                        <span style={{ fontSize: "18px" }}>{c.text}</span>
                        <div style={{ fontSize: "10px" }}>
                          {moment(c.date).format("DD MMM YYYY, h:mm:ss a")}
                        </div>
                      </div>
                    ))}
                </div>
                {localStorage.getItem("jwtToken") ? (
                  <>
                    <Input.TextArea
                      style={{ marginBottom: "5px" }}
                      placeholder="Enter comment"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows="5"
                    />
                    <Button
                      style={{
                        backgroundColor: "#f78641",
                        borderColor: "#f78641",
                        color: "#fff",
                      }}
                      disabled={loading}
                      onClick={async () => {
                        if (comment.length > 0) {
                          setLoading(true);
                          const res = await addComments(
                            { text: comment, date: new Date() },
                            selectedTrade._id
                          );
                          if (res.success) {
                            setComment("");
                            setAllComments(res.res);
                          }
                          setLoading(false);
                          // fetchTrades();
                        }
                      }}
                    >
                      Submit
                    </Button>
                  </>
                ) : (
                  <div style={{ paddingTop: "20px" }}>
                    <Link to="/login" style={{ color: "#fff" }}>
                      Please login to comment.
                    </Link>
                  </div>
                )}
              </div>

              {loading ? (
                <LoadingOutlined />
              ) : (
                <Form.Item style={{ textAlign: "right" }}>
                  {/* <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              {userDashboard ? "Close" : "Submit"}
            </Button> */}
                </Form.Item>
              )}
              {localStorage.getItem("jwtToken") && getSubscribtionButton()}
            </Form>
          </div>
        </div>
      </Card>
    </Modal>
  );
}

export default EditTradeForm;
