import React, { Component } from "react";
import "../styles/style.less";
import { Route, Link, withRouter, Switch } from "react-router-dom";

import { Image, message } from "antd";
import { getCurrentUser, getUserProfile } from "../util/APIUtils";
import { ACCESS_TOKEN } from "../constants";

import Home from "../common/Home";
import MyGroup from "../user_role/MyGroup";
import Sessions from "../user_role/Sessions";
import SessionDetail from "../user_role/SessionDetail";
import Events from "../user_role/Events";
import EventDetail from "../user_role/EventDetail";
import OrderList from "../inventory/OrderList";
import Order from "../inventory/Order";
import EventCalendar from "../schedule/EventCalendar";
import LocationList from "../location/LocationList";
import SessionList from "../schedule/SessionList";
import EventList from "../schedule/EventList";
import NewSession from "../schedule/NewSession";
import Session from "../schedule/Session";
import Attendance from "../schedule/Attendance";
import TestList from "../test/TestList";
import Products from "../store/Products";
import Shop from "../store/Shop";
import ItemList from "../inventory/ItemList";
import UserList from "../user/UserList";
import StudentList from "../student/StudentList";
import Student from "../student/Student";
import Login from "../user/login/Login";
import LoginForm from "../user/login/Login";
import Signup from "../user/signup/Signup";
import Profile from "../user/profile/Profile";
import AppHeader from "../common/AppHeader";
import Slider from "../common/Slider";
import NotFound from "../common/NotFound";
import LoadingIndicator from "../common/LoadingIndicator";
import PrivateRoute from "../common/PrivateRoute";
import Footer from "../common/Footer";

import { Layout, notification, Menu } from "antd";

