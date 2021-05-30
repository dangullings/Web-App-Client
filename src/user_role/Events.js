import React, { Component } from "react";
import ReactDOM from "react-dom";
import moment from "moment";
import { getRanks } from "../util/Helpers.js";
import {
  Typography,
  Popconfirm,
  Modal,
  Row,
  Select,
  Divider,
  Space,
  message,
  Image,
  Checkbox,
  notification,
  Col,
  Button,
  Card,
  List,
} from "antd";
import { getAllEventsByDateAsc, getImage } from "../util/APIUtils";
import { Link, withRouter, Route } from "react-router-dom";
import {} from "@ant-design/icons";

import "../styles/style.less";

const { Meta } = Card;

const { Title, Text } = Typography;
const Option = Select.Option;

class Events extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: this.props.currentUser,
      loading: false,
      events: [],
      Images: [],
    };
  }

  componentDidMount() {
    this.getEventList();
  }

  getEventList() {
    let promise;

    promise = getAllEventsByDateAsc();

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
            events: response,
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
    const { events } = this.state;

    var value,
      promises = [],
      imageList = [];

    let event;
    for (event of events) {
      let promise = getImage(event.imageId);
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

  getEventImage(id) {
    const { Images } = this.state;
    let img;
    for (img of Images) {
      if (img.id == id) {
        return img.photo;
      }
    }
  }

  eventCard(event) {
    var date = moment(event.date, "YYYY-MM-DD");

    const title = [
      <Title
        style={{ marginLeft: 0, marginTop: 10, marginBottom: 0 }}
        level={5}
      >
        {event.title}
      </Title>,
    ];

    const dateView = [date.format("dddd, MMMM Do YYYY")];

    const eventCard = [
      <Link to={`/user/events/${event.id}`}>
        <Card
          className="session"
          bordered={false}
          key={event.id}
          headStyle={{ backgroundColor: "#fafafa" }}
          bodyStyle={{ backgroundColor: "#fafafa" }}
          style={{ marginBottom: 50 }}
          cover={
            <Image
              preview={false}
              style={{ "pointer-events": "all" }}
              width={"100%"}
              height={"100%"}
              src={`data:image/jpeg;base64,${this.getEventImage(
                event.imageId
              )}`}
            />
          }
        >
          <Meta title={title} description={dateView} />
        </Card>
      </Link>,
    ];

    return eventCard;
  }

  render() {
    const { loading, currentUser, events } = this.state;

    var eventCards = [];
    if (events) {
      events.forEach((event) => {
        eventCards.push(this.eventCard(event));
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
          dataSource={eventCards}
          renderItem={(item) => <List.Item>{item}</List.Item>}
        />
      </Card>
    );
  }

  selectEvent(event) {
    console.log(" event detail " + event.id);
    this.props.history.push(`/user/events/${event.id}`);
  }

  loadEvent(event) {
    const { selectedEvent } = this.state;

    console.log(" event detail " + event.id);
    this.props.history.push(`/user/events/${event.id}`);
    //<Link to={`/user/events/${event}`}></Link>;
  }

  handleToken(token, addresses) {
    console.log(token, addresses);
  }
}

export default withRouter(Events);
