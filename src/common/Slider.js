import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import "../styles/style.less";
import { Layout, Menu, Divider, Drawer, Button, Affix, Typography } from "antd";

import {
  AppstoreOutlined,
  ProfileOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  TeamOutlined,
  UserOutlined,
  MenuOutlined,
  IdcardOutlined,
} from "@ant-design/icons";

const { SubMenu } = Menu;
const { Title } = Typography;

class Slider extends Component {
  constructor(props) {
    super(props);
    this.handleMenuClick = this.handleMenuClick.bind(this);
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

  handleMenuClick({ key }) {
    if (key === "logout") {
      this.props.onLogout();
    }
  }

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
    let menuItems,
      authorizedMenuItems,
      userMenuItems,
      adminMenuItems,
      adminMenu;

    var welcome;
    if (currentUser == "visitor") {
      welcome = [<div>Welcome, visitor!</div>];
    }
    //if (currentUser.role == "user") {
    userMenuItems = [
      welcome,
      <Menu.Item
        key="/user/group"
        icon={<TeamOutlined />}
        onClick={this.onClose}
      >
        <Link to={"/user/group"}>My KKC</Link>
      </Menu.Item>,
      <Menu.Item
        key="/store/Shop"
        icon={<AppstoreOutlined />}
        onClick={this.onClose}
      >
        <Link to={"/store/Shop"}>Store</Link>
      </Menu.Item>,
      <Menu.Item key="/user/sessions" onClick={this.onClose}>
        <Link to={"/user/sessions"}>Sessions</Link>
      </Menu.Item>,
      <Menu.Item key="/user/events" onClick={this.onClose}>
        <Link to={"/user/events"}>Events</Link>
      </Menu.Item>,
    ];
    //} else {
    adminMenuItems = [
      <Menu.Item key="/students" icon={<TeamOutlined />} onClick={this.onClose}>
        <Link to={"/students"}>Students</Link>
      </Menu.Item>,

      <Menu.Item key="/tests" icon={<ProfileOutlined />} onClick={this.onClose}>
        <Link to={"/tests"}>Tests</Link>
      </Menu.Item>,
      <Menu.Item
        key="/items"
        icon={<AppstoreOutlined />}
        onClick={this.onClose}
      >
        <Link to={"/items"}>Items</Link>
      </Menu.Item>,
      <SubMenu key="schedule" icon={<CalendarOutlined />} title="Schedule">
        <Menu.Item key="/schedule/calendar" onClick={this.onClose}>
          <Link to={"/schedule/calendar"}>Event Calendar</Link>
        </Menu.Item>
        <Menu.Item key="/schedule/attendance" onClick={this.onClose}>
          <Link to={"/schedule/attendance"}>Attendance</Link>
        </Menu.Item>
        <Menu.Item key="/schedule/Sessions" onClick={this.onClose}>
          <Link to={"/schedule/Sessions"}>Sessions</Link>
        </Menu.Item>
      </SubMenu>,

      <Menu.Item
        key="/locations"
        icon={<EnvironmentOutlined />}
        onClick={this.onClose}
      >
        <Link to={"/locations"}>Locations</Link>
      </Menu.Item>,
    ];

    adminMenu = [
      <SubMenu key="admin" icon={<IdcardOutlined />} title="Admin">
        {adminMenuItems}
      </SubMenu>,
    ];
    //}

    if (this.props.currentUser) {
      menuItems = [
        <SubMenu
          key="profile"
          icon={<UserOutlined />}
          title={this.props.currentUser.name}
        >
          <ProfileDropdownMenu
            currentUser={this.props.currentUser}
            handleMenuClick={this.handleMenuClick}
          />
        </SubMenu>,
      ];
    } else {
      menuItems = [
        <Menu.Item key="/login" onClick={this.onClose}>
          <Link to="/login">Login</Link>
        </Menu.Item>,
        <Menu.Item key="/signup" onClick={this.onClose}>
          <Link to="/signup">Signup</Link>
        </Menu.Item>,
      ];
    }

    const title = [
      <Title style={{ marginBottom: 0, marginTop: 0 }} level={3}>
        Menu
      </Title>,
    ];

    return (
      <div style={{ backgroundColor: "#fefefa", height: 41 }}>
        <Affix offsetTop={0}>
          <Button
            style={{ marginBottom: 20, backgroundColor: "#fefefa" }}
            size="large"
            type="default"
            icon={<MenuOutlined />}
            onClick={this.showDrawer}
          >
            Menu
          </Button>
        </Affix>

        <Drawer
          className="slider"
          title={title}
          placement="left"
          closable={false}
          onClose={this.onClose}
          visible={visible}
          key="placement"
          bodyStyle={{ padding: "0" }}
        >
          <div className="logo" />
          <Menu theme="light" defaultSelectedKeys={["1"]} mode="inline">
            {menuItems}
            <Divider></Divider>
            {userMenuItems}
            {adminMenu}
          </Menu>
        </Drawer>
      </div>
    );
  }
}

