import React, { useState, useContext } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import GridItem from "../../Components/MaterialUI/Grid/GridItem";
import GridContainer from "../../Components/MaterialUI/Grid/GridContainer.js";
import Button from "../../Components/MaterialUI/CustomButtons/Button.js";
import Card from "../../Components/MaterialUI/Card/Card.js";
import CardHeader from "../../Components/MaterialUI/Card/CardHeader.js";
import CardBody from "../../Components/MaterialUI/Card/CardBody.js";
import CardFooter from "../../Components/MaterialUI/Card/CardFooter.js";
import { Link, withRouter } from "react-router-dom";
import "./login.css";
import { loginUser } from "../../Services/auth";
import setAuthToken from "../../Helpers/SetAuthToken";
import { userInfoContext } from "../../Contexts/UserStore";
import TwitterLogin from "react-twitter-login";

import GoogleLogin from "react-google-login";
import Logo from "../../Assets/logo-transparent.png";
import GoogleIcon from "../../Assets/icons8-google-48.png";
import { authWithTwitter } from "../../Services/users";

import { Form, Input } from "antd";
import { UserOutlined, LockOutlined, LoadingOutlined } from "@ant-design/icons";
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

function Login(props) {
  const classes = useStyles();
  const [userInfo, setUserInfo] = useContext(userInfoContext);
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState({});

  const onFinish = async (values) => {
    setLoading(true);
    const res = await loginUser(values);
    if (res.success) {
      localStorage.setItem("jwtToken", res.res.token);
      setUserInfo({
        ...userInfo,
        id: res.res.user_id,
        role: res.res.role,
        username: res.res.username,
      });
      setAuthToken(localStorage.getItem("jwtToken"));
      if (res.res.role === "customer") {
        props.history.push("/");
      }
      if (res.res.role === "admin") {
        props.history.push("/admin/dashboard");
      }
    }
    setLoading(false);
  };

  const twitterAuthHandler = async (err, data) => {
    if (data) {
      const credentials = {
        username: data.screen_name,
        email: `${data.screen_name}.${data.user_id}@mail.com`,
        password: data.user_id,
        role: "customer",
      };

      setLoading(true);
      const res = await authWithTwitter(credentials);
      if (res.success) {
        localStorage.setItem("jwtToken", res.res.token);
        setUserInfo({
          ...userInfo,
          id: res.res.user_id,
          role: res.res.role,
          username: res.res.username,
        });
        setAuthToken(localStorage.getItem("jwtToken"));
        if (res.res.role === "customer") {
          props.history.push("/");
        }
        if (res.res.role === "admin") {
          props.history.push("/admin/dashboard");
        }
      }
      setLoading(false);
    }
  };

  const responseGoogle = async (response) => {
    if (response.profileObj) {
      const credentials = {
        username: response.profileObj.givenName,
        email: response.profileObj.email,
        password: response.googleId,
        role: "customer",
      };
      setLoading(true);
      const res = await authWithTwitter(credentials);
      if (res.success) {
        localStorage.setItem("jwtToken", res.res.token);
        setUserInfo({
          ...userInfo,
          id: res.res.user_id,
          role: res.res.role,
          username: res.res.username,
        });
        setAuthToken(localStorage.getItem("jwtToken"));
        if (res.res.role === "customer") {
          props.history.push("/");
        }
        if (res.res.role === "admin") {
          props.history.push("/admin/dashboard");
        }
      }
      setLoading(false);
    }
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
              <h1 className={classes.cardTitleWhite}>LOGIN</h1>
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
                    <Form.Item
                      name="password"
                      rules={[
                        {
                          required: true,
                          message: "Please input your Password!",
                        },
                      ]}
                    >
                      <Input
                        prefix={
                          <LockOutlined className="site-form-item-icon" />
                        }
                        type="password"
                        placeholder="Password"
                      />
                    </Form.Item>

                    {loading ? (
                      <LoadingOutlined />
                    ) : (
                      <Form.Item style={{ marginTop: "10px", color: "#fff" }}>
                        <Button
                          type="primary"
                          htmlType="submit"
                          className="login-form-button"
                          style={{ marginRight: "5px" }}
                          disabled={loading}
                          color="primary"
                        >
                          Log in
                        </Button>
                        Or{" "}
                        <Link to="/register" style={{ marginLeft: "5px" }}>
                          register now!
                        </Link>
                        <Link
                          to="/reset-password"
                          style={{ marginLeft: "5px", display: "block" }}
                        >
                          Forgot Password
                        </Link>
                      </Form.Item>
                    )}
                  </Form>
                </GridItem>
              </GridContainer>
            </CardBody>

            <GridContainer
              style={{
                display: "flex",
                flexDirection: "column",
                paddingBottom: "30px",
              }}
            >
              <div>
                <TwitterLogin
                  buttonTheme="light"
                  authCallback={twitterAuthHandler}
                  consumerKey={process.env.REACT_APP_TWITTER_API_KEY}
                  consumerSecret={process.env.REACT_APP_TWITTER_SECRET_KEY}
                />
              </div>
              <div>
                <GoogleLogin
                  render={(renderProps) => (
                    <button
                      onClick={renderProps.onClick}
                      disabled={renderProps.disabled}
                      authCallback={false}
                      style={{
                        width: "100%",
                        backgroundColor: "transparent",
                        color: "#ff3d00",
                        padding: "10px 10px",
                        borderRadius: "50px",
                        fontWeight: "700",
                        fontSize: "16px",
                        width: "220px",
                        border: "2px solid #ff3d00",
                        cursor: "pointer",
                      }}
                    >
                      <img
                        src={GoogleIcon}
                        alt=""
                        style={{ height: "25px", marginRight: "6px" }}
                      />
                      Sign in with Google
                    </button>
                  )}
                  clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                  buttonText="Login"
                  onSuccess={responseGoogle}
                  onFailure={responseGoogle}
                  cookiePolicy={"single_host_origin"}
                />
              </div>
            </GridContainer>
          </Card>
        </GridItem>
      </GridContainer>
      <Link to="/">
        <Button
          style={{
            margin: "10px 0",
            width: "100%",
            backgroundColor: "#CB52E3",
            color: "#fff",
          }}
        >
          Continue without login
        </Button>
      </Link>
    </div>
  );
}

export default withRouter(Login);
