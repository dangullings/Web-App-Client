import React, { Component } from "react";
import moment from "moment";
import { Typography, Image, Card, List } from "antd";
import { getAllSessionsByDateAsc, getImage } from "../util/APIUtils";
import { withRouter, Link } from "react-router-dom";
import "../styles/style.less";

const { Meta } = Card;
const { Title } = Typography;

class Sessions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: this.props.currentUser,
      loading: false,
      sessions: [],
      Images: [],
    };
  }

  componentDidMount() {
    this.getSessionList();
  }

  getSessionList() {
    let promise;

    promise = getAllSessionsByDateAsc();

    if (!promise) {
      return;
    }

    this.setState({
      loading: true,
    });

    promise
      .then((response) => {
        this.setState(
          {
            sessions: response,
          },
          () => this.getImages()
        );
      })
      .catch((error) => {
        this.setState({
          loading: false,
        });
      });
  }

  getImages() {
    const { sessions } = this.state;

    var value,
      promises = [],
      imageList = [];

    let session;
    for (session of sessions) {
      let promise = getImage(session.imageId);
      promises.push(promise);
    }

    let con;
    Promise.all(promises).then((values) => {
      for (value of values) {
        imageList.push(value);
      }
      this.setState({
        Images: imageList,
        loading: false,
      });
    });
  }

  getSessionImage(id) {
    const { Images } = this.state;
    let img;
    for (img of Images) {
      if (img.id == id) {
        return img.photo;
      }
    }
  }

  sessionCard(session) {
    var startDate = moment(session.startDate, "YYYY-MM-DD");
    var endDate = moment(session.endDate, "YYYY-MM-DD");

    const title = [
      <Title
        style={{ marginLeft: 0, marginTop: 10, marginBottom: 0 }}
        level={5}
      >
        {session.title}
      </Title>,
    ];

    const dateView = [
      startDate.format("MMMM Do YYYY") + " - " + endDate.format("MMMM Do YYYY"),
    ];

    const sessionCard = [
      <Link to={`/user/sessions/${session.id}`}>
        <Card
          className="session"
          bordered={false}
          key={session.id}
          headStyle={{ backgroundColor: "#fafafa" }}
          bodyStyle={{ backgroundColor: "#fafafa" }}
          style={{ marginBottom: 50 }}
          cover={
            <Image
              preview={false}
              style={{ "pointer-events": "all" }}
              width={"100%"}
              height={"100%"}
              src={`data:image/jpeg;base64,${this.getSessionImage(
                session.imageId
              )}`}
            />
          }
        >
          <Meta title={title} description={dateView} />
        </Card>
      </Link>,
    ];

    return sessionCard;
  }

  render() {
    const { loading, sessions } = this.state;

    var sessionCards = [];
    if (sessions) {
      sessions.forEach((session) => {
        sessionCards.push(this.sessionCard(session));
      });
    }

    return (
      <Card
        bordered={false}
        loading={loading}
        bodyStyle={{ padding: 25 }}
        style={{
          width: "100%",
        }}
      >
        <List
          grid={{
            gutter: 16,
            xs: 1,
            sm: 2,
            md: 3,
            lg: 4,
            xl: 5,
            xxl: 6,
          }}
          dataSource={sessionCards}
          renderItem={(item) => <List.Item>{item}</List.Item>}
        />
      </Card>
    );
  }
}

export default withRouter(Sessions);
