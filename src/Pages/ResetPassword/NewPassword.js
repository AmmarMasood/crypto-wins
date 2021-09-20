import React, { useState } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import GridItem from "../../Components/MaterialUI/Grid/GridItem";
import GridContainer from "../../Components/MaterialUI/Grid/GridContainer.js";
import Button from "../../Components/MaterialUI/CustomButtons/Button.js";
import Card from "../../Components/MaterialUI/Card/Card.js";
import CardHeader from "../../Components/MaterialUI/Card/CardHeader.js";
import CardBody from "../../Components/MaterialUI/Card/CardBody.js";
import { Link, withRouter } from "react-router-dom";
import Logo from "../../Assets/logo-transparent.png";
import { Form, Input } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { getPasswordResetLink, resetPassord } from "../../Services/users";

const styles = {
  cardCategoryWhite: {
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0",
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
  },
};

const useStyles = makeStyles(styles);

function NewPassword(props) {
  const classes = useStyles();
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
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card style={{ backgroundColor: "#272A3E" }}>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>Enter New Password</h4>
              {/* <p className={classes.cardCategoryWhite}>Please login with your email or login with social media networks</p> */}
            </CardHeader>
            <CardBody>
              <GridContainer>
                <GridItem xs={12} sm={12} md={12}>
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
                        style={{ marginRight: "5px" }}
                        disabled={loading}
                        color="primary"
                      >
                        Reset
                      </Button>
                    </Form.Item>
                  </Form>
                </GridItem>
              </GridContainer>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}

export default withRouter(NewPassword);
