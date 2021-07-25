import React, { Component } from "react";
import { login, forgotPassword } from "../../util/APIUtils";
import "../../styles/style.less";
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
const { Title } = Typography;

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

    this.forgotPasswordSend = this.forgotPasswordSend.bind(this);
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

    if (this.state.usernameOrEmail == "" || this.state.password == "") {
      return;
    }

    login(loginRequest)
      .then((response) => {
        if (response.message == "user not enabled") {
          notification.error({
            message: "Registration required",
            description:
              "Check your email to complete registration for this user.",
            duration: 4,
          });
          return;
        }
        if (response.message == "Bad credentials") {
          notification.error({
            message: "Dans App",
            description: "Your username or password is incorrect.",
          });
        } else {
          localStorage.setItem(ACCESS_TOKEN, response.accessToken);
          this.props.onLogin();
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

    this.setState({
      loading: true,
    });

    forgotPassword(email).then((response) => {
      notification.success({
        message: "Email Sent",
        description: "A password reset link has been emailed to " + email + ".",
        duration: 6,
      });
      this.setState({
        forgotPasswordVisible: false,
      });
    });
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
        <FormItem>
          <Button
            type="primary"
            htmlType="submit"
            block={true}
            className="custom-style"
          >
            Login
          </Button>
        </FormItem>
        <Button type="secondary" block={true} onClick={this.showModal}>
          Forgot Password?
        </Button>
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
            onClick={this.forgotPasswordSend}
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
