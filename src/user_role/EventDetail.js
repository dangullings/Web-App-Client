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
  getMyPeeps,
  createStudentEvent,
  getEvent,
  getImage,
  getLocationByName,
} from "../util/APIUtils";
import { Link, withRouter } from "react-router-dom";
import StripeContainer from "../stripe/StripeContainer";
import {
  SaveOutlined,
  DeleteOutlined,
  ReloadOutlined,
  CarryOutOutlined,
  PlusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";

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

const ranks = getRanks();
const { Title, Text } = Typography;
const Option = Select.Option;

class EventDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: this.props.currentUser,
      loading: false,

      event: "",
      myPeeps: [],
      image: "",
      location: "",
      signedUpPeeps: [],
      eventSignupPrice: "0",
      eventSignupVisible: false,
    };

    this.onChange = this.onChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.loadEvent(this.props.match.params.id);
    //this.getMyPeepsList();
  }

  loadEvent(id) {
    console.log("id " + id);

    getEvent(id)
      .then((response) => {
        this.setState(
          {
            event: response,
          },
          () => this.loadImage(response)
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
        this.setState({
          myPeeps: response,
          loading: false,
        });
      })
      .catch((error) => {
        this.setState({
          loading: false,
        });
      });
  }

  loadImage(event) {
    let promise = getImage(event.imageId);

    promise
      .then((response) => {
        this.setState({
          image: response,
          loading: false,
        });
      })
      .catch((error) => {
        this.setState({
          loading: false,
        });
      });
  }

  eventCard(event) {
    const { image } = this.state;

    var date = moment(event.date, "YYYY-MM-DD");

    const title = [event.title];

    const dateView = [date.format("dddd, MMMM Do YYYY")];
    const time = [event.startTime + " - " + event.endTime];
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
    const description = [event.description];
    const location = [event.location];
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

    const eventCard = [
      <Card
        className="event-detail"
        hoverable
        bordered={false}
        key={event.id}
        headStyle={{ backgroundColor: "#fafafa" }}
        bodyStyle={{ backgroundColor: "#fafafa" }}
        style={{ marginBottom: 40 }}
        cover={
          <Image
            width={"100%"}
            height={"100%"}
            src={`data:image/jpeg;base64,${image.photo}`}
          />
        }
      >
        <div className="event-detail title">{title}</div>
        <div className="event-detail title-gray">DATE</div>
        <div className="event-detail sub-title">
          <div>{dateView}</div>
          <div>{time}</div>
        </div>
        <div className="event-detail title-gray">LOCATION</div>
        <div className="event-detail sub-title">{location}</div>
        <div className="event-detail title-black">Details</div>
        <div className="event-detail details">{description}</div>
      </Card>,
    ];

    console.log("event " + event.title);

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

  handleSubmit() {
    const { signedUpPeeps, event } = this.state;
    this.setState({
      loading: true,
    });

    let peep;
    for (peep of signedUpPeeps) {
      const data = {
        calendarEventId: event.id,
        studentId: peep,
        charged: event.price,
        paid: 0,
        signupDate: moment().format("YYYY-MM-DD"),
      };

      createStudentEvent(data)
        .then((response) => {
          this.setState({
            loading: false,
            eventSignupVisible: false,
            signedUpPeeps: [],
            event: "",
          });
          notification.success({
            message: "Signup Successful!",
            description: "",
            duration: 4,
          });
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
      event,
      eventSignupVisible,
      myPeeps,
      image,
    } = this.state;

    var eventCard = ["Nothing to see here."];

    if (event && image) {
      eventCard = this.eventCard(event);
    }

    const stripeView = [
      <div className="session" style={{ paddingLeft: 15, paddingRight: 15 }}>
        <StripeContainer />
      </div>,
    ];

    return eventCard;
  }

  handleToken(token, addresses) {
    console.log(token, addresses);
  }
}

export default withRouter(EventDetail);
