import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import Logo from "../../Assets/logo-transparent.png";
import { Form, Input, Card, Button } from "antd";
import { resetPassord } from "../../Services/users";

function NewPassword(props) {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    const res = await resetPassord({
      password: values.password,
      token: props.match.params.resetToken,
    });
    if (res.success) {
      props.history.push("/login");
    }
    setLoading(false);
  };

  return (
    <div
      className="login-form-card"
      style={{ textAlign: "center", backgroundColor: "transparent" }}
    >
      <img height="100px" width="200px" src={Logo} alt="" />
      <div>
        <div xs={12} sm={12} md={12}>
          <Card style={{ backgroundColor: "#272A3E" }}>
            <div color="primary">
              <h1 style={{ color: "#fff" }}>Enter New Password</h1>
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
                      name="password"
                      rules={[
                        {
                          required: true,
                          message: "Please input new password!",
                        },
                      ]}
                    >
                      <Input type="password" placeholder="Enter new password" />
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
                        Reset
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

export default withRouter(NewPassword);
