import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";

import { Layout, Menu, Typography } from "antd";

const Header = Layout.Header;
const { Title, Text } = Typography;

class AppHeader extends Component {
  constructor(props) {
    super(props);
    this.handleMenuClick = this.handleMenuClick.bind(this);
  }

  handleMenuClick({ key }) {
    if (key === "logout") {
      this.props.onLogout();
    }
  }

  render() {
    const login = <Title level={4}>Login</Title>;
    const signup = <Title level={4}>Signup</Title>;

    let menuItems;

    menuItems = [
      <Menu.Item key="/login" onClick={this.onClose}>
        <Link to="/login">{login}</Link>
      </Menu.Item>,
      <Menu.Item key="/signup" onClick={this.onClose}>
        <Link to="/signup">{signup}</Link>
      </Menu.Item>,
    ];

    return (
      <Header>
        <Menu
          mode="horizontal"
          selectedKeys={[this.props.location.pathname]}
          style={{ lineHeight: "20px" }}
        >
          {menuItems}
        </Menu>
      </Header>
    );
  }
}

export default withRouter(AppHeader);
