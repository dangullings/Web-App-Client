import React, { Component } from "react";
import {
  signup,
  checkUsernameAvailability,
  checkEmailAvailability,
} from "../../util/APIUtils";
import "../../styles/style.less";
import {
  NAME_MIN_LENGTH,
  NAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
  USERNAME_MAX_LENGTH,
  EMAIL_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
} from "../../constants";

import { Form, Input, Button, notification, Typography } from "antd";
const { Title } = Typography;

const key = "updatable";
const openNotification = () => {
  notification.open({
    key,
    message: "Registration Successful!",
    description: "Thank you for registering.",
  });
  setTimeout(() => {
    notification.open({
      key,
      message: "Confirmation Email Sent!",
      description: "Please respond to the email within 24 hours.",
    });
  }, 1000);
};

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: {
        value: "",
      },
      username: {
        value: "",
      },
      email: {
        value: "",
      },
      address: {
        value: "",
      },
      phoneNumber: {
        value: "",
      },
      password: {
        value: "",
      },
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.validateUsernameAvailability =
      this.validateUsernameAvailability.bind(this);
    this.validateEmailAvailability = this.validateEmailAvailability.bind(this);
    this.isFormInvalid = this.isFormInvalid.bind(this);
  }

  handleInputChange(event, validationFun) {
    const target = event.target;
    const inputName = target.name;
    const inputValue = target.value;

    this.setState({
      [inputName]: {
        value: inputValue,
        ...validationFun(inputValue),
      },
    });
  }

  handleSubmit() {
    const signupRequest = {
      name: this.state.name.value,
      email: this.state.email.value,
      address: this.state.address.value,
      phoneNumber: this.state.phoneNumber.value,
      username: this.state.username.value,
      password: this.state.password.value,
      role: "user",
    };
    signup(signupRequest)
      .then((response) => {
        notification.success({
          message: "Registration Successful",
          description: "Confirmation email sent! Thank you for registering.",
          duration: 6,
        });
        this.props.history.push("/login");
      })
      .catch((error) => {
        notification.error({
          message: "Unsuccessful",
          description:
            error.message || "Something went wrong. Please try again!",
        });
      });
  }

  isFormInvalid() {
    return !(
      this.state.name.validateStatus === "success" &&
      this.state.username.validateStatus === "success" &&
      this.state.email.validateStatus === "success" &&
      this.state.password.validateStatus === "success" &&
      this.state.address.validateStatus === "success"
    );
  }

  render() {
    return (
      <div className="custom-style" style={{ padding: 20 }}>
        <h1 className="custom-style">Sign Up</h1>
        <div className="custom-style">
          <Form onSubmit={this.handleSubmit} className="custom-style">
            <Form.Item
              label={
                <Title style={{ marginBottom: 0 }} level={5}>
                  {"Full Name"}
                </Title>
              }
              validateStatus={this.state.name.validateStatus}
              help={this.state.name.errorMsg}
              hasFeedback
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input
                size="large"
                name="name"
                autoComplete="off"
                placeholder="Your full name"
                value={this.state.name.value}
                onChange={(event) =>
                  this.handleInputChange(event, this.validateName)
                }
              />
            </Form.Item>
            <Form.Item
              label={
                <Title style={{ marginBottom: 0 }} level={5}>
                  {"Username"}
                </Title>
              }
              hasFeedback
              rules={[
                {
                  required: true,
                },
              ]}
              validateStatus={this.state.username.validateStatus}
              help={this.state.username.errorMsg}
            >
              <Input
                size="large"
                name="username"
                autoComplete="off"
                placeholder="A unique username"
                value={this.state.username.value}
                onBlur={this.validateUsernameAvailability}
                onChange={(event) =>
                  this.handleInputChange(event, this.validateUsername)
                }
              />
            </Form.Item>
            <Form.Item
              label={
                <Title style={{ marginBottom: 0 }} level={5}>
                  {"Password"}
                </Title>
              }
              rules={[
                {
                  required: true,
                },
              ]}
              validateStatus={this.state.password.validateStatus}
              help={this.state.password.errorMsg}
            >
              <Input
                size="large"
                name="password"
                type="password"
                autoComplete="off"
                placeholder="A password between 6 to 20 characters"
                value={this.state.password.value}
                onChange={(event) =>
                  this.handleInputChange(event, this.validatePassword)
                }
              />
            </Form.Item>
            <Form.Item
              label={
                <Title style={{ marginBottom: 0 }} level={5}>
                  {"Email"}
                </Title>
              }
              hasFeedback
              validateStatus={this.state.email.validateStatus}
              help={this.state.email.errorMsg}
            >
              <Input
                size="large"
                name="email"
                type="email"
                autoComplete="off"
                placeholder="Your email"
                value={this.state.email.value}
                rules={[
                  {
                    required: true,
                  },
                ]}
                onBlur={this.validateEmailAvailability}
                onChange={(event) =>
                  this.handleInputChange(event, this.validateEmail)
                }
              />
            </Form.Item>
            <Form.Item
              label={
                <Title style={{ marginBottom: 0 }} level={5}>
                  {"Address"}
                </Title>
              }
              hasFeedback
              validateStatus={this.state.address.validateStatus}
              help={this.state.address.errorMsg}
            >
              <Input
                size="large"
                name="address"
                autoComplete="off"
                placeholder="Your Address"
                value={this.state.address.value}
                onChange={(event) =>
                  this.handleInputChange(event, this.validateAddress)
                }
              />
            </Form.Item>
            <Form.Item
              label={
                <Title style={{ marginBottom: 0 }} level={5}>
                  {"Phone Number"}
                </Title>
              }
              hasFeedback
              validateStatus={this.state.phoneNumber.validateStatus}
              help={this.state.phoneNumber.errorMsg}
            >
              <Input
                size="large"
                name="phoneNumber"
                autoComplete="off"
                placeholder="Your Phone Number"
                value={this.state.phoneNumber.value}
                onChange={(event) =>
                  this.handleInputChange(event, this.validatePhoneNumber)
                }
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                className="custom-style"
                onClick={this.handleSubmit}
                disabled={this.isFormInvalid()}
              >
                Sign up
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    );
  }

  // Validation Functions

  validateName = (name) => {
    if (name.length < NAME_MIN_LENGTH) {
      return {
        validateStatus: "error",
        errorMsg: `Name is too short (Minimum ${NAME_MIN_LENGTH} characters needed.)`,
      };
    } else if (name.length > NAME_MAX_LENGTH) {
      return {
        validationStatus: "error",
        errorMsg: `Name is too long (Maximum ${NAME_MAX_LENGTH} characters allowed.)`,
      };
    } else {
      return {
        validateStatus: "success",
        errorMsg: null,
      };
    }
  };

  validateEmail = (email) => {
    if (!email) {
      return {
        validateStatus: "error",
        errorMsg: "Email may not be empty",
      };
    }

    const EMAIL_REGEX = RegExp("[^@ ]+@[^@ ]+\\.[^@ ]+");
    if (!EMAIL_REGEX.test(email)) {
      return {
        validateStatus: "error",
        errorMsg: "Email not valid",
      };
    }

    if (email.length > EMAIL_MAX_LENGTH) {
      return {
        validateStatus: "error",
        errorMsg: `Email is too long (Maximum ${EMAIL_MAX_LENGTH} characters allowed)`,
      };
    }

    return {
      validateStatus: null,
      errorMsg: null,
    };
  };

  validateAddress = (address) => {
    if (!address) {
      return {
        validateStatus: "error",
        errorMsg: "Address may not be empty",
      };
    }

    return {
      validateStatus: "success",
      errorMsg: null,
    };
  };

  validatePhoneNumber = (phoneNumber) => {
    if (!phoneNumber) {
      return {
        validateStatus: "error",
        errorMsg: "Phone Number may not be empty",
      };
    }

    if (phoneNumber.length !== 10) {
      return {
        validateStatus: "error",
        errorMsg: "10 digits required without special characters",
      };
    }

    return {
      validateStatus: "success",
      errorMsg: null,
    };
  };

  validateUsername = (username) => {
    if (username.length < USERNAME_MIN_LENGTH) {
      return {
        validateStatus: "error",
        errorMsg: `Username is too short (Minimum ${USERNAME_MIN_LENGTH} characters needed.)`,
      };
    } else if (username.length > USERNAME_MAX_LENGTH) {
      return {
        validationStatus: "error",
        errorMsg: `Username is too long (Maximum ${USERNAME_MAX_LENGTH} characters allowed.)`,
      };
    } else {
      return {
        validateStatus: null,
        errorMsg: null,
      };
    }
  };

  validateUsernameAvailability() {
    // First check for client side errors in username
    const usernameValue = this.state.username.value;
    const usernameValidation = this.validateUsername(usernameValue);

    if (usernameValidation.validateStatus === "error") {
      this.setState({
        username: {
          value: usernameValue,
          ...usernameValidation,
        },
      });
      return;
    }

    this.setState({
      username: {
        value: usernameValue,
        validateStatus: "validating",
        errorMsg: null,
      },
    });

    checkUsernameAvailability(usernameValue)
      .then((response) => {
        if (response.available) {
          this.setState({
            username: {
              value: usernameValue,
              validateStatus: "success",
              errorMsg: null,
            },
          });
        } else {
          this.setState({
            username: {
              value: usernameValue,
              validateStatus: "error",
              errorMsg: "This username is already taken",
            },
          });
        }
      })
      .catch((error) => {
        this.setState({
          username: {
            value: usernameValue,
            validateStatus: "success",
            errorMsg: null,
          },
        });
      });
  }

  validateEmailAvailability() {
    // First check for client side errors in email
    const emailValue = this.state.email.value;
    const emailValidation = this.validateEmail(emailValue);

    if (emailValidation.validateStatus === "error") {
      this.setState({
        email: {
          value: emailValue,
          ...emailValidation,
        },
      });
      return;
    }

    this.setState({
      email: {
        value: emailValue,
        validateStatus: "validating",
        errorMsg: null,
      },
    });

    checkEmailAvailability(emailValue)
      .then((response) => {
        if (response.available) {
          this.setState({
            email: {
              value: emailValue,
              validateStatus: "success",
              errorMsg: null,
            },
          });
        } else {
          this.setState({
            email: {
              value: emailValue,
              validateStatus: "error",
              errorMsg: "This Email is already registered",
            },
          });
        }
      })
      .catch((error) => {
        // Marking validateStatus as success, Form will be recchecked at server
        this.setState({
          email: {
            value: emailValue,
            validateStatus: "success",
            errorMsg: null,
          },
        });
      });
  }

  validatePassword = (password) => {
    if (password.length < PASSWORD_MIN_LENGTH) {
      return {
        validateStatus: "error",
        errorMsg: `Password is too short (Minimum ${PASSWORD_MIN_LENGTH} characters needed.)`,
      };
    } else if (password.length > PASSWORD_MAX_LENGTH) {
      return {
        validationStatus: "error",
        errorMsg: `Password is too long (Maximum ${PASSWORD_MAX_LENGTH} characters allowed.)`,
      };
    } else {
      return {
        validateStatus: "success",
        errorMsg: null,
      };
    }
  };
}

export default Signup;
