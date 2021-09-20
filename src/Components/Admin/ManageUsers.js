import React, { useState, useEffect } from "react";
import { Button, Table, Space, Input } from "antd";
import moment from "moment";
import { deleteUser, getAllUsers } from "../../Services/users";
import { LoadingOutlined } from "@ant-design/icons";

function ManageUsers() {
  const [filterUsers, setFilterUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    const data = await getAllUsers();
    if (data.success) {
      setAllUsers(data.res.users.filter((u) => u.role !== "admin"));
      setFilterUsers(data.res.users.filter((u) => u.role !== "admin"));
    }
    setLoading(false);
  };
  const deleteUsers = async (id) => {
    const data = await deleteUser(id);
    if (data.success) {
      fetchUsers();
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
      title: "Username",
      dataIndex: "username",
      key: "username",
      render: (text) => <span className="font-paragraph-black">{text}</span>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text) => <span className="font-paragraph-black">{text}</span>,
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
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
          <Button type="danger" onClick={() => deleteUsers(text._id)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];
  return (
    <div style={{ margin: "0 50px" }}>
      <h2 className="font-heading-black" style={{ color: "#fff" }}>
        All Users
      </h2>
      <div className="admin-allchallenges-list-container">
        <Input
          placeholder="Search Username"
          onChange={(e) =>
            setFilterUsers(
              allUsers.filter((mem) =>
                mem.username
                  .toUpperCase()
                  .includes(e.target.value.toUpperCase())
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
            dataSource={filterUsers.sort(
              (a, b) => moment(b.updatedAt) - moment(a.updatedAt)
            )}
          />
        )}
      </div>
    </div>
  );
}

export default ManageUsers;
