import React, { useState, useContext, useEffect } from "react";
import { Form, Input, Button, Card } from "antd";
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  LoadingOutlined,
} from "@ant-design/icons";

import { withRouter } from "react-router-dom";
import "../../Pages/Register/register.css";
import { userInfoContext } from "../../Contexts/UserStore";
import jwtDecode from "jwt-decode";
import { updateAdmin } from "../../Services/users";
import { logoutUser } from "../../Services/auth";

function ProfileSetting(props) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useContext(userInfoContext);
  const decode = jwtDecode(localStorage.getItem("jwtToken"));

  useEffect(() => {
    form.setFieldsValue({
      username: decode.username,
      email: decode.email,
    });
  }, []);
  const onFinish = async (values) => {
    setLoading(true);
    const res = await updateAdmin(values);
    if (res.success) {
      logoutUser(props.history, setUserInfo);
    }
    setLoading(false);
    // if (res && res.success) {
    //   props.history.push("/");
    // }
  };

  return (
    <div style={{ textAlign: "left", marginLeft: "50px", marginRight: "50px" }}>
      <h2
        className="font-heading-black"
        style={{ marginBottom: "30px", color: "#fff" }}
      >
        Update Setting
      </h2>
      <Form
        name="normal_login"
        className="login-form"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        form={form}
      >
        <Form.Item
          name="username"
          //   rules={[{ required: true, message: "Please input your Username!" }]}
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="New username"
          />
        </Form.Item>
        <Form.Item
          name="email"
          rules={[
            {
              type: "email",
              message: "The input is not valid E-mail!",
            },
          ]}
        >
          <Input
            prefix={<MailOutlined className="site-form-item-icon" />}
            type="email"
            placeholder="New email"
          />
        </Form.Item>
        <Form.Item name="password">
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="New Password"
          />
        </Form.Item>
        {loading ? (
          <LoadingOutlined />
        ) : (
          <Form.Item style={{ marginTop: "10px" }}>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
              style={{
                marginRight: "5px",
                backgroundColor: "#f78641",
                borderColor: "#f78641",
                color: "#fff",
              }}
              disabled={loading}
              // style={{backgroundColor:"#f78641", borderColor:"#f78641",color:"#fff"}}
            >
              {loading ? <LoadingOutlined /> : "Update"}
            </Button>
          </Form.Item>
        )}
      </Form>
    </div>
  );
}

export default withRouter(ProfileSetting);