const { Header, Content, Sider } = Layout;
const { SubMenu } = Menu;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: null,
      isAuthenticated: false,
      isLoading: false,
    };
    this.handleLogout = this.handleLogout.bind(this);
    this.loadCurrentUser = this.loadCurrentUser.bind(this);
    this.handleLogin = this.handleLogin.bind(this);

    notification.config({
      placement: "topRight",
      top: 70,
      duration: 2,
    });
  }

  componentDidMount() {
    this.loadCurrentUser();
  }

  handleLogout = () => {
    notification.success({
      message: "Dans App",
      description: "You're successfully logged out.",
      duration: 2,
    });
    localStorage.removeItem(ACCESS_TOKEN);

    this.setState({
      currentUser: "null",
      isAuthenticated: false,
    });

    this.props.history.push("/");
  };

  loadCurrentUser() {
    this.setState({
      isLoading: true,
    });
    getCurrentUser()
      .then((response) => {
        this.setState(
          {
            currentUser: response,
            isAuthenticated: true,
          },
          () => this.loadCurrentProfile()
        );
      })
      .catch((error) => {
        this.setState({
          isLoading: false,
        });
      });
  }

  loadCurrentProfile() {
    getUserProfile(this.state.currentUser.username)
      .then((response) => {
        this.setState({
          currentUser: response,
          isLoading: false,
        });
      })
      .catch((error) => {
        this.setState({
          isLoading: false,
        });
      });
  }

  handleLogin() {
    notification.success({
      message: "Dans App",
      description: "You're successfully logged in.",
      duration: 2,
    });
    this.loadCurrentUser();
    this.props.history.push("/");
  }

  render() {
    if (this.state.isLoading) {
      return <LoadingIndicator />;
    }
    const isLoggedIn = this.state.isAuthenticated;
    const isGood = this.state.currentUser;

    console.log("logged " + isLoggedIn);
    if (isGood) {
      console.log("render current name " + this.state.currentUser.role);
    }
    return (
      <Layout>
        {isLoggedIn ? (
          <div></div>
        ) : (
          <AppHeader
            isAuthenticated={this.state.isAuthenticated}
            currentUser={this.state.currentUser}
          />
        )}

        {isLoggedIn ? (
          <Slider
            isAuthenticated={this.state.isAuthenticated}
            currentUser={this.state.currentUser}
            appLogout={this.handleLogout}
          ></Slider>
        ) : (
          <div></div>
        )}

        <Content
          bodyStyle={{ padding: 0 }}
          style={{
            backgroundColor: "white",
            width: "100%",
          }}
        >
          <div>
            <Switch>
              <Route exact path="/" render={(isLoggedIn) => <Home />}></Route>
              <Route
                exact
                path="/schedule/calendar"
                authenticated={this.state.isAuthenticated}
                render={(props) => (
                  <EventCalendar
                    isAuthenticated={this.state.isAuthenticated}
                    currentUser={this.state.currentUser}
                    {...props}
                  />
                )}
              ></Route>
              <Route
                exact
                path="/schedule/attendance"
                authenticated={this.state.isAuthenticated}
                render={(props) => (
                  <Attendance
                    isAuthenticated={this.state.isAuthenticated}
                    currentUser={this.state.currentUser}
                    {...props}
                  />
                )}
              ></Route>
              <Route
                exact
                path="/schedule/sessions"
                authenticated={this.state.isAuthenticated}
                render={(props) => (
                  <SessionList
                    isAuthenticated={this.state.isAuthenticated}
                    currentUser={this.state.currentUser}
                    {...props}
                  />
                )}
              ></Route>
              <Route
                exact
                path="/schedule/events"
                authenticated={this.state.isAuthenticated}
                render={(props) => (
                  <EventList
                    isAuthenticated={this.state.isAuthenticated}
                    currentUser={this.state.currentUser}
                    {...props}
                  />
                )}
              ></Route>
              <Route
                exact
                path="/students"
                authenticated={this.state.isAuthenticated}
                render={(props) => (
                  <StudentList
                    isAuthenticated={this.state.isAuthenticated}
                    currentUser={this.state.currentUser}
                    {...props}
                  />
                )}
              ></Route>
              <Route
                exact
                path="/tests"
                authenticated={this.state.isAuthenticated}
                render={(props) => (
                  <TestList
                    isAuthenticated={this.state.isAuthenticated}
                    currentUser={this.state.currentUser}
                    {...props}
                  />
                )}
              ></Route>
              <Route
                exact
                path="/items"
                render={(props) => (
                  <ItemList
                    isAuthenticated={this.state.isAuthenticated}
                    currentUser={this.state.currentUser}
                    {...props}
                  />
                )}
              ></Route>
              <Route
                exact
                path="/store/Products"
                render={(props) => (
                  <Products
                    isAuthenticated={this.state.isAuthenticated}
                    currentUser={this.state.currentUser}
                    {...props}
                  />
                )}
              ></Route>
              <Route
                exact
                path="/store/Shop"
                render={(props) => (
                  <Shop
                    isAuthenticated={this.state.isAuthenticated}
                    currentUser={this.state.currentUser}
                    {...props}
                  />
                )}
              ></Route>
              <Route
                exact
                path="/orders"
                render={(props) => (
                  <OrderList
                    isAuthenticated={this.state.isAuthenticated}
                    currentUser={this.state.currentUser}
                    {...props}
                  />
                )}
              ></Route>
              <Route
                exact
                path="/user/group"
                render={(props) => (
                  <MyGroup
                    isAuthenticated={this.state.isAuthenticated}
                    currentUser={this.state.currentUser}
                    {...props}
                  />
                )}
              ></Route>
              <Route
                exact
                path="/user/sessions"
                render={(props) => (
                  <Sessions
                    isAuthenticated={this.state.isAuthenticated}
                    currentUser={this.state.currentUser}
                    {...props}
                  />
                )}
              ></Route>
              <Route
                exact
                path="/user/events"
                render={(props) => (
                  <Events
                    isAuthenticated={this.state.isAuthenticated}
                    currentUser={this.state.currentUser}
                    {...props}
                  />
                )}
              ></Route>
              <Route
                exact
                path="/users"
                render={(props) => (
                  <UserList
                    isAuthenticated={this.state.isAuthenticated}
                    currentUser={this.state.currentUser}
                    {...props}
                  />
                )}
              ></Route>
              <Route
                exact
                path="/locations"
                render={(props) => (
                  <LocationList
                    isAuthenticated={this.state.isAuthenticated}
                    currentUser={this.state.currentUser}
                    {...props}
                  />
                )}
              ></Route>
              <Route
                path="/login"
                render={(props) => (
                  <Login onLogin={this.handleLogin} {...props} />
                )}
              ></Route>
              <Route path="/signup" component={Signup}></Route>
              <Route
                path="/users/:username"
                render={(props) => (
                  <Profile
                    isAuthenticated={this.state.isAuthenticated}
                    currentUser={this.state.currentUser}
                    {...props}
                  />
                )}
              ></Route>
              <Route
                path="/users/:username/group"
                render={(props) => (
                  <MyGroup
                    isAuthenticated={this.state.isAuthenticated}
                    currentUser={this.state.currentUser}
                    {...props}
                  />
                )}
              ></Route>
              <Route
                authenticated={this.state.isAuthenticated}
                path="/attendance/NewSession"
                component={NewSession}
              ></Route>
              <Route
                path="/sessions/:id"
                render={(props) => (
                  <Session
                    isAuthenticated={this.state.isAuthenticated}
                    currentUser={this.state.currentUser}
                    {...props}
                  />
                )}
              ></Route>
              <Route
                path="/students/:id"
                render={(props) => (
                  <Student
                    isAuthenticated={this.state.isAuthenticated}
                    currentUser={this.state.currentUser}
                    {...props}
                  />
                )}
              ></Route>
              <Route
                path="/user/events/:id"
                render={(props) => (
                  <EventDetail
                    isAuthenticated={this.state.isAuthenticated}
                    currentUser={this.state.currentUser}
                    {...props}
                  />
                )}
              ></Route>
              <Route
                path="/user/sessions/:id"
                render={(props) => (
                  <SessionDetail
                    isAuthenticated={this.state.isAuthenticated}
                    currentUser={this.state.currentUser}
                    {...props}
                  />
                )}
              ></Route>
              <Route
                path="/orders/:id"
                render={(props) => (
                  <Order
                    isAuthenticated={this.state.isAuthenticated}
                    currentUser={this.state.currentUser}
                    {...props}
                  />
                )}
              ></Route>
            </Switch>
          </div>
        </Content>

        {/* <Content style={{ margin: '0 16px' }}>
            <Breadcrumb style={{ margin: '16px 0' }}>
              <Breadcrumb.Item>User</Breadcrumb.Item>
              <Breadcrumb.Item>Bill</Breadcrumb.Item>
            </Breadcrumb>
            <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
              Bill is a cat.
            </div>
          </Content> */}

        <Footer></Footer>
      </Layout>
    );
  }
}

export default withRouter(App);
