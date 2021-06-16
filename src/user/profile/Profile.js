import React, { Component } from "react";
import {
  Table,
  Popconfirm,
  Typography,
  message,
  Select,
  Icon,
  notification,
  Form,
  Input,
  Button,
  Card,
  Modal,
} from "antd";
import {
  getUserProfile,
  updateUser,
  createStudentUser,
} from "../../util/APIUtils";
import "../../styles/style.less";
import moment from "moment";

import {
  PlusOutlined,
  DeleteOutlined,
  UserOutlined,
  SaveOutlined,
  PlusCircleOutlined,
  LoadingOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

class Profile extends Component {
  formRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      user: null,
      loading: false,
      password: "",
    };
    this.loadUserProfile = this.loadUserProfile.bind(this);
  }

  loadUserProfile(username) {
    this.setState({
      loading: true,
    });

    getUserProfile(username).then((response) => {
      this.setState({
        user: response,
        loading: false,
      });
    });
    /* .catch((error) => {
        console.log("fail" + error.message);
        if (error.status === 404) {
          this.setState({
            notFound: true,
            loading: false,
          });
        } else {
          this.setState({
            serverError: true,
            loading: false,
          });
        }
      }); */
  }

  componentDidMount() {
    const username = this.props.match.params.username;
    this.loadUserProfile(username);
  }

  componentDidUpdate(nextProps) {
    if (this.props.match.params.username !== nextProps.match.params.username) {
      this.loadUserProfile(nextProps.match.params.username);
    }
  }

  handleSubmit() {
    const { user, password } = this.state;

    let name = this.formRef.current.getFieldValue("name");
    let username = this.formRef.current.getFieldValue("username");
    let formPassword = this.formRef.current.getFieldValue("password");
    let email = this.formRef.current.getFieldValue("email");
    let phoneNumber = this.formRef.current.getFieldValue("phoneNumber");
    let address = this.formRef.current.getFieldValue("address");

    this.setState({ loading: true });

    const data = {
      id: user.id,
      name: name,
      username: username,
      email: email,
      phoneNumber: phoneNumber,
      address: address,
      createdAt: user.createdAt,
      updatedAt: moment().format("YYY-MM-DD, h:mm a"),
      password: password,
      enabled: user.enabled,
      role: user.role,
    };
    updateUser(data)
      .then((response) => {
        if (response.email == "exists") {
          message.warning("Email already exists.");
        }
        if (response.username == "exists") {
          message.warning("Username already exists.");
        }
        if (response.email != "exists" && response.username != "exists") {
          message.success("User saved.");
        }
        this.setState({ loading: false });
      })
      .catch((error) => {
        message.error("Error [" + error.message + "]");
        this.setState({ loading: false });
      });
  }

  handlePasswordChange(value) {
    this.setState({
      password: value,
    });
  }

  render() {
    const { user, loading } = this.state;

    var content = [];
    if (!user) {
      content = [<LoadingOutlined />];
    } else {
      content = [
        <Form
          layout="vertical"
          onFinish={this.handleSubmit}
          ref={this.formRef}
          name="control-ref"
          style={{ padding: 20 }}
          initialValues={{
            username: user.username,
            name: user.name,
            email: user.email,
            address: user.address,
            phoneNumber: user.phoneNumber,
          }}
        >
          <Form.Item
            name="name"
            label={
              <Title style={{ marginBottom: 0 }} level={5}>
                {"Name"}
              </Title>
            }
            hasFeedback
            rules={[
              {
                required: true,
                message: "Please enter a name.",
              },
            ]}
          >
            <Input
              placeholder="Full Name"
              style={{ fontSize: "16px" }}
              autosize={{ minRows: 1, maxRows: 1 }}
            />
          </Form.Item>

          <Form.Item
            name="username"
            label={
              <Title style={{ marginBottom: 0 }} level={5}>
                {"Username"}
              </Title>
            }
            hasFeedback
            rules={[
              {
                required: true,
                message: "Please enter a username.",
              },
            ]}
          >
            <Input
              placeholder="Username"
              style={{ fontSize: "16px" }}
              autosize={{ minRows: 1, maxRows: 1 }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            style={{ marginBottom: 6 }}
            label={
              <Title style={{ marginBottom: 0 }} level={5}>
                {"Password"}
                <Text
                  style={{ fontSize: 12, marginLeft: 10, color: "darkgray" }}
                >
                  (Hidden. Save to change.)
                </Text>
              </Title>
            }
            hasFeedback
            rules={[
              {
                required: true,
                message: "Please enter a password.",
              },
            ]}
          >
            <Input
              placeholder="Password"
              style={{ fontSize: "16px" }}
              autosize={{ minRows: 1, maxRows: 1 }}
              onChange={this.handlePasswordChange}
            />
          </Form.Item>

          <Form.Item
            name="email"
            label={
              <Title style={{ marginBottom: 0 }} level={5}>
                {"Email"}
              </Title>
            }
            hasFeedback
            rules={[
              {
                required: true,
                type: "email",
                message: "Please enter an email.",
              },
            ]}
          >
            <Input
              placeholder="myemail@gmail.com"
              style={{ fontSize: "16px" }}
              autosize={{ minRows: 1, maxRows: 1 }}
            />
          </Form.Item>

          <Form.Item
            name="phoneNumber"
            label={
              <Title style={{ marginBottom: 0 }} level={5}>
                {"Phone Number"}
              </Title>
            }
            hasFeedback
            rules={[
              {
                required: true,
                message: "Please enter a phone number.",
              },
            ]}
          >
            <Input
              placeholder="777-777-7777"
              style={{ fontSize: "16px" }}
              autosize={{ minRows: 1, maxRows: 2 }}
            />
          </Form.Item>

          <Form.Item
            name="address"
            label={
              <Title style={{ marginBottom: 0 }} level={5}>
                {"Address"}
              </Title>
            }
            hasFeedback
            rules={[
              {
                required: true,
                message: "Please enter an address.",
              },
            ]}
          >
            <Input
              placeholder="1234 Street City State"
              style={{ fontSize: "16px" }}
              autosize={{ minRows: 2, maxRows: 4 }}
            />
          </Form.Item>

          <Button
            type="primary"
            loading={loading}
            icon={<SaveOutlined />}
            onClick={this.handleSubmit}
          >
            Save
          </Button>
        </Form>,
      ];
    }

    const title = [
      <Title level={3}>
        <div>
          User <UserOutlined />
        </div>
      </Title>,
    ];

    return (
      <Card
        className="custom-style"
        bordered={false}
        bodyStyle={{ padding: 1 }}
        title={title}
      >
        {content}
      </Card>
    );
  }
}

