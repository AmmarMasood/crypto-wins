import React, { useEffect, useState, useContext } from "react";
import { userInfoContext } from "../../Contexts/UserStore";
import { getAllUsers, subToUser, unsubToUser } from "../../Services/users";
import { BellOutlined } from "@ant-design/icons";
import useWindowDimensions from "../../Helpers/useWindowDimensions";
import { ReactComponent as Bell } from "../../Assets/bell.svg";

function Followers({ setData, data, setIntents, intents }) {
  const [type, setType] = useState(1);
  const [userInfo, setUserInfo] = useContext(userInfoContext);
  const [peopleIFollow, setPeopleIFollow] = useState([]);
  const { width } = useWindowDimensions();
  const [myFollowers, setMyFollowers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const u = await getAllUsers();
    if (u.success) {
      const f = u.res.users.filter(
        (user) =>
          user.subscribers.filter((sub) => sub._id === userInfo.id).length > 0
      );
      const me = u.res.users.filter((user) => user._id === userInfo.id);

      me ? setMyFollowers(me[0].subscribers) : setMyFollowers([]);
      setPeopleIFollow(f);
    }
  };

  // const subscribeToUser = async (id, intents) => {
  //   // setLoading(true);
  //   const res = await subToUser(id);
  //   if (res.success) {
  //     // setIsModalVisible(false);
  //     fetchUsers();
  //     fetchTrades();
  //     fetchIntents();
  //   }

  //   // setLoading(false);
  // };

  const unsubscribeToUser = async (id) => {
    // setLoading(true);
    const res = await unsubToUser(id);
    if (res.success) {
      // setIsModalVisible(false);
      const i = peopleIFollow.filter((p) => p._id !== id);
      const g = data.map((d) => {
        if (d._user._id === id) {
          d._user.subscribers = res.res;
          return d;
        }
        return d;
      });
      const k = intents.map((d) => {
        if (d._user._id === id) {
          d._user.subscribers = res.res;
          return d;
        }
        return d;
      });
      setPeopleIFollow(i);
      setData(g);
      setIntents(k);
    }
    // setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#1E1E2B" }}>
      <div
        style={{
          marginTop: "50px",
          width: width < 500 ? "320px" : "500px",
          padding: width < 500 ? "20px 0" : "20px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
        <span
          onClick={() => setType(1)}
          style={{
            borderRadius: "10px",
            cursor: "pointer",
            padding: "10px",
            background: type === 1 ? "#CB52E3" : "#707070",
            color: "#fff",
            fontSize: "20px",
            fontWeight: "600",
          }}
        >
          Traders I Follow
        </span>
        <span
          onClick={() => setType(2)}
          style={{
            borderRadius: "10px",
            cursor: "pointer",
            padding: "10px",
            background: type === 2 ? "#CB52E3" : "#707070",
            color: "#fff",
            fontSize: "20px",
            fontWeight: "600",
          }}
        >
          My Followers
        </span>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        {type === 1 &&
          peopleIFollow.map((user) => (
            <div
              style={{
                backgroundColor: "#272A3E",
                width: width < 500 ? "320px" : "500px",
                display: "flex",
                margin: "10px",
                borderRadius: "10px",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px",
              }}
            >
              <p style={{ color: "#fff", fontSize: "20px" }}>
                @ {user.username}
              </p>
              <Bell
                className="card-icon-style"
                fill="#CB52E3"
                style={{
                  marginLeft: "8px",
                  height: "25px",
                  width: "25px",
                  cursor: "pointer",
                }}
                onClick={() => unsubscribeToUser(user._id)}
              />
            </div>
          ))}
        {type === 2 &&
          myFollowers.map((user) => (
            <div
              style={{
                backgroundColor: "#272A3E",
                width: width < 500 ? "320px" : "500px",
                display: "flex",
                margin: "10px",
                borderRadius: "10px",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px",
              }}
            >
              <p style={{ color: "#fff", fontSize: "20px" }}>
                @ {user.username}
              </p>
              {/* <BellOutlined className="card-icon-style" /> */}
              <span></span>
            </div>
          ))}
      </div>
    </div>
  );
}

export default Followers;
