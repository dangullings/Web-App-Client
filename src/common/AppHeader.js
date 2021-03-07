import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";

import { Layout, Menu } from "antd";

const Header = Layout.Header;

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
    let menuItems;

    menuItems = [
      <Menu.Item key="/login" onClick={this.onClose}>
        <Link to="/login">Login</Link>
      </Menu.Item>,
      <Menu.Item key="/signup" onClick={this.onClose}>
        <Link to="/signup">Signup</Link>
      </Menu.Item>,
    ];

    return (
      <Header>
        <Menu
          className="app-menu"
          mode="horizontal"
          selectedKeys={[this.props.location.pathname]}
          style={{ lineHeight: "2px" }}
        >
          {menuItems}
        </Menu>
      </Header>
    );
  }
}

export default withRouter(AppHeader);
