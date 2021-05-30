import React, { Component } from "react";
import { login, getCurrentUser } from "../../util/APIUtils";
import "../../styles/style.less";
import { Link, withRouter } from "react-router-dom";
import { ACCESS_TOKEN } from "../../constants";

import { Form, Input, Button, Icon, notification } from "antd";
import {
  DesktopOutlined,
  PieChartOutlined,
  FileOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";

const FormItem = Form.Item;

class Login extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="custom-style">
        <h1 className="custom-style">Login</h1>
        <div className="custom-style">
          <LoginForm onLogin={this.props.onLogin} />
        </div>
      </div>
    );
  }
}

class LoginForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      usernameOrEmail: "",
      password: "",
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    const loginRequest = {
      usernameOrEmail: this.state.usernameOrEmail,
      password: this.state.password,
    };

    //const loginRequest = Object.assign({}, values);
    login(loginRequest)
      .then((response) => {
        if (response.message !== "Bad credentials") {
          localStorage.setItem(ACCESS_TOKEN, response.accessToken);
          this.props.onLogin();
        } else {
          notification.error({
            message: "Dans App",
            description:
              "Your Username or Password is incorrect. Please try again!",
          });
        }
      })
      .catch((error) => {
        if (error.status === 401) {
          notification.error({
            message: "Dans App",
            description:
              "Your Username or Password is incorrect. Please try again!",
          });
        } else {
          notification.error({
            message: "Dans App",
            description:
              error.message || "Sorry! Something went wrong. Please try again!",
          });
        }
      });
  }

  render() {
    return (
      <Form onFinish={this.handleSubmit} className="custom-style">
        <FormItem
          name="usernameOrEmail"
          rules={[
            { required: true, message: "Please input your username or email!" },
          ]}
        >
          <Input
            prefix={<Icon type="user" />}
            size="large"
            name="usernameOrEmail"
            onChange={(e) => this.setState({ usernameOrEmail: e.target.value })}
            placeholder="Username or Email"
          />
        </FormItem>

        <FormItem
          name="password"
          rules={[{ required: true, message: "Please input your Password!" }]}
        >
          <Input
            prefix={<Icon type="lock" />}
            size="large"
            name="password"
            type="password"
            onChange={(e) => this.setState({ password: e.target.value })}
            placeholder="Password"
          />
        </FormItem>
        <FormItem>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            className="custom-style"
          >
            Login
          </Button>
        </FormItem>
      </Form>
    );
  }
}

export default Login;