export default Profile;

/* 
if (this.state.notFound) {
      return <NotFound />;
    }

    if (this.state.serverError) {
      return <ServerError />;
    }

    const tabBarStyle = {
      textAlign: "center",
    }; */

{
  /* <div className="profile">
        {this.state.user ? (
          <div className="user-profile">
            <div className="user-details">
              <div className="user-avatar">
                <Avatar
                  className="user-avatar-circle"
                  style={{
                    backgroundColor: getAvatarColor(this.state.user.name),
                  }}
                >
                  {this.state.user.name[0].toUpperCase()}
                </Avatar>
              </div>
              <div className="user-summary">
                <div className="full-name">{this.state.user.name}</div>
                <div className="username">@{this.state.user.username}</div>
                <div className="user-joined">
                  Joined {formatDate(this.state.user.joinedAt)}
                </div>
              </div>
            </div>
            <div className="user-poll-details">
              <Tabs
                defaultActiveKey="1"
                animated={false}
                tabBarStyle={tabBarStyle}
                size="large"
                className="profile-tabs"
              >
                <TabPane tab={`${this.state.user.pollCount} Polls`} key="1">
                  <PollList
                    username={this.props.match.params.username}
                    type="USER_CREATED_POLLS"
                  />
                </TabPane>
                <TabPane tab={`${this.state.user.voteCount} Votes`} key="2">
                  <PollList
                    username={this.props.match.params.username}
                    type="USER_VOTED_POLLS"
                  />
                </TabPane>
              </Tabs>
            </div>
          </div>
        ) : null}
      </div> */
}
