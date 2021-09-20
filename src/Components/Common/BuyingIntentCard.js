import React, { useContext, useState } from "react";
import "./card.css";
import { Button, Card as AntdCard } from "antd";
import { userInfoContext } from "../../Contexts/UserStore";
import {
  subscribeToIntent,
  unsubscribeToIntent,
} from "../../Services/buyingIntent";
import MUICARD from "../MaterialUI/Card/Card";
import CardBody from "../MaterialUI/Card/CardBody";
import CardHeader from "../MaterialUI/Card/CardHeader";
import CardFooter from "../MaterialUI/Card/CardFooter";
import { BellOutlined } from "@ant-design/icons";
import { ReactComponent as Bell } from "../../Assets/bell.svg";

function BuyingIntentCard({
  data,
  fetchIntents,
  onClick,
  unsubscribeToUser,
  subscribeToUser,
}) {
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useContext(userInfoContext);

  const addUserToIntent = async (intentId) => {
    setLoading(true);
    const res = await subscribeToIntent(intentId);
    if (res.success) {
      fetchIntents();
    }
    setLoading(false);
  };

  const unsubToIntent = async (intentId) => {
    setLoading(true);
    const res = await unsubscribeToIntent(intentId);
    if (res.success) {
      fetchIntents();
    }
    setLoading(false);
  };

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
              onClick={() => unsubscribeToUser(data._user._id, true)}
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
              onClick={() => subscribeToUser(data._user._id, true)}
            />
          </div>
        );
      }
    } else {
      // return  <BellTwoTone className="card-icon-style" twoToneColor="#fff" style={{marginLeft:"8px"}} onClick={() => subscribeToUser(data._user._id)}/>;
    }
  };

  return (
    <MUICARD
      className="custom-card-style"
      loading={loading}
      style={{ cursor: "auto", minHeight: "300px" }}
      //   onClick={() => onClick(data)}
    >
      <CardHeader>
        {" "}
        <div className="custom-card-style-r1" style={{ marginLeft: "43%" }}>
          {data.buyingCryptoName && data.buyingCryptoName.length > 0 && (
            <h3>{data.buyingCryptoName}</h3>
          )}

          {data.sellingCryptoName && data.sellingCryptoName.length > 0 && (
            <h3>{data.sellingCryptoName}</h3>
          )}
        </div>
        {/* <div className="card-top-box" style={{backgroundColor: "#43AA8B #F94144"}}> */}
        {data.buyingCryptoName && data.buyingCryptoName.length > 0 && (
          <>
            <div
              className="card-top-box"
              style={{ backgroundColor: "#43AA8B" }}
            >
              <h3 style={{ border: "none" }}>BUYING @</h3>
              <h3
                style={{
                  borderTop: "2px solid white",
                  fontFamily: "Lato, sans-serif",
                }}
              >
                ${parseFloat(data.buyingPrice).toLocaleString()}
              </h3>
            </div>
          </>
        )}
        {data.sellingCryptoName && data.sellingCryptoName.length > 0 && (
          <>
            <div
              className="card-top-box"
              style={{ backgroundColor: "#F94144" }}
            >
              <h3 style={{ border: "none" }}>SELLING @</h3>
              <h3
                style={{
                  borderTop: "2px solid white",
                  fontFamily: "Lato, sans-serif",
                }}
              >
                ${parseFloat(data.sellingPrice).toLocaleString()}
              </h3>
            </div>
          </>
        )}
        <div className="border-bottom"></div>
        {/* </div> */}
      </CardHeader>
      {/* <CardHeader>
        
        
      <p style={{ textAlign: "right", marginBottom: "10px" }}>
        @{data._user.username}
      </p>
      {data.buyingCryptoName && data.buyingCryptoName.length > 0 && (
        <div>
          <h3>
            Will buy {data.buyingCryptoName} at $
            {parseFloat(data.buyingPrice).toLocaleString()}
          </h3>
        </div>
      )}
      </CardHeader> */}

      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          height: "100%",
          margin: "10px",
        }}
      >
        <span
          style={{
            color: "#fff",
            backgroundColor: "#CB52E3",
            padding: "5px",
            borderRadius: "20px",
            marginRight: "10px",
          }}
        >
          Reason:
        </span>
        <p
          style={{
            color: "#fff",
            width: "100%",
            overflow: "hidden",
            marginTop: "5px",
          }}
        >
          {data.reason}
        </p>
      </div>

      {/* <div style={{ margin: "10px 0" }}>
        <span
          style={{ fontSize: "16px", fontWeight: "600", marginRight: "10px" }}
        >
          Followers:
        </span>
        {data && data.subscribers.length > 0
          ? data.subscribers.map((d, i) => <span>@{d.username} </span>)
          : "none"}
      </div> */}
      <div
        style={{
          borderTop: "5px solid #43AA8B",
          padding: "0 10px 10px 10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {userInfo.id === data._user._id ? (
          <span>
            <Button
              disabled={true}
              style={{
                backgroundColor: "#f0f2f5",
                marginTop: "20px",
                borderRadius: "100px",
              }}
            >
              Me Too
            </Button>
            <span
              style={{
                marginLeft: "10px",
                fontSize: "18px",
                color: "#fff",
                fontFamily: "Lato, sans-serif",
              }}
            >
              {data && data.subscribers.length > 0
                ? data.subscribers.length
                : ""}
            </span>
          </span>
        ) : data.subscribers &&
          data.subscribers.filter((f) => f._id === userInfo.id).length > 0 ? (
          <span>
            <Button
              onClick={() => unsubToIntent(data._id)}
              disabled={!localStorage.getItem("jwtToken")}
              style={{
                backgroundColor: "#f78641",
                borderColor: "#f78641",
                color: "#fff",
                marginTop: "20px",
                borderRadius: "100px",
              }}
            >
              Me Too
            </Button>
            <span
              style={{
                marginLeft: "10px",
                fontSize: "18px",
                color: "#fff",
                fontFamily: "Lato, sans-serif",
              }}
            >
              {data && data.subscribers.length > 0
                ? data.subscribers.length
                : ""}
            </span>
          </span>
        ) : (
          <span>
            <Button
              onClick={() => addUserToIntent(data._id)}
              disabled={!localStorage.getItem("jwtToken")}
              style={{
                backgroundColor: "#f0f2f5",
                marginTop: "20px",
                borderRadius: "100px",
              }}
            >
              Me Too
            </Button>
            <span
              style={{
                marginLeft: "10px",
                fontSize: "18px",
                color: "#fff",
                fontFamily: "Lato, sans-serif",
              }}
            >
              {data && data.subscribers.length > 0
                ? data.subscribers.length
                : ""}
            </span>
          </span>
        )}
        <span
          style={{
            color: "#fff",
            fontSize: "18px",
            marginTop: "10px",
            display: "flex",
            alignItems: "center",
          }}
        >
          {" "}
          @{data._user.username} {getSubscribtionButton()}
        </span>
      </div>
    </MUICARD>
  );
}

export default BuyingIntentCard;
