import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import AppHeader from "../common/AppHeader";
import "../styles/style.less";
import { Menu, Drawer, Button, Affix, Typography } from "antd";

import {
  ShopOutlined,
  AppstoreOutlined,
  ProfileOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  MenuOutlined,
  IdcardOutlined,
  ShoppingOutlined,
  TeamOutlined,
  LogoutOutlined,
  CarryOutOutlined,
  FormOutlined,
  DollarOutlined,
} from "@ant-design/icons";

const { SubMenu } = Menu;
const { Title } = Typography;

class Slider extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUser: this.props.currentUser || "visitor",
      isAuthenticated: false,
      isLoading: false,
      collapsed: false,
      visible: this.props.visible,
    };
  }

  componentDidMount() {
    this.setState({
      visible: this.props.visible,
    });
  }

  sliderLogout = () => {
    this.props.appLogout();
  };

  onCollapse = (collapsed) => {
    console.log(collapsed);
    this.setState({ collapsed });
  };

  showDrawer = () => {
    this.setState({
      visible: true,
    });
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  onChange = (e) => {
    this.setState({
      placement: e.target.value,
    });
  };

  render() {
    const { visible, currentUser } = this.state;
    let menuItems, userMenuItems, adminMenuItems, adminMenu;

    if (currentUser.role == "user") {
      userMenuItems = [
        <Menu.Item
          className="menu-item"
          icon={<LogoutOutlined rotate={180} />}
          onClick={this.sliderLogout}
        >
          Logout
        </Menu.Item>,
        <Menu.Item
          className="menu-item"
          key="/user/group"
          icon={<TeamOutlined />}
          onClick={this.onClose}
        >
          <Link to={"/user/group"}>My Group</Link>
        </Menu.Item>,
        <Menu.Item
          className="menu-item"
          key="/store/Shop"
          icon={<ShopOutlined />}
          onClick={this.onClose}
        >
          <Link to={"/store/Shop"}>Store</Link>
        </Menu.Item>,
        <Menu.Item
          icon={<ProfileOutlined />}
          className="menu-item"
          key="/user/sessions"
          onClick={this.onClose}
        >
          <Link to={"/user/sessions"}>Sessions</Link>
        </Menu.Item>,
        <Menu.Item
          icon={<ProfileOutlined />}
          className="menu-item"
          key="/user/events"
          onClick={this.onClose}
        >
          <Link to={"/user/events"}>Events</Link>
        </Menu.Item>,
        <Menu.Item
          className="menu-item"
          key="/schedule/calendar"
          icon={<FormOutlined />}
          onClick={this.onClose}
        >
          <Link to={"/schedule/calendar"}>Calendar</Link>
        </Menu.Item>,
        <Menu.Item
          className="menu-item"
          key="/blog"
          icon={<FormOutlined />}
          onClick={this.onClose}
        >
          <Link to={"/blog"}>Blog</Link>
        </Menu.Item>,
      ];
    } else {
      userMenuItems = [
        <Menu.Item
          className="menu-item"
          icon={<LogoutOutlined rotate={180} />}
          onClick={this.sliderLogout}
        >
          Logout
        </Menu.Item>,
        <Menu.Item
          className="menu-item"
          key="/user/group"
          icon={<TeamOutlined />}
          onClick={this.onClose}
        >
          <Link to={"/user/group"}>My Group</Link>
        </Menu.Item>,
        <Menu.Item
          className="menu-item"
          key="/store/Shop"
          icon={<ShopOutlined />}
          onClick={this.onClose}
        >
          <Link to={"/store/Shop"}>Store</Link>
        </Menu.Item>,
        <Menu.Item
          icon={<ProfileOutlined />}
          className="menu-item"
          key="/user/sessions"
          onClick={this.onClose}
        >
          <Link to={"/user/sessions"}>Sessions</Link>
        </Menu.Item>,
        <Menu.Item
          icon={<ProfileOutlined />}
          className="menu-item"
          key="/user/events"
          onClick={this.onClose}
        >
          <Link to={"/user/events"}>Events</Link>
        </Menu.Item>,
        <Menu.Item
          className="menu-item"
          key="/schedule/calendar"
          icon={<CalendarOutlined />}
          onClick={this.onClose}
        >
          <Link to={"/schedule/calendar"}>Calendar</Link>
        </Menu.Item>,
        <Menu.Item
          className="menu-item"
          key="/blog"
          icon={<FormOutlined />}
          onClick={this.onClose}
        >
          <Link to={"/blog"}>Blog</Link>
        </Menu.Item>,
      ];
      adminMenuItems = [
        <Menu.Item
          className="menu-item"
          key="/students"
          icon={<TeamOutlined />}
          onClick={this.onClose}
        >
          <Link to={"/students"}>Students</Link>
        </Menu.Item>,
        <SubMenu key="schedule" icon={<CalendarOutlined />} title="Schedule">
          <Menu.Item
            className="menu-item"
            key="/schedule/attendance"
            icon={<CarryOutOutlined />}
            onClick={this.onClose}
          >
            <Link to={"/schedule/attendance"}>Attendance</Link>
          </Menu.Item>
          <Menu.Item
            className="menu-item"
            key="/schedule/Sessions"
            icon={<ProfileOutlined />}
            onClick={this.onClose}
          >
            <Link to={"/schedule/Sessions"}>Sessions</Link>
          </Menu.Item>
          <Menu.Item
            className="menu-item"
            key="/schedule/Events"
            icon={<ProfileOutlined />}
            onClick={this.onClose}
          >
            <Link to={"/schedule/Events"}>Events</Link>
          </Menu.Item>
        </SubMenu>,
        <Menu.Item
          className="menu-item"
          key="/tests"
          icon={<ProfileOutlined />}
          onClick={this.onClose}
        >
          <Link to={"/tests"}>Tests</Link>
        </Menu.Item>,
        <Menu.Item
          className="menu-item"
          key="/orders"
          icon={<ShoppingOutlined />}
          onClick={this.onClose}
        >
          <Link to={"/orders"}>Orders</Link>
        </Menu.Item>,
        <Menu.Item
          className="menu-item"
          key="/items"
          icon={<AppstoreOutlined />}
          onClick={this.onClose}
        >
          <Link to={"/items"}>Items</Link>
        </Menu.Item>,
        <Menu.Item
          className="menu-item"
          key="/locations"
          icon={<EnvironmentOutlined />}
          onClick={this.onClose}
        >
          <Link to={"/locations"}>Locations</Link>
        </Menu.Item>,

        <Menu.Item
          className="menu-item"
          key="/users"
          icon={<TeamOutlined />}
          onClick={this.onClose}
        >
          <Link to={"/users"}>Users</Link>
        </Menu.Item>,

        <Menu.Item
          className="menu-item"
          key="/blogs"
          icon={<FormOutlined />}
          onClick={this.onClose}
        >
          <Link to={"/blogs"}>Blog</Link>
        </Menu.Item>,

        <Menu.Item
          className="menu-item"
          key="/budget"
          icon={<DollarOutlined />}
          onClick={this.onClose}
        >
          <Link to={"/budget"}>Budget</Link>
        </Menu.Item>,
      ];

      adminMenu = [
        <SubMenu key="admin" icon={<IdcardOutlined />} title="Admin">
          {adminMenuItems}
        </SubMenu>,
      ];
    }

    const title = [
      <Title
        style={{ marginBottom: 0, marginTop: 0, color: "white" }}
        level={3}
      >
        Company Name
      </Title>,
    ];

    const profile = [
      <div className="container app-header">
        <AppHeader
          isAuthenticated={this.state.isAuthenticated}
          currentUser={this.state.currentUser}
          parentLogout={this.sliderLogout}
        />
      </div>,
    ];

    const content = [
      <div className="container">
        <div className="slider">
          <Affix offsetTop={0}>
            <Button
              style={{
                marginBottom: 10,
                marginLeft: 6,
                marginTop: 4,
                backgroundColor: "#fefefa",
                boxShadow:
                  "0 2px 4px 0 rgba(0, 0, 0, 0.4), 0 4px 6px 0 rgba(0, 0, 0, 0.39)",
              }}
              size="large"
              type="default"
              icon={<MenuOutlined />}
              onClick={this.showDrawer}
            ></Button>
          </Affix>

          <Drawer
            title={title}
            placement="left"
            closable={false}
            onClose={this.onClose}
            visible={visible}
            key="placement"
            bodyStyle={{ padding: "0" }}
            className="custom-style"
          >
            <Menu theme="light" defaultSelectedKeys={["1"]} mode="inline">
              {menuItems}
              {userMenuItems}
              {adminMenu}
            </Menu>
          </Drawer>
        </div>
        {profile}
      </div>,
    ];
    // #fefefa
    return content;
  }
}

export default withRouter(Slider);
