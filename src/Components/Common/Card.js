import React, { useEffect, useState, useRef } from "react";
import "./card.css";
import moment from "moment";
import { TwitterIcon, TwitterShareButton } from "react-share";
import { CameraOutlined, CommentOutlined } from "@ant-design/icons";
import { Card as AntdCard, Button } from "antd";

import { ReactComponent as Bell } from "../../Assets/bell.svg";
import useWindowDimensions from "../../Helpers/useWindowDimensions";

function Card({
  data,
  onClick,
  filterType,
  userInfo,
  fetchTrades,
  subscribeToUser,
  unsubscribeToUser,
}) {
  const [loading, setLoading] = useState(false);
  const [sellingPrice, setSellingPrice] = useState("");
  const [profit, setProfit] = useState(0);
  const [annualYield, setAnnualYield] = useState(0);
  const [percentageGain, setPercentageGain] = useState(0);
  const [outData, setOutData] = useState("");
  const { width } = useWindowDimensions();

  useEffect(() => {
    if (data.notYetSold) {
      getCurrentPriceForTrade();
    } else {
      setSellingPrice(data.sellingPrice);
      setPercentageGain(data.percentageGain);
      setProfit(data.profit);
      setAnnualYield(data.annualYield);
      // hideUnwatedCards();
    }
  }, [filterType, profit]);

  async function getCurrentPriceForTrade() {
    setLoading(true);

    setOutData(data.sellingPrice);
    setSellingPrice(data.sellingPrice);
    setProfit(data.profit);
    setPercentageGain(data.percentageGain);

    setAnnualYield(data.annualYield);

    setLoading(false);
    // hideUnwatedCards();
  }

  const getSubscribtionButton = () => {
    if (data._user && userInfo.id !== data._user._id.toString()) {
      if (data._user.subscribers.includes(userInfo.id)) {
        return (
          <div>
            <Bell
              className="card-icon-style"
              fill="#CB52E3"
              style={{
                marginLeft: "8px",
                height: "25px",
                width: "25px",
                cursor: "pointer",
              }}
              onClick={() => unsubscribeToUser(data._user._id)}
            />
          </div>
        );
      } else {
        return (
          <div>
            <Bell
              className="card-icon-style"
              fill="#fff"
              style={{
                marginLeft: "8px",
                height: "25px",
                width: "25px",
                cursor: "pointer",
              }}
              onClick={() => subscribeToUser(data._user._id)}
            />
          </div>
        );
      }
    } else {
      // return  <BellTwoTone className="card-icon-style" twoToneColor="#fff" style={{marginLeft:"8px"}} onClick={() => subscribeToUser(data._user._id)}/>;
    }
  };

  const getTitleStringForTwitter = () => {
    if (data.notYetSold) {
      if (Math.sign(profit) > 0) {
        return `
Gaining $${parseFloat(profit).toLocaleString()} on ${data.cryptoName}. 
Bought at $${parseFloat(data.buyingPrice).toLocaleString()} on ${moment(
          data.buyingDate
        ).format("DD MMM YYYY")}.
See what other are trading and why at 
  `;
      }
      if (Math.sign(profit) < 0) {
        return `Losing $${parseFloat(profit).toLocaleString()} on ${
          data.cryptoName
        }. 
Bought at $${parseFloat(data.buyingPrice).toLocaleString()} on ${moment(
          data.buyingDate
        ).format("DD MMM YYYY")}.
See what other are trading and why at
        `;
      }
    } else {
      if (Math.sign(profit) > 0) {
        return `Made $${profit} on ${data.cryptoName}. 
Bought at $${parseFloat(data.buyingPrice).toLocaleString()} on ${moment(
          data.buyingDate
        ).format("DD MMM YYYY")}.
Sold at $${parseFloat(data.sellingPrice).toLocaleString()} on ${moment(
          data.sellingDate
        ).format("DD MMM YYYY")}.
See what other are trading and why at 
  `;
      }
      if (Math.sign(profit) < 0) {
        return `Loss -$${Math.abs(profit)} on ${data.cryptoName}. 
Bought at $${parseFloat(data.buyingPrice).toLocaleString()} on ${moment(
          data.buyingDate
        ).format("DD MMM YYYY")}.
Sold at $${parseFloat(data.sellingPrice).toLocaleString()} on ${moment(
          data.sellingDate
        ).format("DD MMM YYYY")}.
See what other are trading and why at 
        `;
      }
    }
  };
  return (
    <AntdCard
      className="custom-card-style"
      loading={loading}
      style={{ marginBottom: width < 500 ? "40px" : "20px" }}
      // onClick={() => onClick(data)}
    >
      <div>
        <div className="custom-card-header">
          <div className="custom-card-style-r1">
            <h3 style={{ padding: "10px" }}>{data.cryptoName}</h3>
          </div>
          <div
            className="card-top-box"
            style={{
              backgroundColor: Math.sign(profit) > 0 ? "#43AA8B" : "#F94144",
            }}
          >
            {Math.sign(profit) > 0 ? (
              <span
                style={{
                  fontSize: "18px",
                }}
              >
                PROFIT
              </span>
            ) : (
              <span
                style={{
                  fontSize: "18px",
                }}
              >
                LOSS
              </span>
            )}
            <div className="border-bottom"></div>
            <h3 style={{ fontFamily: "Lato, sans-serif" }}>
              {percentageGain}%
            </h3>
            <h3 style={{ fontFamily: "Lato, sans-serif" }}>
              ${parseFloat(profit).toLocaleString()}
            </h3>
          </div>
        </div>
        <div>
          <div
            className="custom-card-body"
            onClick={() =>
              onClick({
                data: data,
                extra: {
                  profit,
                  annualYield,
                  percentageGain,
                  outData,
                },
              })
            }
          >
            <div>
              <p>
                <span className="purple-backs">Bought</span>
                <span style={{ fontFamily: "Lato, sans-serif" }}>
                  ${data && parseFloat(data.buyingPrice).toLocaleString()}
                </span>
                {/*    on{" "} {moment(data && data.buyingDate).format("DD MMM YYYY")} */}
              </p>
              {!data.notYetSold ? (
                <p>
                  <span className="purple-backs">Sold</span>
                  <span>
                    ${data && parseFloat(data.sellingPrice).toLocaleString()}
                  </span>
                  {/* on{" "} {moment(data && data.sellingDate).format("DD MMM YYYY")} */}
                </p>
              ) : (
                <p>
                  <span className="purple-backs">SELL</span>
                  <span>
                    Not yet sold <br /> Latest :{" "}
                    <span style={{ fontFamily: "Lato, sans-serif" }}>
                      ${outData && outData.toFixed(2)}
                    </span>
                  </span>
                </p>
              )}

              {/* <p>Annualized Yield: {annualYield}%</p> */}
            </div>
            <p>{data && data.reasonForTrade}</p>
          </div>
        </div>
        <div
          className="custom-card-footer"
          style={{
            borderTop:
              Math.sign(profit) > 0 ? "5px solid #43AA8B" : "5px solid #F94144",
            cursor: "initial",
          }}
        >
          {/* camera */}
          <div>
            {data.screenshot ? (
              <CameraOutlined
                className="card-icon-style"
                style={{ marginRight: "10px" }}
              />
            ) : (
              <span></span>
            )}
            {data.comments && data.comments.length > 0 && (
              <>
                {" "}
                <CommentOutlined className="card-icon-style" />{" "}
                <span
                  style={{
                    color: "#fff",
                    fontSize: "16px",
                    marginLeft: "8px",
                    fontFamily: "Lato, sans-serif",
                  }}
                >
                  {data.comments.length}
                </span>{" "}
              </>
            )}
          </div>
          {localStorage.getItem("jwtToken") ? (
            <TwitterShareButton
              url={"https//cryptowins.co"}
              title={getTitleStringForTwitter()}
            >
              <TwitterIcon size={32} round={true} />
            </TwitterShareButton>
          ) : (
            <span></span>
          )}

          <div>
            <p style={{ textAlign: "right", color: "#fff" }}>
              @{data && data._user && data._user.username}
            </p>
            {localStorage.getItem("jwtToken") && getSubscribtionButton()}
          </div>
        </div>
      </div>
    </AntdCard>
  );
}

export default Card;