/* const dropdownMenu = (
  <Menu title="dan" onClick={props.handleMenuClick} className="profile-dropdown-menu">
    <Menu.Item key="user-info" className="dropdown-item" disabled>
      <div className="user-full-name-info">
        {props.currentUser.name}
      </div>
      <div className="username-info">
        @{props.currentUser.username}
      </div>
    </Menu.Item>
    <Menu.Divider />
    <Menu.Item key="profile" className="dropdown-item">
      <Link to={`/users/${props.currentUser.username}`}>Profile</Link>
    </Menu.Item>
    <Menu.Item key="logout" className="dropdown-item">
      Logout
    </Menu.Item>
  </Menu>
); */

function ProfileDropdownMenu(props) {
  const dropdownMenu = (
    <div>
      <Menu.Item key="user-info" className="dropdown-item" disabled>
        <div className="username-info">{props.currentUser.role}</div>
      </Menu.Item>
      <Menu.Item key="user-info" className="dropdown-item" disabled>
        <div className="username-info">{props.currentUser.username}</div>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="profile" className="dropdown-item">
        <Link to={`/users/${props.currentUser.username}`}>Profile</Link>
      </Menu.Item>
      <Menu.Item key="logout" className="dropdown-item">
        Logout
      </Menu.Item>
    </div>
  );

  return dropdownMenu;
}

export default withRouter(Slider);

{
  /* <SubMenu key="user" icon={<UserOutlined />} title="User">
                            <Menu.Item key="profile" disabled>
                                <div className="user-full-name-info">
                                    {'dan'}
                                </div>
                                <div className="username-info">
                                    @{'dan'}
                                </div>
                            </Menu.Item>
                            <Menu.Divider />
                            <Menu.Item key="/profile">
                                <Link to={`/users/${this.props.currentUser.username}`}>Profile</Link>
                            </Menu.Item>
                            <Menu.Item key="logout" className="dropdown-item">
                                Logout
                        </Menu.Item>
                        </SubMenu> */
}

/*  return (
                          <div style={{ height: '100%', backgroundColor: "blue" }}>
                              <Sider theme="light" style={{
                                //overflow: 'auto',
                                height: '100%',
                                left: 0,
                                position: 'fixed',
                              }} 
                            
                              width='80%' 
                              breakpoint="lg"
                              collapsedWidth="0"
                              onBreakpoint={broken => {
                                console.log(broken);
                              }}
                              onCollapse={(collapsed, type) => {
                                console.log(collapsed, type);
                              }}
              
                              >
                                  <div className="logo" />
                                  <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" >
              
                                  {menuItems}
              
                                      <Divider ></Divider>
              
                                      <SubMenu key="students" icon={<UserOutlined />} title="Students">
                                          <Menu.Item key="/students/NewStudentForm">
                                              <Link to={"/students/NewStudentForm"}>New Student</Link>
                                          </Menu.Item>
                                          <Menu.Item key="/students">
                                              <Link to={"/students"}>View Students</Link>
                                          </Menu.Item>
                                      </SubMenu>
              
                                      <SubMenu key="tests" icon={<TeamOutlined />} title="Tests">
                                          <Menu.Item key="/tests">
                                              <Link to={"/tests"}>View Tests</Link>
                                          </Menu.Item>
                                          <Menu.Item key="/tests/NewTestForm">
                                              <Link to={"/tests/NewTestForm"}>New Test</Link>
                                          </Menu.Item>
                                      </SubMenu>
                                  </Menu>
                              </Sider>
                          </div>
                      );
                  } */
