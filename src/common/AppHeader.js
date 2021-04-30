import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";

import { Layout, Menu, Typography, Dropdown, Button, message, Row } from "antd";
import {
  LoginOutlined,
  LogoutOutlined,
  UserOutlined,
  EditOutlined,
} from "@ant-design/icons";

const { SubMenu } = Menu;
const Header = Layout.Header;
const { Title, Text } = Typography;

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
        <LoginOutlined />
        <Title style={{ color: "#383838" }} level={5}>
          Login
        </Title>
      </Row>,
    ];
    const signup = [
      <Row>
        <EditOutlined />
        <Title style={{ color: "#383838" }} level={5}>
          Signup
        </Title>
      </Row>,
    ];

    let menuItems = this.ProfileDropdownMenu(this.props.currentUser);
    let usersName = "";
    let dropdownMenu = [
      <Menu onClick={this.handleClick} mode="horizontal">
        <Menu.Item>
          <Link to="/login">{login}</Link>
        </Menu.Item>

        <Menu.Item>
          <Link to="/signup">{signup}</Link>
        </Menu.Item>
      </Menu>,
    ];
    if (this.props.currentUser) {
      usersName = this.props.currentUser.name;

      dropdownMenu = [
        <Dropdown.Button
          type="text"
          onClick={this.handleButtonClick}
          overlay={menuItems}
        >
          {usersName}
        </Dropdown.Button>,
      ];
    }

    //<Menu mode="horizontal" selectedKeys={[this.props.location.pathname]}>
    //  {menuItems}
    //</Menu>;
    // this.props.onLogout();
    return <div>{dropdownMenu}</div>;
  }

  handleClick() {}

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

{
  /* <div>
  <Menu.Item key="user-info" className="dropdown-item" disabled>
    <div className="username-info">
      {currentUser.username} {role}
    </div>
  </Menu.Item>
  <Menu.Divider />
  <Menu.Item key="profile" className="dropdown-item">
    <Link to={`/users/${currentUser.username}`}>Profile</Link>
  </Menu.Item>
  <Menu.Item
    key="logout"
    className="dropdown-item"
    onClick={this.props.onLogout()}
  >
    Logout
  </Menu.Item>
</div>; */
}
