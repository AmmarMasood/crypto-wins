import React, { useState } from "react";
import { Link, withRouter } from "react-router-dom";
import Logo from "../../Assets/logo-transparent.png";
import { Form, Input, Card, Button } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { getPasswordResetLink } from "../../Services/users";

function EnterEmail(props) {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    const res = await getPasswordResetLink(values);
    setLoading(false);
  };

  return (
    <div
      className="login-form-card"
      style={{ textAlign: "center", backgroundColor: "transparent" }}
    >
      <img height="100px" width="200px" src={Logo} alt="" />
      <div>
        <div>
          <Card style={{ backgroundColor: "#272A3E" }}>
            <div color="primary">
              <h1 style={{ color: "#fff" }}>Reset Password</h1>
              {/* <p className={classes.cardCategoryWhite}>Please login with your email or login with social media networks</p> */}
            </div>
            <div>
              <div>
                <div style={{ padding: "20px" }}>
                  <Form
                    name="normal_login"
                    className="login-form"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                  >
                    <Form.Item
                      name="email"
                      rules={[
                        {
                          type: "email",
                          message: "The input is not valid E-mail!",
                        },
                        {
                          required: true,
                          message: "Please input your E-mail!",
                        },
                      ]}
                    >
                      <Input
                        prefix={
                          <UserOutlined className="site-form-item-icon" />
                        }
                        type="email"
                        placeholder="Email"
                      />
                    </Form.Item>
                    <Form.Item style={{ marginTop: "10px", color: "#fff" }}>
                      <Button
                        type="primary"
                        htmlType="submit"
                        className="login-form-button"
                        style={{
                          marginRight: "5px",
                          background: "#f78641",
                          borderColor: "#f78641",
                        }}
                        disabled={loading}
                        color="primary"
                      >
                        Submit
                      </Button>
                    </Form.Item>
                  </Form>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default withRouter(EnterEmail);
