import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";

import { Menu, Typography, message, Row } from "antd";
import {
  LoginOutlined,
  LogoutOutlined,
  UserOutlined,
  EditOutlined,
} from "@ant-design/icons";

import "../styles/style.less";

const { Title } = Typography;

class AppHeader extends Component {
  constructor(props) {
    super(props);
    this.handleMenuClick = this.handleMenuClick.bind(this);
    this.handleButtonClick = this.handleButtonClick.bind(this);
    this.logout = this.logout.bind(this);
  }

  render() {
    const login = [
      <Row>
        <Title style={{ color: "#383838" }} level={5}>
          Login
        </Title>
      </Row>,
    ];
    const signup = [
      <Row>
        <Title style={{ color: "#383838" }} level={5}>
          Signup
        </Title>
      </Row>,
    ];

    let usersName = "";
    let dropdownMenu = [];

    if (this.props.currentUser == null) {
      dropdownMenu = [
        <Menu mode="horizontal">
          <Menu.Item>
            <Link to="/login">{login}</Link>
          </Menu.Item>

          <Menu.Item>
            <Link to="/signup">{signup}</Link>
          </Menu.Item>
        </Menu>,
      ];
    }
    if (this.props.currentUser !== null) {
      usersName = this.props.currentUser.name;

      dropdownMenu = [
        <Link
          style={{
            marginLeft: 0,
            fontSize: "20px",
            color: "#4a4a4a",
          }}
          to={`/users/${this.props.currentUser.username}`}
        >
          {usersName}
        </Link>,
      ];
    }

    //<Menu mode="horizontal" selectedKeys={[this.props.location.pathname]}>
    //  {menuItems}
    //</Menu>;
    // this.props.onLogout();
    return <div className="custom-style">{dropdownMenu}</div>;
  }

  logout = () => {
    this.props.parentLogout();
  };

  handleButtonClick(e) {
    message.info(
      this.props.currentUser.username + " " + this.props.currentUser.role
    );
  }

  handleMenuClick(e) {
    //if (e.key == "logout") {
    //  this.handleLogout();
    //}
  }

  ProfileDropdownMenu(currentUser) {
    var dropdownMenu;
    if (currentUser) {
      let role = "";
      if (currentUser.role == "admin") {
        role = currentUser.role;
      }
      dropdownMenu = (
        <Menu onClick={this.handleMenuClick}>
          <Menu.Item key="profile" icon={<UserOutlined />}>
            <Link to={`/users/${currentUser.username}`}>Profile</Link>
          </Menu.Item>
          <Menu.Item
            key="logout"
            icon={<LogoutOutlined />}
            onClick={this.logout}
          >
            Logout
          </Menu.Item>
        </Menu>
      );
    }

    return dropdownMenu;
  }
}

export default withRouter(AppHeader);
