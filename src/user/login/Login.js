import React, { Component } from "react";
import { login, getCurrentUser, forgotPassword } from "../../util/APIUtils";
import "../../styles/style.less";
import { Link, withRouter } from "react-router-dom";
import { ACCESS_TOKEN } from "../../constants";

import {
  Form,
  Input,
  Button,
  Icon,
  notification,
  Modal,
  Card,
  Typography,
} from "antd";
import { SendOutlined } from "@ant-design/icons";

const FormItem = Form.Item;
const { Title, Text } = Typography;

class Login extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="custom-style">
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
      email: "",
      loading: false,
      forgotPasswordVisible: false,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleCancel = () => {
    this.setState({
      email: "",
      password: "",
      loading: false,
      forgotPasswordVisible: false,
    });
  };

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

  showModal = () => {
    this.setState({
      forgotPasswordVisible: true,
    });
  };

  isFormInvalid() {
    if (this.state.email == "") {
      return true;
    }

    return false;
  }

  forgotPasswordSend() {
    const { email } = this.state;

    forgotPassword(email).then((response) => {});
  }

  render() {
    const { forgotPasswordVisible, loading } = this.state;

    const modalTitle = <Title level={2}>Password Reset</Title>;

    const content = [
      <Form onFinish={this.handleSubmit} className="custom-style">
        <FormItem
          name="usernameOrEmail"
          rules={[
            {
              required: true,
              message: "Please input your username or email!",
            },
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
        <Button type="text" onClick={this.showModal}>
          Forgot Password?
        </Button>
        <FormItem>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            className="custom-style"
            onClick={this.handleSubmit}
          >
            Login
          </Button>
        </FormItem>
      </Form>,
      <Modal
        visible={forgotPasswordVisible}
        className="custom-style"
        title={modalTitle}
        closable={false}
        onCancel={this.handleCancel}
        footer={[
          <Button key="back" type="secondary" onClick={this.handleCancel}>
            Cancel
          </Button>,
          <Button
            key="submit"
            htmlType="submit"
            type="primary"
            icon={<SendOutlined />}
            disabled={this.isFormInvalid()}
            loading={loading}
            onClick={this.handleSubmit}
          >
            Send
          </Button>,
        ]}
      >
        <Input
          size="large"
          name="email"
          onChange={(e) => this.setState({ email: e.target.value })}
          placeholder="Enter your e-mail"
        />
      </Modal>,
    ];

    const cardTitle = <Title level={3}>Login</Title>;

    return (
      <Card
        className="custom-style"
        bordered={false}
        title={cardTitle}
        style={{ padding: 20 }}
      >
        {content}
      </Card>
    );
  }
}

export default Login;
