import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import "./AppHeader.css";
import { Layout, Menu, Dropdown, Icon } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoffee } from "@fortawesome/free-solid-svg-icons";

const element = <FontAwesomeIcon icon={faCoffee} />;
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
      <Header className="app-header">
        <div className="container">
          <Menu
            className="app-menu"
            mode="horizontal"
            selectedKeys={[this.props.location.pathname]}
            style={{ lineHeight: "2px" }}
          >
            {menuItems}
          </Menu>
        </div>
      </Header>
    );
  }
}

export default withRouter(AppHeader);
