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
import {
  getAllEventsByDate,
  getMyPeeps,
  createStudentEvent,
  getStudentEvents,
  getImage,
} from "../util/APIUtils";
import { Link, withRouter, Route } from "react-router-dom";
import StripeContainer from "../stripe/StripeContainer";
import {
  SaveOutlined,
  DeleteOutlined,
  ReloadOutlined,
  CarryOutOutlined,
  PlusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";

import EventDetail from "../user_role/EventDetail";

import bg from "../img/Session.png";
//import bg from "../img/MainBackground.jpg";
import "../styles/style.less";

import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const { Meta } = Card;

const layout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 12,
  },
};

const ranks = getRanks();
const { Title, Text } = Typography;
const Option = Select.Option;

class Events extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: this.props.currentUser,
      loading: false,
      visible: false,
      events: [],
      myPeeps: [],
      peepEvents: [],
      signedUpPeeps: [],
      Images: [],
      eventSignupPrice: "0",
      eventSignupVisible: false,
      selectedEvent: "",
    };

    this.onChange = this.onChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.getEventList();
    //this.getMyPeepsList();
  }

  getEventList() {
    let promise;

    promise = getAllEventsByDate();

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
            loading: false,
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

  getMyPeepsList() {
    let promise;
    promise = getMyPeeps(this.state.currentUser.id); // this.state.currentUser.id
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
            myPeeps: response,
            loading: false,
          },
          () => this.cycleThruPeeps(response)
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
        console.log("value " + value.name);
        imageList.push(value);
        //for (con of value.content) {
        //  imageList.push(con);
        //}
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
    const ages = [
      <Row>
        <Space size="small">
          <Text
            style={{ textShadow: "0px 1px 0px rgba(255,255,255,0.9)" }}
            type="secondary"
          >
            ages:{" "}
          </Text>
          <Text
            style={{ textShadow: "0px 1px 0px rgba(255,255,255,0.9)" }}
            strong
          >
            {event.ageRange}
          </Text>
        </Space>
      </Row>,
    ];
    const ranks = [
      <Row>
        <Space size="small">
          <Text
            style={{ textShadow: "0px 1px 0px rgba(255,255,255,0.9)" }}
            type="secondary"
          >
            rank range:{" "}
          </Text>
          <Text
            style={{ textShadow: "0px 1px 0px rgba(255,255,255,0.9)" }}
            strong
          >
            {event.rankRange}
          </Text>
        </Space>
      </Row>,
    ];
    const description = [
      <Text strong style={{ textShadow: "0px 1px 0px rgba(255,255,255,0.9)" }}>
        {event.description}
      </Text>,
    ];
    const location = [
      <Row>
        <Space size="small">
          <Text
            style={{ textShadow: "0px 1px 0px rgba(255,255,255,0.9)" }}
            type="secondary"
          >
            location:{" "}
          </Text>
          <Text
            style={{ textShadow: "0px 1px 0px rgba(255,255,255,0.9)" }}
            strong
          >
            {event.location}
          </Text>
        </Space>
      </Row>,
    ];
    const price = [<Text strong>${event.price}</Text>];
    const signupBtn = [
      <Button
        type="primary"
        size="large"
        onClick={this.showEventSignupModal(event)}
        style={{
          borderRadius: "6px",
          marginTop: "20px",
          width: "100%",
        }}
      >
        Signup
      </Button>,
    ];
    // {location}
    // {ages}
    // {ranks}
    // {price}
    // {description}
    // {signupBtn}

    ///mypeeps/${this.state.myPeeps}
    //this.props.history.push(`/students/${student.id}`);

    //<Link to={`/user/events/${event}`}></Link>
    const eventCard = [
      //<div onClick={(event) => this.selectEvent(event)}>
      <Link to={`/user/events/${event.id}`}>
        <Card
          className="event"
          hoverable
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
      //</div>,
    ];

    return eventCard;
  }

  handleOk = () => {
    this.setState({
      loading: false,
      eventSignupVisible: false,
    });
  };

  handleCancel = () => {
    this.setState({
      loading: false,
      eventSignupVisible: false,
      signedUpPeeps: [],
      eventSignupPrice: 0,
    });
  };

  onChange(checkedValues) {
    this.setState({
      signedUpPeeps: checkedValues,
      eventSignupPrice: this.state.selectedEvent.price * checkedValues.length,
    });
  }

  cycleThruPeeps(peeps) {
    let peep;
    for (peep of peeps) {
      this.getAllPeepEvents(peep);
    }
  }

  getAllPeepEvents(peep) {
    this.state.peepEvents.length = 0;
    var peepEvents = [];

    let promise = getStudentEvents(peep.id);

    promise.then((response) => {
      let value;
      for (value of response) {
        const peepEvent = {
          peepId: peep.id,
          eventId: value.id,
        };
        peepEvents.push(peepEvent);
      }
      this.setState({
        peepEvents: this.state.peepEvents.concat(peepEvents),
      });
    });
  }

  getEventSignupForm(event) {
    const { peepEvents } = this.state;

    if (!event) {
      return;
    }

    var rank, age;
    let eventRankRange = event.rankRange.split("-");
    let low = eventRankRange[0];
    let high = eventRankRange[1];
    let ranksAllowed = [];
    let blip = false;
    for (rank of ranks) {
      if (rank == low) {
        blip = true;
      }

      if (blip) {
        ranksAllowed.push(rank);
      }

      if (rank == high) {
        blip = false;
      }
    }

    let ages = [];
    for (let i = 0; i < 100; i++) {
      ages.push(i);
    }
    let eventAgeRange = event.ageRange.split("-");
    let lowAge = eventAgeRange[0];
    let highAge = eventAgeRange[1];
    let agesAllowed = [];
    blip = false;
    for (age of ages) {
      if (age == lowAge) {
        blip = true;
      }

      if (blip) {
        agesAllowed.push(age);
      }

      if (age == highAge) {
        blip = false;
      }
    }

    const { myPeeps } = this.state;

    var myPeepOptions = [];
    let peep,
      notAllowedRank = true,
      notAllowedAge = true;
    for (peep of myPeeps) {
      let peepAge = moment().diff(peep.birthDate, "years");
      notAllowedRank = true;
      notAllowedAge = true;
      for (rank of ranksAllowed) {
        if (peep.ranks == rank) {
          notAllowedRank = false;
          break;
        }
      }

      for (age of agesAllowed) {
        if (peepAge == age) {
          notAllowedAge = false;
          break;
        }
      }

      let notAllowed = false;
      if (notAllowedAge || notAllowedRank) {
        notAllowed = true;
      }

      let pe;
      for (pe of peepEvents) {
        console.log("pe " + pe.peepId + " " + pe.eventId);
        if (pe.eventId == event.id) {
          if (pe.peepId == peep.id) {
            notAllowed = true;
            break;
          }
        }
      }

      let lastLetter = peep.lastName.split("");
      let p = {
        label:
          peep.firstName +
          " " +
          lastLetter[0] +
          ".   |   " +
          peepAge +
          " yrs old   |   " +
          peep.ranks +
          "",
        value: peep.id,
        disabled: notAllowed,
      };

      myPeepOptions.push(p);
    }

    const signupForm = [
      <Divider orientation="left">Select signups</Divider>,
      <Checkbox.Group
        style={{ marginLeft: 15, marginBottom: 15 }}
        options={myPeepOptions}
        onChange={this.onChange}
        value={this.state.signedUpPeeps}
      >
        <Space>{myPeepOptions}</Space>
      </Checkbox.Group>,
      <Text strong style={{ marginLeft: 5 }}>
        TOTAL: ${this.state.eventSignupPrice}
      </Text>,
    ];

    return signupForm;
  }

  showEventSignupModal = (event) => (e) => {
    this.setState({
      eventSignupVisible: true,
      selectedEvent: event,
      signedUpPeeps: [],
    });
  };

  handleSubmit(event) {
    const { signedUpPeeps, selectedEvent } = this.state;
    this.setState({
      loading: true,
    });

    let peep;
    for (peep of signedUpPeeps) {
      const data = {
        calendarEventId: selectedEvent.id,
        studentId: peep,
        charged: selectedEvent.price,
        paid: 0,
        signupDate: moment().format("YYYY-MM-DD"),
      };

      createStudentEvent(data)
        .then((response) => {
          this.setState({
            loading: false,
            eventSignupVisible: false,
            signedUpPeeps: [],
            selectedEvent: "",
          });
          notification.success({
            message: "Signup Successful!",
            description: "",
            duration: 4,
          });
          this.cycleThruPeeps(this.state.myPeeps);
        })
        .catch((error) => {
          this.setState({
            loading: false,
          });
          if (error.status === 401) {
          } else {
          }
        });
    }
  }

  isFormInvalid() {
    if (this.state.signedUpPeeps.length == 0) {
      return true;
    }

    return false;
  }

  render() {
    // <Image className="card-content-image" src={bg} />
    const {
      visible,
      loading,
      currentUser,
      events,
      eventSignupVisible,
      selectedEvent,
      myPeeps,
    } = this.state;

    var eventCards = [];
    if (events) {
      events.forEach((event) => {
        eventCards.push(this.eventCard(event));
      });
    }

    const stripeView = [
      <div className="session" style={{ paddingLeft: 15, paddingRight: 15 }}>
        <StripeContainer />
      </div>,
    ];

    const title = [
      <Title level={3}>
        <div>Events</div>
      </Title>,
    ];

    const eventModalTitle = [<Title level={2}>{selectedEvent.title}</Title>];

    return (
      <div>
        <Card
          bordered={false}
          bodyStyle={{ padding: 25 }}
          style={{
            width: "100%",
          }}
          title={title}
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
        <Modal
          className="event"
          visible={eventSignupVisible}
          title={eventModalTitle}
          style={{ top: 0 }}
          bodyStyle={{ padding: 4, marginBottom: 0 }}
          footer={[
            <Button
              key="back"
              type="secondary"
              onClick={this.handleCancel}
              style={{
                boxShadow: "0px 0px 5px rgba(0,0,0,0.2)",
              }}
            >
              Cancel
            </Button>,
            <Button
              key="submit"
              type="primary"
              icon={<SaveOutlined />}
              disabled={this.isFormInvalid()}
              loading={loading}
              onClick={this.handleSubmit}
              style={{
                boxShadow: "0px 0px 5px rgba(0,0,0,0.2)",
              }}
            >
              Submit
            </Button>,
          ]}
        >
          {this.getEventSignupForm(selectedEvent)}
          <Divider orientation="left">Payment</Divider>
          {stripeView}
        </Modal>
      </div>
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
